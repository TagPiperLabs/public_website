# What is TagPiper?

TagPiper is the **lightweight, open-source server-side tagging alternative** to Google sGTM: a server-side tag manager that you host yourself. It receives tracking requests on your own domain (for example GA4 hits from `gtag.js`), turns them into events, and forwards those events to vendors such as Google Analytics. It does this from your server, not the visitor's browser.

It follows the model of [Google server-side Tag Manager](https://developers.google.com/tag-platform/tag-manager/server-side) (Google sGTM) and runs the same kind of templates:

- **Clients** look at each incoming request. The client that recognises a request *claims* it, builds event data from it and calls `runContainer(event)`.
- **Tags** run for each event and send it somewhere, such as the GA4 collection endpoint.

### Your Google sGTM templates, mostly as they are

We replicated the current Google sGTM **sandboxed JavaScript API** for templates. It has the same `require()` names, the same arguments and return values, and the same sandbox rules, down to the validator's error messages. Most Google sGTM templates can be used directly. The exceptions are templates that use an API TagPiper doesn't have yet (such as Firestore, BigQuery or cookies) or that rely on one of the few documented differences. See [Template compatibility](./comparison#template-compatibility) and the [API reference](./api/).

## What you get

Why I built it (learning, lower running costs, native extensibility and a fully auditable server) is told on [Why TagPiper?](./why).

- **Fast and small.** Written in Rust on [axum](https://github.com/tokio-rs/axum), with a pool of warm [QuickJS](https://bellard.org/quickjs/) VMs. Outgoing hits go out from a background queue, so a slow vendor never slows down your visitors.
- **Multi-core.** Google sGTM runs on Node.js, which is single-threaded, so each instance uses one core. TagPiper uses every CPU core it's given, with HTTP threads and JavaScript VMs on each one.
- **Self-hosted.** One static binary, shipped on a `scratch` image. It sizes itself from the container's CPU and memory limits.
- **Reliable.** Failed sends are retried with backoff. The queue drains on shutdown, and every hit is counted in `/system`.
- **Safe by default.** Templates can't reach private addresses or cloud metadata. The playground and debug pages can be locked behind a token.
- **Easy to debug.** A browser [playground](./playground) for running templates, and a [debug view](./playground#debugging-real-hits) for real hits.

## Status

::: info Public release: Q4 2026
TagPiper will be publicly released in **Q4 2026**. It is open source: the server source and the Docker image will both be published then. Until the release, it is in development and runs a built-in container with a GA4 client and a GA4 tag. See [Built-in templates](./templates).

A self-hosted [management UI](./ui) for containers, tags, firing rules, variables, stats and monitoring is in development.
:::

### Builds

Builds will be ready with the Q4 2026 release, all in one place: **`ghcr.io/tagpiperlabs/sst-server`** on GitHub Container Registry, for `linux/amd64` and `linux/arm64`. Every release will be published there under its version number and as `latest`. See [Binary & Docker image](./image).

TagPiper is a TagPiper Labs project by [Analytics Debugger S.L.U.](https://www.analytics-debugger.com).

## Next steps

- [Why TagPiper?](./why): why I built it.
- [Management UI](./ui): the web app for managing containers, tags and more (in development).
- [Getting started](./getting-started): run TagPiper locally in a few minutes.
- [How it works](./how-it-works): the request flow, the VM pool and outgoing requests.
- [TagPiper vs Google sGTM](./comparison): how the two compare, and which to choose.
- [Benchmarks](./benchmarks): `/healthz` throughput, CPU and memory under Docker limits. Real-usage benchmarks are coming.
- [Configuration](./configuration): every environment variable.
