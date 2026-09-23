---
category: Strings & URLs
---
# encodeUri

Percent-encodes a full URI, leaving the characters that give a URI its structure (`: / ? # & = +` and so on) as they are.

```js
const encodeUri = require('encodeUri');
encodeUri(uri)
```

Works the same as the standard [`encodeURI`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURI).

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `uri` | `string` | The URI to encode. |

## Returns

`string`: the encoded URI.

## Example

```js
const encodeUri = require('encodeUri');

encodeUri('https://example.com/a path/ü?q=x y');
// 'https://example.com/a%20path/%C3%BC?q=x%20y'
```

To encode one value, such as a query parameter, use [`encodeUriComponent`](./encodeUriComponent).
