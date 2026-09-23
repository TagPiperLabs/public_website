---
category: Response
---
# setResponseHeader

Sets a header on the response.

```js
const setResponseHeader = require('setResponseHeader');
setResponseHeader(name, value)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | `string` | Header name. |
| `value` | `string` | Header value. Values that aren't strings are converted: numbers and booleans to their text, objects to JSON. |

Setting a header that is already set **replaces** it. Names are compared case-insensitively.

## Returns

`undefined`. Throws when a response would have more than 100 headers.

## Example

```js
const setResponseHeader = require('setResponseHeader');

setResponseHeader('Access-Control-Allow-Origin', 'https://shop.example.com');
setResponseHeader('Access-Control-Allow-Credentials', 'true');
setResponseHeader('Cache-Control', 'no-store');
```

::: info
Because a header is replaced, not appended, a response can carry only one `Set-Cookie` header. There is no `setCookie` API yet.
:::
