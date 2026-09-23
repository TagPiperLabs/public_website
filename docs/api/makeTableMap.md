---
category: Types & conversion
---
# makeTableMap

Turns a table (an array of row objects) into a key–value object. This is the usual way to read a "simple table" template field.

```js
const makeTableMap = require('makeTableMap');
makeTableMap(rows, keyColumn, valueColumn)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `rows` | `array` | The rows. Each row is an object. |
| `keyColumn` | `string` | The column to use as the key. |
| `valueColumn` | `string` | The column to use as the value. |

## Returns

An `object` mapping each row's `keyColumn` to its `valueColumn`, or `null` when `rows` is empty or not an array. Rows without the key column are skipped. When two rows have the same key, the later row wins.

## Example

```js
const getAllEventData = require('getAllEventData');
const makeTableMap = require('makeTableMap');

// data.eventMap = [
//   { ga4: 'purchase',    meta: 'Purchase' },
//   { ga4: 'add_to_cart', meta: 'AddToCart' },
// ]
const names = makeTableMap(data.eventMap, 'ga4', 'meta');
// { purchase: 'Purchase', add_to_cart: 'AddToCart' }

const metaName = names[getAllEventData().event_name];
```
