---
category: Request
---
# getRequestHeader

Returns the value of one request header.

```js
const getRequestHeader = require('getRequestHeader');
getRequestHeader(headerName)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `headerName` | `string` | The header to read. Matched case-insensitively. |

## Returns

`string` with the header's value, or `undefined` when the request doesn't have it.

## Example

```js
const getRequestHeader = require('getRequestHeader');

const origin = getRequestHeader('origin');
const userAgent = getRequestHeader('User-Agent');
```

## Differences from Google sGTM

When a header is sent more than once, TagPiper returns the **first** value. It doesn't join the values into one comma-separated string.
