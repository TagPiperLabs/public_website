---
category: Request
---
# getRequestMethod

Returns the HTTP method of the incoming request.

```js
const getRequestMethod = require('getRequestMethod');
getRequestMethod()
```

## Returns

`string`: the method in upper case, such as `'GET'`, `'POST'` or `'OPTIONS'`.

## Example

```js
const getRequestMethod = require('getRequestMethod');

const method = getRequestMethod();
if (method !== 'GET' && method !== 'POST') return;
```
