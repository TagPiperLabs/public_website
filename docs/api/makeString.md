---
category: Types & conversion
---
# makeString

Converts a value to a string.

```js
const makeString = require('makeString');
makeString(value)
```

Works the same as the standard `String(value)`.

## Returns

`string`.

## Example

```js
const makeString = require('makeString');

makeString(42);        // '42'
makeString(true);      // 'true'
makeString(null);      // 'null'
makeString(undefined); // 'undefined'
makeString([1, 2]);    // '1,2'
makeString({ a: 1 });  // '[object Object]', so use JSON.stringify for objects
```
