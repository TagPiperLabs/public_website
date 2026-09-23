---
category: Events & container
---
# runContainer

Runs the container's tags with an event.

```js
const runContainer = require('runContainer');
runContainer(event, onComplete)
```

Use it in a **client**, once you've built an event from the request. Every tag in the container is called with it, and inside each tag [`getAllEventData()`](./getAllEventData) returns this event.

The tags run **after the client's synchronous code has finished**, not during the call. A tag that throws is logged and doesn't stop the other tags.

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `event` | `object` | The event data, usually in Google sGTM's [common event data](https://developers.google.com/tag-platform/tag-manager/server-side/common-event-data) shape. |
| `onComplete` | `function` | Optional. Called with no arguments once the tags have run, whether they succeeded or not. |

## Returns

- With `onComplete`: `undefined`.
- Without it: a `Promise` that resolves to `{ tags: n }`, the number of tags that fired. It rejects if the run's time budget runs out.

Throws after 100 calls in one request. This also stops a tag that calls `runContainer` from looping.

## Example

```js
const claimRequest = require('claimRequest');
const getRequestQueryParameter = require('getRequestQueryParameter');
const returnResponse = require('returnResponse');
const runContainer = require('runContainer');

claimRequest();

const event = {
  event_name: getRequestQueryParameter('en'),
  client_id: getRequestQueryParameter('cid'),
  page_location: getRequestQueryParameter('dl'),
};

runContainer(event, () => returnResponse());
```

Using the Promise form:

```js
const logToConsole = require('logToConsole');

runContainer(event).then((result) => {
  logToConsole('tags fired:', result.tags);
  returnResponse();
});
```

## Differences from Google sGTM

Google sGTM's third parameter, `onStart`, isn't supported.
