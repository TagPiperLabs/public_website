---
category: Request
---
# getRequestQueryParameter

Returns the decoded value of one query-string parameter.

```js
const getRequestQueryParameter = require('getRequestQueryParameter');
getRequestQueryParameter(name)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | `string` | The parameter name. Case-sensitive. |

## Returns

- `undefined` when the parameter isn't present
- a `string` when it appears once
- an `array` of strings when it appears more than once

Values are percent-decoded, and `+` becomes a space. A parameter without `=` (such as `?debug`) has the value `''`.

## Example

```js
const getRequestQueryParameter = require('getRequestQueryParameter');

// /g/collect?v=2&tid=G-XXXX&en=page_view
getRequestQueryParameter('tid'); // 'G-XXXX'
getRequestQueryParameter('nope'); // undefined
```
