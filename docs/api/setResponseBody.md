---
category: Response
---
# setResponseBody

Sets the body of the response.

```js
const setResponseBody = require('setResponseBody');
setResponseBody(body, contentType)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `body` | `string` | The response body. Values that aren't strings are converted: objects and arrays to JSON, `null` and `undefined` to `''`. |
| `contentType` | `string` | Optional. Sets (or replaces) the `Content-Type` header. |

## Returns

`undefined`.

## Example

```js
const JSON = require('JSON');
const setResponseBody = require('setResponseBody');

setResponseBody(JSON.stringify({ ok: true }), 'application/json');
```

## Differences from Google sGTM

In Google sGTM the second parameter is the body's *encoding* (such as `'base64'`). In TagPiper it is the *content type*, and binary bodies aren't supported.
