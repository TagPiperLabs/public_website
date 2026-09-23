---
category: Request
---
# getRequestBody

Returns the body of the incoming request.

```js
const getRequestBody = require('getRequestBody');
getRequestBody()
```

## Returns

`string`: the raw body, or `''` when there is none. Invalid UTF-8 bytes are replaced with `U+FFFD`.

## Example

```js
const JSON = require('JSON');
const getRequestBody = require('getRequestBody');

const body = getRequestBody();
const payload = body ? JSON.parse(body) : {};
```
