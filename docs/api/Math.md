---
category: Built-in objects
---
# Math

A subset of the standard [`Math`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math) object.

```js
const Math = require('Math');
```

`Math` isn't a global in templates. Load it with `require('Math')`.

## Methods

| Method | Description |
| --- | --- |
| `Math.abs(x)` | Absolute value. |
| `Math.ceil(x)` | Round up. |
| `Math.floor(x)` | Round down. |
| `Math.round(x)` | Round to the nearest integer. |
| `Math.max(...values)` | Largest value. |
| `Math.min(...values)` | Smallest value. |
| `Math.pow(base, exponent)` | Power. |
| `Math.sqrt(x)` | Square root. |

`Math.random` isn't available. Constants such as `Math.PI` aren't available either.

## Example

```js
const Math = require('Math');
const getAllEventData = require('getAllEventData');
const getTimestampMillis = require('getTimestampMillis');

const eventTime = Math.floor(getTimestampMillis() / 1000);
const value = Math.round(getAllEventData().value * 100) / 100;
```
