# Why TagPiper?

I built TagPiper for four reasons.

## 1. To learn

The best way to understand how server-side tagging really works is to build it. That means how a client claims a request, how GA4 hits turn into events, what the sandbox does and doesn't allow, and where the time and memory go on every hit.

TagPiper started as that exercise: rebuilding the Google sGTM model from scratch, with nothing hidden. Every behaviour had to be understood before it could be written, and every difference from Google sGTM had to be found, measured and documented. The [API reference](./api/) and its "Differences from Google sGTM" notes come straight out of that work.

## 2. To make server-side tagging cheaper to run

Server-side tagging runs on every page view and every event, so its cost grows with your traffic. The less CPU and memory each hit uses, the fewer and smaller servers you pay for.

TagPiper is built for a small footprint:

- a **4.1 MB** image and a **9.2 MB** static binary ([details](./image))
- about **7 MiB** of memory at idle, on one CPU and 256 MB
- Rust and a pool of pre-warmed QuickJS VMs, with no OS or runtime layer underneath
- outgoing hits sent from a background queue, so no worker sits idle waiting on the network

It is also **multi-core**. Google sGTM runs on Node.js, which executes JavaScript on a single thread, so each instance uses one core, and more traffic means more instances. TagPiper uses every core it's given, so one larger instance can do the work of several. And it sizes itself from the container's CPU and memory limits, so you can run it on the smallest instances your platform offers.

::: info Real-usage benchmarks are coming
The [current benchmarks](./benchmarks) measure the HTTP layer. Benchmarks with real GA4 traffic, and a side-by-side run against Google sGTM on the same hardware, will show what the smaller footprint means for real hosting costs.
:::

## 3. To add any functionality natively

With Google sGTM, you can extend the container only through its template sandbox, and only with the APIs Google provides. Anything else has to wait for Google.

TagPiper is my own server, so anything can be built into it natively, in Rust, at full speed, with no need to wait for a vendor. These are already built into the server itself:

- a [background send queue](./how-it-works#outgoing-requests), with retries, backoff and a drain on shutdown
- [SSRF protection](./how-it-works#ssrf-protection) for every outgoing request
- a [debug page](./playground#debugging-real-hits) for any single real hit
- [delivery counters](./how-it-works#counters) for every hit sent, dropped or given up on

Adding a sandbox API is just as direct: one JavaScript file, plus a Rust binding when it needs the host. See [how APIs are added](./api/#not-available-yet).

## 4. To have a server that is fully auditable

A server-side container sees your visitors' IP addresses, user agents, client IDs and everything your site sends. You should be able to verify exactly what it does with that data.

With TagPiper, you can:

- **read every line** of the server that handles your data, from the HTTP layer to the outgoing requests
- **see every outgoing request** a hit causes, on the [debug page](./playground#debugging-real-hits) or in the logs, with query strings redacted by default
- **count every hit** in [`/system`](./how-it-works#counters), so hits that were dropped or never delivered don't go missing silently
- **know exactly what runs**, because the whole server is one [static binary](./image) with no OS packages or hidden dependencies, built from source you can inspect. Unlike Google sGTM, whose image fetches its server code from Google on every start-up, TagPiper ships its code in the build: nothing is downloaded, and nothing changes until you deploy a new version

The server has also had a full code audit. Each finding was reproduced against the running server, measured and fixed, from SSRF bypasses to memory exhaustion.

TagPiper is open source. The server source will be published with the public release in **Q4 2026**.

---

TagPiper is a TagPiper Labs project by [Analytics Debugger S.L.U.](https://www.analytics-debugger.com). It is in development, with its public release planned for **Q4 2026** ([builds](./#builds)). If any of these reasons matter to you too, [see how it works](./how-it-works), or help build it by improving these docs.
