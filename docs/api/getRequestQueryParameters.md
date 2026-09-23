---
category: Request
---
# getRequestQueryParameters

Returns every query-string parameter as an object.

```js
const getRequestQueryParameters = require('getRequestQueryParameters');
getRequestQueryParameters()
```

## Returns

`object` mapping each parameter name to its value. A name that appears more than once maps to an array of values, in order. Names and values are percent-decoded, and `+` becomes a space. With no query string, returns `{}`.

## Example

```js
const getRequestQueryParameters = require('getRequestQueryParameters');

// ?en=page_view&ep.item=a&ep.item=b&q=hello+world
const params = getRequestQueryParameters();
// { en: 'page_view', 'ep.item': ['a', 'b'], q: 'hello world' }
```
