---
category: Regular expressions
---
# createRegex

Creates a regular expression that you can use with [`testRegex`](./testRegex) and with the string methods `replace`, `match` and `search`.

```js
const createRegex = require('createRegex');
createRegex(pattern, flags)
```

Patterns run on a linear-time, RE2-style engine with no backtracking, like Google sGTM's. However complex the pattern, one input can't make it run for a long time.

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pattern` | `string` | The pattern, in [RE2-style syntax](https://docs.rs/regex/latest/regex/#syntax). |
| `flags` | `string` | Optional. `'i'` for case-insensitive, `'g'` for global. Other flags are ignored. |

## Returns

An opaque, frozen object, or `null` if the pattern is invalid. Patterns that use **backreferences** (`\1`) or **lookaround** (`(?=…)`, `(?<!…)`) are invalid on this engine and also return `null`.

The object has no readable properties. Pass it to `testRegex`, or to these string methods:

| Call | Result |
| --- | --- |
| `str.replace(re, replacement)` | The first match replaced, or every match with `g`. The replacement understands `$&`, `$1`–`$99` and `$$`. It must be a string, not a function. |
| `str.match(re)` | Without `g`: `[fullMatch, group1, …]` (unmatched groups are `null`). With `g`: an array of every match. No match: `null`. |
| `str.search(re)` | Index of the first match, or `-1`. |

Throws after 1,000 patterns in one request.

## Example

```js
const createRegex = require('createRegex');
const testRegex = require('testRegex');

const measurementId = createRegex('^G-[A-Z0-9]+$', 'i');
if (!testRegex(measurementId, data.measurementId)) {
  data.gtmOnFailure();
  return;
}

const digits = createRegex('\\d', 'g');
'order-123'.replace(digits, '#'); // 'order-###'

const pair = createRegex('(\\w+)=(\\w+)');
'a=1'.match(pair); // ['a=1', 'a', '1']
```

::: tip
Build patterns once, outside loops. Each call compiles a new pattern.
:::
