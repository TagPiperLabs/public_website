# Deployment

## The image

TagPiper ships as a fully static binary (Rust, musl) on a `scratch` image: a **4.1 MB download** (9.4 MB unpacked), with a 9.2 MB binary. See [Binary & Docker image](./image) for what's inside and how it's built.

```sh
docker pull ghcr.io/tagpiperlabs/sst-server:latest
```

| Tag | Meaning |
| --- | --- |
| `latest` | The newest release |
| `0.0.1-beta.0` | An exact version |
| `0.0` | The newest release in a minor series |

Every tag is published for `linux/amd64` and `linux/arm64`, so the same image runs on x86 servers, AWS Graviton and Apple Silicon.

The image:

- listens on `PORT` (set `PORT=8080`)
- runs as a non-root user (`10001`)
- has **production defaults**: `PLAYGROUND=0` and `OUTGOING_DRY_RUN=0`
- has a built-in `HEALTHCHECK`, using the binary's own `sst-server healthcheck` subcommand, because there is no shell or curl in the image

## Sizing

TagPiper reads the container's cgroup limits, not the host's CPU count or memory, and sizes itself to match:

- **CPU:** HTTP threads = CPUs. JS workers = 4 × CPUs. TagPiper is multi-core, so one container can use several CPUs. Google sGTM's Node.js runtime is single-threaded, so there you scale by adding instances.
- **Memory:** 80% of the limit is shared between the JS VMs, each with a heap cap of 4–128 MB. The rest is left for the runtime and buffers.

Always give the container a CPU **and** a memory limit:

```sh
docker run -d -p 8080:8080 --cpus=1 --memory=256m -e PORT=8080 \
  ghcr.io/tagpiperlabs/sst-server:latest
```

```yaml
# Kubernetes
resources:
  limits:
    cpu: "1"
    memory: 256Mi
```

Without a cgroup limit, you can set the budget directly with `CPU_LIMIT` (cores, such as `2` or `0.5`) and `MEMORY_LIMIT` (bytes, or with a `k`/`m`/`g` suffix, such as `512m`).

## Health and stats

| Path | Returns |
| --- | --- |
| `/healthz` | `ok`. Use it for liveness and readiness probes. |
| `/system` | JSON counters for outgoing hits and the JS pool. See [Counters](./how-it-works#counters). |

The server also logs its own CPU and memory use every `STATS_SECS` seconds (1 by default, `0` turns it off).

## Behind a load balancer

`getRemoteAddress()` returns the first of these that is present: `CF-Connecting-IP`, `X-Real-IP`, the left-most entry of `X-Forwarded-For`, then the connection's IP. The GA4 tag forwards that value to Google as the visitor's IP.

Make sure your proxy **sets** these headers, and that clients can't reach TagPiper directly with headers of their own.

## Shutdown

On `SIGTERM` or `SIGINT`, TagPiper stops accepting connections, then waits up to `SHUTDOWN_DRAIN_SECS` (30 s) for queued hits to be sent. Set your orchestrator's grace period longer than that (for example, Kubernetes `terminationGracePeriodSeconds: 40`), or queued hits will be lost when the container is killed.

## Production checklist

- [ ] `PLAYGROUND=0`, or a strong `PLAYGROUND_TOKEN`.
- [ ] `OUTGOING_DRY_RUN=0` (the image's default), or nothing is sent.
- [ ] `DEBUG_HITS` and `DEBUG_ON_NAVIGATE` unset.
- [ ] CPU and memory limits on the container.
- [ ] A shutdown grace period longer than `SHUTDOWN_DRAIN_SECS`.
- [ ] Served on a first-party subdomain (such as `sst.example.com`) behind a proxy that sets `X-Forwarded-For`.
- [ ] Alerts on `outgoing.dropped` and `outgoing.gave_up` in `/system`.
