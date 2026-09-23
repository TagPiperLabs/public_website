# Getting started

::: info Public release: Q4 2026
The Docker image below will be published with TagPiper's public release in **Q4 2026**. The commands on this page show how it will work. See [where builds will be ready](./#builds).
:::

## Run with Docker

TagPiper is published as a multi-architecture image (`linux/amd64` and `linux/arm64`) on GitHub Container Registry:

```sh
docker run --rm -p 8080:8080 --cpus=1 --memory=256m \
  -e PORT=8080 -e PLAYGROUND=1 -e OUTGOING_DRY_RUN=1 \
  ghcr.io/tagpiperlabs/sst-server:latest
```

The image defaults to production settings: the playground is **off** and hits are **really sent**. The two variables above reverse both for local testing:

- `PLAYGROUND=1` turns on the browser playground at `/`.
- `OUTGOING_DRY_RUN=1` means tags don't send anything out.

On start-up the server prints the budget it detected and how it sized itself:

```
sst-server v0.0.1-beta.0 listening on [::]:8080
  cpu    1.00 cores (cgroup v2), 1 http threads
  memory 256 MB (cgroup v2), 51 MB per vm
  pool   4 workers, queue 1024
  playground ENABLED at / (arbitrary code execution) — set PLAYGROUND=0 or PLAYGROUND_TOKEN in production
```

Check that it is up:

```sh
curl http://localhost:8080/healthz
# ok
```

## Open the playground

Go to [http://localhost:8080/](http://localhost:8080/). You can write a template, give it a simulated request and see its logs, events and response. See [Playground & debugging](./playground).

## Send a GA4 hit

The built-in container has a [GA4 client](./templates#ga4-client) and a [GA4 tag](./templates#ga4-tag). The client claims GA4 hits and answers `204`:

```sh
curl -i "http://localhost:8080/g/collect?v=2&tid=G-XXXXXXX&cid=123.456&en=page_view&dl=https%3A%2F%2Fexample.com%2F"
# HTTP/1.1 204 No Content
```

Add `__debug` to the query to see what happened instead:

```sh
curl "http://localhost:8080/g/collect?v=2&tid=G-XXXXXXX&cid=123.456&en=page_view&__debug"
```

No client claims a request that isn't GA4, so it gets `400`:

```sh
curl -i http://localhost:8080/anything-else
# HTTP/1.1 400 Bad Request
# no client claimed the request
```

## Build from source

You need Rust 1.80 or later and a C compiler (QuickJS is C).

```sh
cargo build --release
./target/release/sst-server
```

Or build the image yourself:

```sh
docker build -t sst-server .
```

Run straight from the binary and the defaults are the reverse of the image: the playground is **on** and outgoing hits are **dry-run**. Set `OUTGOING_DRY_RUN=0` to send for real.

## Next

- [How it works](./how-it-works)
- [Configuration](./configuration)
