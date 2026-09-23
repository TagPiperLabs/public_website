---
layout: home
title: TagPiper
titleTemplate: The lightweight, open-source server-side tagging alternative

hero:
  name: TagPiper
  text: The lightweight, open‑source server‑side tagging alternative
  tagline: TagPiper replicates Google sGTM's sandboxed template API, on a 4 MB image you host yourself, with a built-in debugger.
  image:
    src: /favicon.svg
    alt: TagPiper
  actions:
    - theme: brand
      text: Get started
      link: /docs/getting-started
    - theme: alt
      text: Compare with Google sGTM
      link: /docs/comparison

features:
  - icon: 🧩
    title: Bring your Google sGTM templates
    details: We replicated Google sGTM's sandboxed JavaScript API, with the same require() names, arguments and results. Most templates run directly, and they are validated with the same rules and error messages.
    link: /docs/comparison#template-compatibility
    linkText: Template compatibility
  - icon: ⚡
    title: Fast by design
    details: Rust and warm QuickJS VMs on every CPU core. Google sGTM is single-threaded, while TagPiper uses all the cores you give it. Outgoing hits leave from a background queue.
    link: /docs/benchmarks
    linkText: See the benchmarks
  - icon: 🪶
    title: One static binary
    details: A 4 MB scratch image for amd64 and arm64, with a built-in health check. It reads the container's CPU and memory limits and sizes itself to fit.
    link: /docs/image
    linkText: Binary & image
  - icon: 📬
    title: Hits that arrive
    details: Failed sends are retried with backoff. The queue drains before the server shuts down, and /system counts every hit that was sent, dropped or given up on.
    link: /docs/how-it-works#outgoing-requests
    linkText: Outgoing requests
  - icon: 🛡️
    title: Safe defaults
    details: Templates can't reach private networks or cloud metadata, logs leave out query strings, and the playground and debug pages can be locked behind a token.
    link: /docs/deployment#production-checklist
    linkText: Production checklist
  - icon: 🔍
    title: Playground and debug view
    details: Run templates in your browser. Add ?__debug to a real hit to see what each client did, the events it built and the tags that fired.
    link: /docs/playground
    linkText: Playground & debugging
---

<div class="tp-section">
  <h2>Why I built TagPiper</h2>
  <p class="tp-lead">Four reasons, from learning how server-side tagging really works to owning every line of it.</p>
  <div class="tp-why">
    <div>
      <h3>🎓 To learn</h3>
      <p>Rebuilding the Google sGTM model from scratch is the best way to understand exactly how server-side tagging works.</p>
    </div>
    <div>
      <h3>💸 To cut running costs</h3>
      <p>Less CPU and memory per hit means fewer, smaller servers. TagPiper is a 4 MB image that idles at about 7 MiB.</p>
    </div>
    <div>
      <h3>🧱 To build features natively</h3>
      <p>Anything can go straight into the server, in Rust, without waiting for a vendor. Examples: send queues, retries and SSRF protection.</p>
    </div>
    <div>
      <h3>🔎 To be fully auditable</h3>
      <p>Every line that handles your visitors' data can be read, and every outgoing request can be seen and counted.</p>
    </div>
  </div>

  <div class="tp-more">

[Read the full story →](/docs/why)

  </div>
</div>

<div class="tp-section">
  <h2>Lightweight by design</h2>
  <p class="tp-lead">Measured on the published image, with Docker limited to one CPU and 256 MB.</p>
  <div class="tp-stats">
    <div><strong>4 MB</strong><span>compressed image</span></div>
    <div><strong>7 MiB</strong><span>memory at idle</span></div>
    <div><strong>285k</strong><span><code>/healthz</code> requests per second</span></div>
    <div><strong>0.4 ms</strong><span>p99 latency</span></div>
  </div>
  <div class="tp-note">

**Real-usage benchmarks are coming.** The numbers above measure the HTTP layer only. Benchmarks with real GA4 traffic through clients and tags, and a side-by-side comparison with Google sGTM, will follow. [See the benchmarks](/docs/benchmarks).

  </div>
</div>

<div class="tp-section">
  <h2>A UI to manage it all <span class="tp-soon">In development</span></h2>
  <p class="tp-lead">A self-hosted web app, built with Nuxt 4, Tailwind and PostgreSQL. It keeps your configuration, so the servers that handle your traffic stay lightweight.</p>
  <div class="tp-why">
    <div>
      <h3>📦 Containers, clients and tags</h3>
      <p>Create containers, add clients and tags, and configure their fields. Import your Google sGTM templates.</p>
    </div>
    <div>
      <h3>🎯 Firing rules and variables</h3>
      <p>Decide which tags fire for which events, with reusable variables and lookups.</p>
    </div>
    <div>
      <h3>📈 Stats and monitoring</h3>
      <p>Follow hits and tag results over time, and watch every server's health: CPU, memory, queue and delivery.</p>
    </div>
    <div>
      <h3>🕒 Versions and debugging</h3>
      <p>Publish container versions, see what changed, and inspect any single hit from end to end.</p>
    </div>
  </div>
  <div class="tp-more">

[About the UI →](/docs/ui)

  </div>
</div>

<div class="tp-section">
  <h2>How it works</h2>
  <p class="tp-lead">If you've used Google sGTM, you already know the model. TagPiper runs the same model on a lightweight server you control.</p>
  <div class="tp-flow">
    <div>
      <h3>A request comes in</h3>
      <p>A browser or app sends a hit, such as a GA4 <code>/g/collect</code> request, to your TagPiper endpoint on your own domain.</p>
    </div>
    <div>
      <h3>A client claims it</h3>
      <p>Each client template gets a turn with the request. The one that claims it builds the event data and calls <code>runContainer</code>.</p>
    </div>
    <div>
      <h3>Tags fire</h3>
      <p>Tags get each event and send it on. The browser gets its response right away, and the sends are delivered and retried in the background.</p>
    </div>
  </div>
</div>

<div class="tp-section">
  <h2>Up and running in a minute</h2>
  <p class="tp-lead">Pull the image, start it with the playground on, and open it in your browser.</p>

```sh
docker run --rm -p 8080:8080 --cpus=1 --memory=256m \
  -e PORT=8080 -e PLAYGROUND=1 -e OUTGOING_DRY_RUN=1 \
  ghcr.io/tagpiperlabs/sst-server:latest

# then open http://localhost:8080/
```

</div>

<div class="tp-cta">
  <h2>Help us build the docs</h2>
  <p>This site is plain Markdown on GitHub. Every page has an “Edit this page” link.</p>
  <a href="https://github.com/TagPiperLabs">TagPiper Labs on GitHub</a>
</div>
