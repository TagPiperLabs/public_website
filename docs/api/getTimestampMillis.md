---
category: Time & logging
---
# getTimestampMillis

Returns the current time in milliseconds since the Unix epoch.

```js
const getTimestampMillis = require('getTimestampMillis');
getTimestampMillis()
```

## Returns

`number`: milliseconds since 1970-01-01 UTC, from the server's clock.

## Example

```js
const Math = require('Math');
const getTimestampMillis = require('getTimestampMillis');

const eventTimeSeconds = Math.floor(getTimestampMillis() / 1000);
```
