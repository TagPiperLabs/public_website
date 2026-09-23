---
category: Outgoing HTTP
---
# sendHttpGet

Sends a `GET` request to a URL. A shorthand for [`sendHttpRequest(url)`](./sendHttpRequest).

```js
const sendHttpGet = require('sendHttpGet');
sendHttpGet(url)
```

The request is queued and sent in the background, with retries, the same as `sendHttpRequest` without `wait`.

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `url` | `string` | Must start with `http://` or `https://`. |

## Returns

A `Promise` that resolves to `{ statusCode: 202, headers: {}, body: '', queued: true }`.

With `OUTGOING_WAIT=1` on the server, it waits and resolves with the real `{ statusCode, headers, body }` instead. See [`sendHttpRequest`](./sendHttpRequest#returns).

Throws in the same cases as [`sendHttpRequest`](./sendHttpRequest#throws).

## Example

```js
const encodeUriComponent = require('encodeUriComponent');
const getAllEventData = require('getAllEventData');
const sendHttpGet = require('sendHttpGet');

const event = getAllEventData();
const url = 'https://pixel.example.com/p?e=' + encodeUriComponent(event.event_name);

sendHttpGet(url).then(data.gtmOnSuccess, data.gtmOnFailure);
```

## Differences from Google sGTM

Google sGTM's `options` parameter (headers, timeout) isn't supported. Use [`sendHttpRequest`](./sendHttpRequest) when you need headers.
