---
category: Types & conversion
---
# getType

Returns the type of a value. It is like `typeof`, but tells arrays and `null` apart from objects.

```js
const getType = require('getType');
getType(value)
```

## Returns

| Value | Result |
| --- | --- |
| `null` | `'null'` |
| `undefined` | `'undefined'` |
| an array | `'array'` |
| a string | `'string'` |
| a number (including `NaN`) | `'number'` |
| a boolean | `'boolean'` |
| a function | `'function'` |
| any other object | `'object'` |

## Example

```js
const getAllEventData = require('getAllEventData');
const getType = require('getType');

const items = getAllEventData().items;
if (getType(items) !== 'array') return;
```
