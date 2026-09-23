---
category: Response
---
# claimRequest

Claims the incoming request for this client.

```js
const claimRequest = require('claimRequest');
claimRequest()
```

Each client gets a turn with the request, in order. The first client to call `claimRequest()` owns it: no later client runs, and this client's response is the one sent back. If no client claims the request, the server answers `400 no client claimed the request`.

Only claim a request you're going to handle. Check the path, method and parameters first, and `return` early if the request isn't yours.

## Returns

`undefined`.

## Example

```js
const claimRequest = require('claimRequest');
const getRequestPath = require('getRequestPath');
const returnResponse = require('returnResponse');
const setResponseStatus = require('setResponseStatus');

if (getRequestPath() !== '/healthcheck-pixel') return;

claimRequest();
setResponseStatus(204);
returnResponse();
```
