---
category: Request
---
# getRequestQueryString

Returns the raw query string of the incoming request.

```js
const getRequestQueryString = require('getRequestQueryString');
getRequestQueryString()
```

## Returns

`string`: the query string **including the leading `?`**, such as `'?v=2&tid=G-XXXX'`, or `''` when there is none. It is not decoded.

## Example

```js
const getRequestQueryString = require('getRequestQueryString');

// Strip the leading "?" before splitting.
const query = getRequestQueryString().replace(/^\?/, '');
const parts = query ? query.split('&') : [];
```

## Differences from Google sGTM

Google sGTM returns the query string without the leading `?`. TagPiper includes it, so strip it as shown above. That works on both.
