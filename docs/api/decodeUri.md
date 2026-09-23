---
category: Strings & URLs
---
# decodeUri

Decodes a percent-encoded URI, the reverse of [`encodeUri`](./encodeUri).

```js
const decodeUri = require('decodeUri');
decodeUri(encodedUri)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `encodedUri` | `string` | The URI to decode. |

## Returns

`string`: the decoded URI.

- A value that isn't a string is returned unchanged.
- Malformed input (such as a stray `%`) returns `undefined` instead of throwing.
- Like the standard `decodeURI`, escapes of reserved characters (`%2F`, `%3F`, …) stay encoded, and `+` isn't turned into a space.

## Example

```js
const decodeUri = require('decodeUri');

decodeUri('https://example.com/a%20path/%C3%BC'); // 'https://example.com/a path/ü'
decodeUri('https://example.com/%E0%A4%A');       // undefined
```
