# Binary & Docker image

TagPiper is a single, statically linked binary. Its Docker image contains that binary and almost nothing else: no operating system, no shell and no package manager.

## Sizes

Measured on the `linux/amd64` image of `0.0.1-beta.0`:

| | Size |
| --- | --- |
| **Image download** (compressed) | **4.1 MB** |
| Image on disk (unpacked) | 9.4 MB |
| **Binary** | **9.2 MB** (9,163,376 bytes) |
| Binary, if symbols were stripped | 7.9 MB |
| Binary, gzip-compressed | 3.8 MB |

`docker image ls` shows a *disk usage* of 13.5 MB. That is the 9.4 MB unpacked image plus the 4.1 MB compressed copy that Docker keeps alongside it.

## What's in the image

The image is built `FROM scratch`, so it holds only what is copied into it:

| File | Size | Why |
| --- | --- | --- |
| `/usr/local/bin/sst-server` | 9.2 MB | The server: everything TagPiper does. |
| `/etc/ssl/certs/ca-certificates.crt` | 224 KB | A CA certificate bundle. The current build doesn't read it (see [TLS](#tls)). |
| `/etc/passwd` | 46 bytes | Defines the non-root user `10001`, so the process doesn't run as root. |

There is nothing else to patch, and nothing for an attacker to use: no `sh`, no `curl`, no libc.

## What's in the binary

Everything TagPiper needs is compiled or embedded into that one file:

| Part | What it is |
| --- | --- |
| HTTP server | [Tokio](https://tokio.rs) and [axum](https://github.com/tokio-rs/axum) |
| JavaScript engine | [QuickJS](https://bellard.org/quickjs/) (C, compiled in through [rquickjs](https://github.com/DelSkayn/rquickjs)) |
| Template validator | The [oxc](https://oxc.rs) parser and semantic analyser, for sGTM-style checks before a template runs |
| Outgoing HTTPS | [ureq](https://github.com/algesten/ureq) with [rustls](https://github.com/rustls/rustls): TLS written in Rust, with no OpenSSL |
| Root certificates | Mozilla's root store ([webpki-roots](https://github.com/rustls/webpki-roots)) |
| Public Suffix List | For [`computeEffectiveTldPlusOne`](./api/computeEffectiveTldPlusOne) |
| Regex engine | The linear-time [regex](https://github.com/rust-lang/regex) crate, for [`createRegex`](./api/createRegex) |
| Memory allocator | [mimalloc](https://github.com/microsoft/mimalloc) |
| Embedded files | The sandbox APIs, the built-in GA4 templates, the playground and the debug page |

The binary doesn't load any files or download any code at runtime, and it doesn't depend on any shared libraries (`ldd` reports *statically linked*). The code is fixed at build time: the image you deploy is the code that runs, from the first request to the last. That differs from Google sGTM, whose image is a bootstrap that fetches the server code from Google on start-up.

## How the image is built

The Dockerfile has two stages.

**1. Build stage** (`rust:1-slim-bookworm`)

- Installs `build-essential`, `musl-tools` and `musl-dev`. QuickJS and mimalloc are C code, so the build needs a C compiler that targets musl.
- Adds the musl target for the build machine's architecture: `x86_64-unknown-linux-musl` or `aarch64-unknown-linux-musl`.
- Builds the dependencies once with an empty `main.rs`, so Docker caches that layer and source changes don't recompile every crate.
- Builds the real binary with `cargo build --release --target <arch>-unknown-linux-musl`.

**2. Runtime stage** (`scratch`)

- Copies in the binary, the CA bundle and a one-line `/etc/passwd`.
- Sets production defaults: `PLAYGROUND=0` and `OUTGOING_DRY_RUN=0`.
- Adds a `HEALTHCHECK` that runs `sst-server healthcheck` every 15 seconds.
- Runs as user `10001`.

### Release profile

```toml
[profile.release]
opt-level = 3
lto = "fat"          # whole-program optimisation across all crates
codegen-units = 1    # one unit, so the optimiser sees everything at once
strip = "debuginfo"  # drop debug info, keep symbols
```

- **`lto = "fat"` and `codegen-units = 1`** let the compiler inline across crate boundaries (axum → worker pool → QuickJS bindings), which is the hot path of every hit. They make builds slower and the binary faster.
- **Symbols are kept.** Stripping them would save 1.2 MB (9.2 → 7.9 MB), but then a crash backtrace in production would show only addresses. Keeping readable backtraces is worth more than 1.2 MB.
- **`panic = "unwind"`** (the default) is kept on purpose: a panic inside one template run brings down that one worker, not the whole server.

## Why musl and `scratch`

**Static linking.** With musl, the C library is linked into the binary, so it runs on any Linux kernel without a matching glibc. That is what allows a `scratch` image, one with no OS layer at all.

**Small and safe.** Without an OS layer the image is 4 MB, and there are no OS packages to scan, patch or exploit.

**mimalloc instead of musl's allocator.** musl's built-in `malloc` is slow under heavy multi-threaded load. TagPiper replaces it with mimalloc as the global allocator, so a static musl build doesn't give up allocation speed.

## TLS

Outgoing HTTPS uses rustls, and the **Mozilla root certificates are compiled into the binary**. TagPiper doesn't read the operating system's certificate store. We tested an image with the CA bundle removed, and outgoing HTTPS still worked.

As a result:

- the certificate trust store is updated when TagPiper is rebuilt, not by the base image
- mounting a custom CA bundle into the container has no effect

## Health check without a shell

`scratch` has no shell and no `curl`, so the usual `HEALTHCHECK CMD curl …` can't work. Instead, the binary checks itself:

```sh
sst-server healthcheck
```

It connects to `127.0.0.1:$PORT`, requests `/healthz`, and exits with `0` on `200 OK` and `1` on anything else. The Dockerfile's `HEALTHCHECK` runs it every 15 seconds (3-second timeout, 5-second start period, 3 retries).

In Kubernetes, use an HTTP probe on `/healthz` instead. See [Deployment](./deployment#health-and-stats).

## Multi-architecture

Each release is built for **`linux/amd64`** and **`linux/arm64`** and published under the same tag. Docker picks the right one automatically. The build detects its architecture with `uname -m` and compiles for the matching musl target. The images are built by GitHub Actions on every version tag (`v*`), using QEMU for the architecture that isn't native.

## Build it yourself

```sh
# Image for your machine's architecture
docker build -t sst-server .

# Both architectures (needs Docker Buildx)
docker buildx build --platform linux/amd64,linux/arm64 -t sst-server .

# Just the static binary, without Docker (Linux, x86_64; needs musl-gcc from musl-tools)
rustup target add x86_64-unknown-linux-musl
cargo build --release --target x86_64-unknown-linux-musl
```
