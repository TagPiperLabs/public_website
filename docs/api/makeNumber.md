---
category: Types & conversion
---
# makeNumber

Converts a value to a number.

```js
const makeNumber = require('makeNumber');
makeNumber(value)
```

Works the same as the standard `Number(value)`.

## Returns

`number`. `NaN` when the value can't be converted.

## Example

```js
const makeNumber = require('makeNumber');

makeNumber('19.99'); // 19.99
makeNumber('');      // 0
makeNumber('abc');   // NaN
makeNumber(true);    // 1

// Keep the original string when it isn't numeric.
function toNumber(value) {
  const n = makeNumber(value);
  return value !== '' && n === n ? n : value; // n === n is false only for NaN
}
```
