---
category: Regular expressions
---
# testRegex

Tests whether a string matches a regex made with [`createRegex`](./createRegex).

```js
const testRegex = require('testRegex');
testRegex(regex, string)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `regex` | `object` | A regex returned by `createRegex`. Anything else never matches. |
| `string` | `string` | The text to test. Values that aren't strings are converted. |

## Returns

`boolean`: `true` if the string matches.

With the `g` flag, it behaves like `RegExp.prototype.test` in standard JavaScript: each call continues from where the last match ended, and returns `false` (then starts again) once there are no more matches. Without `g`, every call tests the whole string.

## Example

```js
const createRegex = require('createRegex');
const getRequestHeader = require('getRequestHeader');
const testRegex = require('testRegex');

const bot = createRegex('bot|crawler|spider', 'i');
if (testRegex(bot, getRequestHeader('user-agent'))) return;
```
