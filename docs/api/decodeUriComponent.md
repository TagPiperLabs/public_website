---
category: Strings & URLs
---
# decodeUriComponent

Decodes one percent-encoded URI component, the reverse of [`encodeUriComponent`](./encodeUriComponent).

```js
const decodeUriComponent = require('decodeUriComponent');
decodeUriComponent(encoded)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `encoded` | `string` | The value to decode. |

## Returns

`string`: the decoded value.

- A value that isn't a string is returned unchanged.
- **Malformed input returns `undefined` instead of throwing.** A browser can send anything, and one bad parameter (such as `cid=%ZZ`) shouldn't fail the whole request. Decide in your template what a failed decode means.
- `+` is **not** turned into a space. For form-encoded data, replace it first.

## Example

```js
const decodeUriComponent = require('decodeUriComponent');

decodeUriComponent('a%20b%26c'); // 'a b&c'
decodeUriComponent('%ZZ');       // undefined

// Form encoding: '+' means space.
function decodeForm(value) {
  const decoded = decodeUriComponent(value.split('+').join(' '));
  return decoded === undefined ? value : decoded;
}
```
