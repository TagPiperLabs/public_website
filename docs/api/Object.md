---
category: Built-in objects
---
# Object

A small set of static helpers from the standard `Object`.

```js
const Object = require('Object');
```

`Object` isn't a global in templates. Load it with `require('Object')`. Object literals (`{ … }`) work as normal without it.

## Methods

| Method | Description |
| --- | --- |
| `Object.keys(obj)` | Array of the object's own enumerable keys. |
| `Object.values(obj)` | Array of its values. |
| `Object.entries(obj)` | Array of `[key, value]` pairs. |
| `Object.freeze(obj)` | Freezes the object and returns it. |
| `Object.delete(obj, key)` | Deletes a key. See below. |

### Object.delete(obj, key)

Removes `key` from `obj` and returns `true`, even if the key wasn't there. Returns `false` and changes nothing when:

- `obj` is `null`, a primitive or an **array**
- `obj` is frozen
- `key` isn't a string, or contains a `.` (nested paths aren't supported)

## Example

```js
const Object = require('Object');
const getAllEventData = require('getAllEventData');

const event = getAllEventData();
Object.delete(event, 'ip_override');

Object.keys(event).forEach((key) => {
  if (key.indexOf('x-ga-') === 0) Object.delete(event, key);
});
```
