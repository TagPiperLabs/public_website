---
category: Types & conversion
---
# makeInteger

Converts a value to an integer, dropping any fractional part (rounding toward zero).

```js
const makeInteger = require('makeInteger');
makeInteger(value)
```

## Returns

`number`. `NaN` when the value can't be converted.

## Example

```js
const makeInteger = require('makeInteger');

makeInteger('42.9'); // 42
makeInteger(-3.7);   // -3
makeInteger('abc');  // NaN
```
