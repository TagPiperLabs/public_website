# Benchmarks

::: info Real-usage benchmarks are coming
This page currently covers the **`/healthz` endpoint** only. It measures the HTTP layer: how many requests the server accepts and answers, and the CPU and memory it uses to do so. Benchmarks with real GA4 hits running through clients and tags, including a comparison with Google sGTM, are in progress and will be published here.
:::

## `/healthz` results

The published Docker image, run with Docker CPU and memory limits, under a steady load of 100 connections for 30 seconds:

| | 1 CPU | 2 CPUs | 4 CPUs |
| --- | --- | --- | --- |
| **Requests per second** | **285,471** | **462,705** | **751,943** |
| Latency p50 / p99 | 0.35 / 0.38 ms | 0.21 / 0.39 ms | 0.11 / 0.40 ms |
| **CPU used** (average / peak) | 70% / 75% | 139% / 153% | 255% / 283% |
| **Memory**, idle | 6.8 MiB | 9.0 MiB | 11.3 MiB |
| **Memory** under load (average / peak) | 12.1 / 16.9 MiB | 14.6 / 15.3 MiB | 19.7 / 20.8 MiB |
| Memory limit | 256 MiB | 512 MiB | 1 GiB |
| Requests served | 8,564,303 | 13,880,435 | 22,558,337 |
| Errors | 0 | 0 | 0 |

Throughput grows with the CPUs the container is given, because TagPiper runs on every core, unlike Google sGTM's single-threaded Node.js runtime. CPU is shown as a share of one core, so 255% means about 2.5 of the 4 cores. The server **never used its full CPU allowance**: the load generator reached its own limit first. Treat these numbers as a lower bound on what the HTTP layer can handle, not a ceiling.

### What `/healthz` doesn't tell you

`/healthz` answers `ok` straight from the HTTP router. It doesn't run any JavaScript, templates or outgoing sends. Real GA4 hits cost much more per request than this, so **don't size a deployment from these numbers**. The real-usage benchmarks will cover that.

## Setup

| | |
| --- | --- |
| TagPiper | `0.0.1-beta.0`, the published image (static musl binary on `scratch`, 4.1 MB compressed), built from source |
| Container limits | `--cpus=1, 2, 4` with `--memory=256m, 512m, 1g`, pinned to separate physical P-cores with `--cpuset-cpus` |
| Networking | `--network host`. Docker's port publishing (`-p`) sends loopback traffic through its userland proxy, which ran outside the container's limits and became the bottleneck. Host networking measures TagPiper itself. |
| CPU | Intel Core i5-13600K |
| OS | Linux 7.2 (CachyOS), Docker 29.8 |
| Load generator | [bombardier](https://github.com/codesenberg/bombardier), 100 connections, pinned to the 8 E-cores |
| Duration | 10 s warm-up, then 30 s measured |
| CPU and memory | Sampled continuously with `docker stats` during the measured run |

## Run it yourself

```sh
# Server: 1 CPU, 256 MB, pinned to one core
docker run -d --name tp-bench --network host \
  -e PORT=18080 -e STATS_SECS=0 \
  --cpus=1 --cpuset-cpus=2 --memory=256m \
  ghcr.io/tagpiperlabs/sst-server:latest

# Load, from other cores: warm up, then measure
taskset -c 12-19 bombardier -c 100 -d 10s http://127.0.0.1:18080/healthz > /dev/null
taskset -c 12-19 bombardier -c 100 -d 30s -l http://127.0.0.1:18080/healthz

# In another terminal, while the load runs
docker stats tp-bench
```

Choose CPUs that match your machine (`lscpu -e` lists them), and keep the server and the load generator on separate physical cores.
