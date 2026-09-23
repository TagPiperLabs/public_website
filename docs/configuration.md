# Configuration

TagPiper is configured entirely through environment variables, which are read once at start-up. Flags are on with `1` and off with `0`.

Where the Docker image sets a different default from the binary, both are shown.

## Server

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `8080` | Port to listen on, over IPv6 and IPv4. |
| `STATS_SECS` | `1` | How often to log the process's CPU and memory use. `0` turns it off. |
| `SHUTDOWN_DRAIN_SECS` | `30` | How long to wait for queued hits on shutdown. |

## Resource budget

Read from the container's cgroup when these aren't set.

| Variable | Default | Description |
| --- | --- | --- |
| `CPU_LIMIT` | cgroup, else host | CPU cores to size for, such as `2` or `0.5`. |
| `MEMORY_LIMIT` | cgroup, else host | Memory to size for: bytes, or with a `k`/`m`/`g` suffix. |

## JavaScript pool

| Variable | Default | Description |
| --- | --- | --- |
| `JS_VMS_PER_CPU` | `4` | Workers per CPU. |
| `JS_WORKERS` | CPUs × `JS_VMS_PER_CPU` | Number of workers. Overrides the line above. |
| `JS_MEMORY_MB` | 80% of memory ÷ workers | Heap cap per VM. Without a memory budget, 16 MB. |
| `JS_QUEUE_DEPTH` | max(workers × 128, 1024) | Jobs that may wait for a worker. Past this, requests get `503`. |
| `JS_VM_MAX_RUNS` | `1000` | Runs before a VM is rebuilt. |
| `JS_VM_IDLE_SECS` | `60` | Idle time before a VM is dropped. `0` keeps it for ever. |

## Outgoing requests

| Variable | Default | Description |
| --- | --- | --- |
| `OUTGOING_DRY_RUN` | binary: `1` · image: `0` | `1`: don't send anything. |
| `OUTGOING_WAIT` | `0` | `1`: every send waits for its response instead of being queued. |
| `OUTGOING_WORKERS` | `256` | Sender threads. |
| `OUTGOING_QUEUE_DEPTH` | `10000` | Hits that may wait to be sent. Past this, hits are dropped. |
| `OUTGOING_MAX_ATTEMPTS` | `3` | Tries per hit, including the first. |
| `OUTGOING_ALLOW_PRIVATE` | `0` | `1`: allow sends to private, loopback and link-local addresses. See [SSRF protection](./how-it-works#ssrf-protection). |
| `OUTGOING_LOG` | `1` | Log each send. |
| `OUTGOING_LOG_FULL` | `0` | `1`: log whole URLs, query strings included. These contain client IDs, IPs and user agents. |
| `DNS_TTL_SECONDS` | `60` | How long a host's SSRF check result is cached. |

## Playground and debugging

| Variable | Default | Description |
| --- | --- | --- |
| `PLAYGROUND` | binary: `1` · image: `0` | The playground UI at `/`, plus `POST /run` and `POST /template`. |
| `PLAYGROUND_TOKEN` | none | Required as `Authorization: Bearer …` or a `playground_token` cookie for the playground and for debug pages. |
| `DEBUG_HITS` | `0` | `1`: every hit renders the debug page. |
| `DEBUG_ON_NAVIGATE` | `0` | `1`: opening a collect URL in a browser renders the debug page. |

## Hard limits

These can't be raised by configuration or by a request.

| Limit | Value |
| --- | --- |
| Timeout per run | 5 s maximum (100 ms default) |
| Heap per VM | 128 MB |
| Template source size | 1 MB |
