---
category: Events & container
---
# getAllEventData

Returns the current event.

```js
const getAllEventData = require('getAllEventData');
getAllEventData()
```

## Returns

- In a **tag**: the event object the client passed to [`runContainer`](./runContainer).
- In a **client**: `null` for real requests. In the playground it returns the simulated request's `event` field, if you set one.

## Example

```js
const getAllEventData = require('getAllEventData');

const event = getAllEventData();
if (event.event_name !== 'purchase') {
  data.gtmOnSuccess();
  return;
}
```

## Differences from Google sGTM

There is no `getEventData(key)` yet. Read the field from the whole event instead:

```js
const eventName = getAllEventData().event_name;
```
