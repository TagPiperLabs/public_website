# TagPiper vs Google sGTM

TagPiper is a lightweight, open-source alternative to Google sGTM. It runs the same template model as [Google server-side Tag Manager](https://developers.google.com/tag-platform/tag-manager/server-side) (Google sGTM): clients claim requests, tags fire per event, and templates use the same sandboxed JavaScript APIs. Where the two differ is in how they are built, run and managed.

::: info Public release: Q4 2026
TagPiper is in development, with its public release planned for Q4 2026. Google sGTM is a mature, fully managed product. This page is meant to help you choose, so it lists what TagPiper doesn't do yet as plainly as what it does.
:::

## At a glance

| | Google sGTM | TagPiper |
| --- | --- | --- |
| **Source** | Closed source | Open source (published with the Q4 2026 release) |
| **Runtime** | Node.js with the V8 JavaScript engine, in a Docker image published by Google | Rust (axum) with the QuickJS JavaScript engine, as one static binary |
| **Where it runs** | Cloud Run (automatic setup), or any Docker host (manual setup) | Any container host, or the bare binary |
| **Image** | Google's `gtm-cloud-image` | [`scratch` image](./image): 4.1 MB download, 9.2 MB static binary, amd64 and arm64 |
| **Server code** | Fetched from Google on start-up. The image is only a bootstrap. | Compiled into the binary at build time. What you deploy is what runs. |
| **Configuration** | Tag Manager web UI: workspaces, versions, environments | Built-in container for now. A self-hosted [management UI](./ui) (Nuxt 4, Tailwind, PostgreSQL) is in development. |
| **Triggers and variables** | Yes | Not yet: every tag fires for every event. Firing rules and variables are coming with the [UI](./ui). |
| **Template model** | Clients, tags, variables, sandboxed JS | Clients and tags, sandboxed JS |
| **Sandbox APIs** | Full set | [36 APIs](./api/), with some [differences](./api/#not-available-yet) |
| **Template Gallery** | Yes, with community templates | No |
| **Template permissions** | Per-template permissions (which URLs, cookies, …) | Not yet. Private and internal addresses are always blocked ([SSRF protection](./how-it-works#ssrf-protection)). |
| **Built-in templates** | GA4 and Measurement Protocol clients, GA4, Google Ads, Floodlight and other tags | GA4 client and GA4 tag |
| **Firestore / BigQuery** | Yes | Not yet |
| **Cookies** | `setCookie`, `getCookieValues` | Not yet |
| **Debugging** | Preview mode in Tag Assistant, from a separate preview server | [Debug page](./playground#debugging-real-hits) for any hit (`?__debug`), plus a [playground](./playground) |
| **Outgoing requests** | The template's Promise resolves with the vendor's response | [Queued by default](./how-it-works#outgoing-requests), with retries and a drain on shutdown. `{ wait: true }` for the response. |
| **CPU cores** | **Single-threaded**: Node.js runs JavaScript on one thread, so an instance uses one core. Scale by adding instances. | **Multi-core**: HTTP threads and JavaScript VMs on every core it's given. One container can use 1, 2, 4 or more CPUs. |
| **Resource sizing** | Set per instance in your hosting | Reads the container's CPU and memory limits and sizes itself |
| **Cost** | Free product. You pay for hosting. | Self-hosted. You pay for hosting. |

## Architecture

### Google sGTM

You create a server container in the Tag Manager UI and deploy Google's image with that container's `CONTAINER_CONFIG`. It runs on Node.js, which executes JavaScript on a **single thread**: each instance processes hits on one CPU core, and extra cores in the instance sit mostly idle. To handle more traffic you add instances. The image is a **bootstrap**: on start-up it fetches the server code from Google, so the code that handles your traffic is whatever Google serves at that moment, not something fixed in the image you deployed. A second deployment of the same image runs as the **preview server**, which powers preview mode. The tagging servers fetch the published container version from Google, so publishing in the UI updates them without a redeploy.

### TagPiper

TagPiper **ships its code in the build**. Everything is compiled into one binary: serving hits, running templates, sending outgoing requests, and the debug and playground pages. Nothing is downloaded at start-up, so a given image always runs exactly the same code, and a change happens only when you deploy a new version. There is no separate preview server. TagPiper is **multi-core**: it handles HTTP on one thread per CPU and runs templates on a pool of pre-warmed, sealed QuickJS VMs (4 per CPU), so hits are processed on all available cores at once. Give a container more CPUs and it uses them. Outgoing requests leave through a bounded background queue with its own sender threads, so a slow vendor doesn't hold up the response to the browser.

Today TagPiper runs a container that is built in: the GA4 client and GA4 tag. The [management UI](./ui) is in development. It is a self-hosted Nuxt 4, Tailwind and PostgreSQL app for managing containers, clients, tags, firing rules, variables, versions, stats and monitoring. It keeps the configuration, so the servers that handle your traffic stay lightweight.

## Template compatibility

We replicated the current Google sGTM sandboxed JavaScript API for templates: the same `require()` names, arguments and return values, the same sandbox rules (no ambient `Object`, `Math` or `JSON`, no `eval`), and the same validation, with the same error messages. **Most Google sGTM templates can be used directly.** In practice:

- Templates that only use [supported APIs](./api/) run as they are. That covers reading the request, setting the response, `runContainer`, HTTP sends, and string, URL and regex helpers.
- A few APIs behave differently. Each difference is listed on the API's page, under **Differences from Google sGTM**. The main ones: [`getRequestQueryString`](./api/getRequestQueryString) keeps the leading `?`, the second argument of [`setResponseBody`](./api/setResponseBody) is a content type, and [`sendHttpRequest`](./api/sendHttpRequest) queues by default.
- Templates that use Firestore, BigQuery, cookies, `getEventData` or the other [missing APIs](./api/#not-available-yet) won't run yet.
- Template **fields** and **permissions**, which Google sGTM stores alongside the code, aren't supported. A template gets its configuration in `data`.

TagPiper checks templates for undeclared identifiers before running them, and reports errors in Google sGTM's format: same message, same line and 0-based column. See [Validation](./api/#validation).

## Performance

On one CPU with 256 MB, TagPiper idles at about 7 MiB of memory, and its HTTP layer answers about 285,000 `/healthz` requests per second. See the [Benchmarks](./benchmarks) page for details.

::: info Real-usage benchmarks are coming
The current numbers measure the HTTP layer only. Benchmarks with real GA4 traffic through clients and tags, and a side-by-side run against Google sGTM on the same hardware, are in progress.
:::

We haven't benchmarked Google sGTM. Its image needs a real container config from a Tag Manager account, and publishing numbers we haven't measured would not be fair to either product. The benchmark script works against any endpoint, so you can run the same test against your own Google sGTM deployment.

## Which one should you use?

**Choose Google sGTM if** you need a full UI for your team today, triggers and variables, the Template Gallery, Google Ads and Floodlight tags, Firestore or BigQuery, or a managed setup on Cloud Run.

**Consider TagPiper if** you want to self-host a small, fast binary anywhere, want outgoing hits queued and retried for you, want to debug any single hit in the browser, and the GA4 client and tag cover what you need today. Or if you want to help build it.
