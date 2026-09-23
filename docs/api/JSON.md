---
category: Built-in objects
---
# JSON

Parses and serialises JSON.

```js
const JSON = require('JSON');
JSON.parse(text)
JSON.stringify(value)
```

`JSON` isn't a global in templates. Load it with `require('JSON')`.

## JSON.parse(text)

Parses a JSON string, the same as the standard [`JSON.parse`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse). It **throws** a `SyntaxError` on invalid JSON. The `reviver` argument isn't supported.

## JSON.stringify(value)

Serialises a value, the same as the standard [`JSON.stringify`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). The `replacer` and `space` arguments aren't supported, so the output is always compact.

## Example

```js
const JSON = require('JSON');
const getRequestBody = require('getRequestBody');

let payload;
try {
  payload = JSON.parse(getRequestBody());
} catch (e) {
  return; // not JSON; don't claim
}

const body = JSON.stringify({ events: payload.events });
```
