---
category: Request
---
# getRequestPath

Returns the path of the incoming request, without the query string.

```js
const getRequestPath = require('getRequestPath');
getRequestPath()
```

## Returns

`string`: the path, such as `'/g/collect'`. It is not decoded.

## Example

```js
const getRequestPath = require('getRequestPath');

// Only handle /g/collect and /mp/collect.
const path = getRequestPath();
if (path !== '/g/collect' && path !== '/mp/collect') return;
```
