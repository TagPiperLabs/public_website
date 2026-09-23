# Playground & debugging

::: danger The playground runs arbitrary code
`POST /run` runs JavaScript **outside** the sandbox. `POST /template` runs inside it, but can still send HTTP requests from your server. Never expose them to the internet without a token. The Docker image turns them off (`PLAYGROUND=0`). When you do turn them on, set `PLAYGROUND_TOKEN`.
:::

## The playground

With `PLAYGROUND=1`, open `/` on your server, for example [http://localhost:8080/](http://localhost:8080/). There are two modes:

- **Sandboxed:** runs your code as an Google sGTM template. It gets `require()`, a `data` object and a simulated request (method, path, query, headers, body).
- **Raw JS:** runs plain JavaScript in QuickJS, with no sandbox APIs.

Each run shows its status, `logToConsole` output, duration, memory used, and the events and response the template produced.

### The HTTP API

The UI is built on two endpoints you can also call yourself:

```sh
curl -X POST http://localhost:8080/template \
  -H 'Content-Type: application/json' \
  -d '{
    "source": "const log = require(\"logToConsole\"); log(\"path:\", require(\"getRequestPath\")());",
    "data": {},
    "request": { "method": "GET", "path": "/g/collect" },
    "timeout_ms": 500
  }'
```

`POST /run` takes `{ "source": "..." }`. Both accept `timeout_ms` (at most 5000) and `memory_bytes`. A request can only lower its limits, never raise them above the server's. Source is limited to 1 MB.

### Access with a token

When `PLAYGROUND_TOKEN` is set, every playground request needs either:

- an `Authorization: Bearer <token>` header, or
- a `playground_token=<token>` cookie, which is how you open the UI in a browser.

## Debugging real hits

A real hit renders a **debug page** instead of its normal response when it has any of:

- `__debug` in the query string: `/g/collect?v=2&...&__debug`
- a `_tagpiper_ssd` cookie, with any value
- `DEBUG_HITS=1` set on the server, which applies to every hit

The page shows the request, then each client in turn: whether it claimed the request, its logs, errors, timing, memory, the events it built and the tags that fired, followed by the response that would have been sent. Hits that no client claims get a debug page too, so you can see why.

`DEBUG_ON_NAVIGATE=1` also shows the debug page when you open a collect URL in a browser tab. It is handy while you develop, but leave it off in production.

::: warning
The debug page shows request headers, full event data and console output. When `PLAYGROUND_TOKEN` is set, debug pages need the token as well.
:::
