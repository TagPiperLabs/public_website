---
category: Response
---
# returnResponse

Marks the response as complete, using the status, headers and body set so far.

```js
const returnResponse = require('returnResponse');
returnResponse()
```

The response goes back to the browser when the client's run finishes. Tags run by [`runContainer`](./runContainer) finish first, and queued sends are handed to the background queue, so a slow vendor doesn't hold the response.

If no status was set, it becomes `200`.

## Returns

`undefined`. Throws `returnResponse() called without claimRequest()` if this client hasn't claimed the request.

## Example

Answer once every event has gone through the tags:

```js
const claimRequest = require('claimRequest');
const returnResponse = require('returnResponse');
const runContainer = require('runContainer');
const setResponseStatus = require('setResponseStatus');

// `events`: the events this client built from the request.
claimRequest();
setResponseStatus(204);

let remaining = events.length;
events.forEach((event) => {
  runContainer(event, () => {
    if (--remaining === 0) returnResponse();
  });
});
```
