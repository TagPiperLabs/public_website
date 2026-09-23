---
category: Strings & URLs
---
# encodeUriComponent

Percent-encodes one component of a URI, such as a query-string value.

```js
const encodeUriComponent = require('encodeUriComponent');
encodeUriComponent(str)
```

Works the same as the standard [`encodeURIComponent`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent): everything except `A–Z a–z 0–9 - _ . ! ~ * ' ( )` is encoded.

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `str` | `string` | The value to encode. |

## Returns

`string`: the encoded value.

## Example

```js
const encodeUriComponent = require('encodeUriComponent');

const url = 'https://collector.example.com/e?page=' +
  encodeUriComponent('https://shop.example.com/?a=1&b=2');
// ...?page=https%3A%2F%2Fshop.example.com%2F%3Fa%3D1%26b%3D2
```
