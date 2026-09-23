---
category: Time & logging
---
# logToConsole

Writes a line to the template's log.

```js
const logToConsole = require('logToConsole');
logToConsole(...values)
```

## Where logs appear

- In the [playground](../playground) and on the [debug page](../playground#debugging-real-hits), under the template that wrote them.
- In the server's output for real hits, prefixed with the client's name: `[ga4_client] …`.

## Parameters

Any number of values. Strings are written as they are. Everything else is written as JSON, so objects are readable. The values are joined with spaces.

## Returns

`undefined`.

## Limits

- Lines longer than 1,024 bytes are truncated.
- A run keeps at most 100 lines. Extra lines are dropped.

## Example

```js
const getAllEventData = require('getAllEventData');
const logToConsole = require('logToConsole');

logToConsole('event:', getAllEventData());
// event: {"event_name":"page_view","client_id":"123.456"}

logToConsole('sent', 3, 'hits', true);
// sent 3 hits true
```

::: warning
Logs of real hits can contain personal data such as IPs, client IDs and user agents. Log only what you need.
:::
