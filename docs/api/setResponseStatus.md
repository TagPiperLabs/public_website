---
category: Response
---
# setResponseStatus

Sets the HTTP status code of the response.

```js
const setResponseStatus = require('setResponseStatus');
setResponseStatus(statusCode)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `statusCode` | `number` | The status code. Values outside 100–599 are clamped into that range. A value that isn't a number becomes `200`. |

## Returns

`undefined`.

If the client never sets a status, the response is `200`.

## Example

```js
const setResponseStatus = require('setResponseStatus');

setResponseStatus(204);
```
