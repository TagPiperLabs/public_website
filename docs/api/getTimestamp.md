---
category: Time & logging
---
# getTimestamp

Returns the current time in milliseconds since the Unix epoch. An older name for [`getTimestampMillis`](./getTimestampMillis).

```js
const getTimestamp = require('getTimestamp');
getTimestamp()
```

## Returns

`number`: the same value as `getTimestampMillis()`.

::: tip
Google sGTM deprecates `getTimestamp`. Use [`getTimestampMillis`](./getTimestampMillis) in new templates.
:::
