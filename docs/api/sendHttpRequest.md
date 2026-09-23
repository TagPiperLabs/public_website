---
category: Outgoing HTTP
---
# sendHttpRequest

Sends an HTTP request to a URL.

```js
const sendHttpRequest = require('sendHttpRequest');

// Promise form
sendHttpRequest(url, options, body)

// Callback form
sendHttpRequest(url, callback, options, body)
```

By default the request is **queued**. The Promise resolves right away, and TagPiper sends the request from a background queue, retrying on failure. The visitor's response never waits for the vendor. Pass `{ wait: true }` when you need the real response. See [Outgoing requests](../how-it-works#outgoing-requests).

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `url` | `string` | Must start with `http://` or `https://`. |
| `options` | `object` | Optional. See below. |
| `body` | `string` | Optional request body. Values that aren't strings are converted: objects to JSON. |
| `callback` | `function` | Callback form only. Called as `callback(statusCode, headers, body)`. |

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `method` | `string` | `'GET'` | HTTP method, upper-cased. |
| `headers` | `object` | `{}` | Request headers. Values are converted to strings. |
| `wait` | `boolean` | `false` | TagPiper extension. `true` sends the request now and resolves with the real response. |

## Returns

A `Promise` that resolves to `{ statusCode, headers, body }`, or `undefined` in the callback form. What it resolves with depends on how the request was sent:

| Case | Resolves with |
| --- | --- |
| Queued (default) | `{ statusCode: 202, headers: {}, body: '', queued: true }` |
| `wait: true` | the real response: `{ statusCode, headers, body }` |
| `wait: true` with `OUTGOING_DRY_RUN=1` | `{ statusCode: 200, headers: {}, body: '', dryRun: true }` |

The response `body` is always a string. Bytes that aren't valid UTF-8 (a GIF pixel, for example) are replaced with `U+FFFD`, so you can check the status of a binary response but can't use its content.

With `wait: true`, a network error or timeout **rejects** the Promise. In the callback form it calls `callback(0, {}, errorMessage)` instead.

A queued request is retried in the background on network errors, `429` and `5xx`, up to `OUTGOING_MAX_ATTEMPTS` attempts. The template never sees those retries.

### Throws

These errors are thrown synchronously, at the call:

- `unsupported URL` when the URL isn't `http://` or `https://`
- when the host resolves to a private, loopback or link-local address. See [SSRF protection](../how-it-works#ssrf-protection).
- `outgoing queue is full`
- `more than 1000 pending sends in one request`

## Examples

Forward an event (fire and forget):

```js
const JSON = require('JSON');
const getAllEventData = require('getAllEventData');
const sendHttpRequest = require('sendHttpRequest');

const event = getAllEventData();

sendHttpRequest(
  'https://collector.example.com/events',
  { method: 'POST', headers: { 'Content-Type': 'application/json' } },
  JSON.stringify(event)
).then(data.gtmOnSuccess, data.gtmOnFailure);
```

Wait for the response:

```js
sendHttpRequest('https://api.example.com/lookup?id=42', { wait: true })
  .then((response) => {
    if (response.statusCode !== 200) return data.gtmOnFailure();
    const result = JSON.parse(response.body);
    // ...
    data.gtmOnSuccess();
  }, data.gtmOnFailure);
```

Callback form:

```js
sendHttpRequest(url, (statusCode, headers, body) => {
  if (statusCode >= 200 && statusCode < 300) data.gtmOnSuccess();
  else data.gtmOnFailure();
}, { method: 'POST' }, payload);
```

## Differences from Google sGTM

- Requests are queued unless you pass `wait: true`, so by default `statusCode` is `202`, not the vendor's.
- The `timeout` option is ignored. A waited request is limited by the run's time budget instead.
- Private and internal addresses are refused.
