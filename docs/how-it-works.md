# How it works

## Request flow

```
request ─▶ axum ─┬▶ /, /run, /template    (playground)
                 ├▶ /healthz, /system
                 └▶ anything else ─▶ clients, one at a time
                                          │ first to call claimRequest() owns it
                                          ▼
                                  runContainer(event)
                                          │
                                          ▼
                                 tags fire per event ─▶ outgoing queue
```

1. A request arrives. The built-in routes are handled first: the [playground](./playground) (`/`, `POST /run`, `POST /template`), `/healthz` and `/system`.
2. Every other request is offered to the container's **clients**, one at a time. The first client to call `claimRequest()` owns the request.
3. The client reads the request with APIs such as `getRequestPath`, `getRequestQueryString` and `getRequestBody`, builds the event data and calls `runContainer(event)`.
4. The **tags** run for that event and send it on with `sendHttpRequest` or `sendHttpGet`.
5. The client sets the response with `setResponseStatus`, `setResponseHeader` and `setResponseBody`, then calls `returnResponse()`.

| Outcome | Response |
| --- | --- |
| No client claims the request | `400 no client claimed the request` |
| The claiming client throws or times out | `500 client error` |
| The JS queue is full | `503 busy` |

A client that fails does not pass the request on to the next client. A failure is a bug in the template, so it is reported instead.

## The VM pool

Templates run on a fixed pool of worker threads. Each worker owns one QuickJS VM.

- **Multi-core:** HTTP is served on one thread per CPU, and templates run on 4 workers per CPU by default (`JS_VMS_PER_CPU`, `JS_WORKERS`), so every core processes hits at the same time. Google sGTM runs JavaScript on Node.js's single thread, one core per instance. CPU is read from the container's cgroup limit, not the host.
- **Memory:** each VM has its own heap cap. The pool gets 80% of the container's memory limit, shared between the VMs, with a minimum of 4 MB and a maximum of 128 MB per VM. When memory is too tight for the requested number of workers, the pool shrinks rather than giving each VM less than 4 MB.
- **Sealed:** every VM loads the runtime and the APIs, then freezes its globals and built-ins. Request state is reset between runs, so one hit can't see another's data.
- **Recycling:** a VM is rebuilt after `JS_VM_MAX_RUNS` runs (1000) and dropped after `JS_VM_IDLE_SECS` idle (60 s).
- **Timeouts:** each run has a 100 ms budget by default, including time spent waiting in the queue. A job whose budget ran out while it was queued is dropped as soon as a worker picks it up, so a backlog drains instead of piling up.

### Validation

QuickJS only reports an undeclared name when execution reaches it, so a typo on a branch that rarely runs could go unnoticed. TagPiper parses each template before running it and rejects any identifier that isn't declared in the template or on the list of permitted globals. Google sGTM rejects templates the same way.

## Outgoing requests

Tags should not keep a worker, or the visitor, waiting on the network. By default, `sendHttpRequest` and `sendHttpGet` hand the request to a **bounded background queue** and return right away.

- **Senders:** `OUTGOING_WORKERS` threads (256) that only wait on I/O. The queue holds `OUTGOING_QUEUE_DEPTH` hits (10,000). When it is full, new hits are dropped and counted.
- **Retries:** transport failures, `429`s and `5xx`s are retried with exponential backoff from 250 ms, up to `OUTGOING_MAX_ATTEMPTS` (3) attempts. Other `4xx`s are not retried, because the hit itself is wrong.
- **Graceful shutdown:** on `SIGTERM`, the server stops accepting connections and then waits up to `SHUTDOWN_DRAIN_SECS` (30 s) for queued hits and retries to finish.
- **Waiting:** a template can pass `{ wait: true }` to get the real response. `OUTGOING_WAIT=1` makes every send wait. Debug runs don't wait, so they behave exactly like the hit they show.

### SSRF protection

A template can name any URL, so TagPiper resolves each target host and refuses private destinations: loopback, private ranges, `0.0.0.0/8` (which reaches localhost on Linux), link-local (including cloud metadata at `169.254.169.254`), carrier-grade NAT, unique-local IPv6, and the IPv4-mapped and IPv4-compatible IPv6 forms of all of these. Because it checks the resolved address, a public hostname that points at a private IP is caught too. Results are cached per host for `DNS_TTL_SECONDS`.

Set `OUTGOING_ALLOW_PRIVATE=1` only when a template really needs to reach a neighbouring service.

### Counters

`GET /system` shows what happened to every outgoing hit since start-up:

```json
{
  "version": "0.0.1-beta.0",
  "outgoing": {
    "queued": 1200, "sent": 1195, "failed": 2, "retried": 3,
    "dropped": 0, "gave_up": 0, "pending": 5, "dry_run": false
  },
  "js": { "workers": 4, "queue_pending": 0 }
}
```

`dropped` (the queue was full) and `gave_up` (out of retries) are hits that never reached the vendor. Watch them.
