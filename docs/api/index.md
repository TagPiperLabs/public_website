# API reference

TagPiper replicates the [Google sGTM sandboxed JavaScript API](https://developers.google.com/tag-platform/tag-manager/server-side/api) for templates. Each API has the same name, arguments and return value, so most Google sGTM templates can be used directly.

Templates are sandboxed JavaScript. They can't reach the outside world by themselves: every capability, from reading the request to sending a hit, comes from an API loaded with `require`. Each page here documents what TagPiper does and flags any differences from Google sGTM. APIs that aren't available yet are listed at the [end of this page](#not-available-yet).

```js
const getRequestPath = require('getRequestPath');
const sendHttpRequest = require('sendHttpRequest');
```

## APIs

| Category | APIs |
| --- | --- |
| Request | [getRequestMethod](./getRequestMethod) · [getRequestPath](./getRequestPath) · [getRequestHeader](./getRequestHeader) · [getRequestBody](./getRequestBody) · [getRequestQueryString](./getRequestQueryString) · [getRequestQueryParameter](./getRequestQueryParameter) · [getRequestQueryParameters](./getRequestQueryParameters) · [getRemoteAddress](./getRemoteAddress) |
| Response | [claimRequest](./claimRequest) · [setResponseStatus](./setResponseStatus) · [setResponseHeader](./setResponseHeader) · [setResponseBody](./setResponseBody) · [returnResponse](./returnResponse) |
| Events & container | [runContainer](./runContainer) · [getAllEventData](./getAllEventData) |
| Outgoing HTTP | [sendHttpRequest](./sendHttpRequest) · [sendHttpGet](./sendHttpGet) |
| Strings & URLs | [parseUrl](./parseUrl) · [computeEffectiveTldPlusOne](./computeEffectiveTldPlusOne) · [encodeUri](./encodeUri) · [encodeUriComponent](./encodeUriComponent) · [decodeUri](./decodeUri) · [decodeUriComponent](./decodeUriComponent) |
| Regular expressions | [createRegex](./createRegex) · [testRegex](./testRegex) |
| Types & conversion | [getType](./getType) · [makeString](./makeString) · [makeNumber](./makeNumber) · [makeInteger](./makeInteger) · [makeTableMap](./makeTableMap) |
| Built-in objects | [JSON](./JSON) · [Math](./Math) · [Object](./Object) |
| Time & logging | [getTimestampMillis](./getTimestampMillis) · [getTimestamp](./getTimestamp) · [logToConsole](./logToConsole) |

## The sandbox

### A template is a function body

Your template code runs as the body of a function that receives `data`, in strict mode:

```js
(function (data) {
  'use strict';
  // your template here
})
```

That means a top-level `return` works, and it is the usual way for a client to decline a request:

```js
const getRequestPath = require('getRequestPath');
if (getRequestPath() !== '/collect') return;
```

### Globals

Almost nothing is global. These are the only names you can use without declaring them:

`require` · `data` · `undefined` · `NaN` · `Infinity` · `Error` · `TypeError` · `RangeError` · `SyntaxError`

`Object`, `Math`, `JSON`, `Array`, `String`, `Number`, `Date`, `Promise`, `console`, `parseInt`, `encodeURIComponent` and the rest are **not** globals. Load the sandbox versions with `require` (for example, `require('JSON')`), or use a method on a value you already have: `'a,b'.split(',')` and `[1, 2].map(…)` work as normal.

`eval`, `Function` and the constructors of function values are blocked. Built-in prototypes are frozen, so a template can't change behaviour that other templates rely on.

### Validation

Before a template runs, TagPiper parses the whole template and rejects any identifier that is neither declared in the template nor in the list above, even on a branch that never runs. Google sGTM rejects templates the same way. The error lists every problem with its line and column. For example, using `Math` without requiring it:

```js
const x = Math.floor(1.5);
```

```
1 Error(s) parsing the input:
Attempting to use undeclared variable Math in function template.
Offending section starting from token 'Math' at 1,10 to token 'Math' at 1,10.
```

### `require`

- `require(name)` returns the API. Calling it again returns the same frozen instance.
- An unknown name, or one starting with `__`, throws `require("name") is not a permitted API`.
- API objects such as `JSON` and `Math` are frozen and can't be changed.

### `data`

`data` holds the template's configured fields. In a **tag** it also has two callbacks, which the debug page and the playground use to report the tag's outcome:

| Field | Description |
| --- | --- |
| `data.gtmOnSuccess()` | Call when the tag succeeded. |
| `data.gtmOnFailure()` | Call when the tag failed. |

```js
sendHttpRequest(url, { method: 'POST' }, body)
  .then(data.gtmOnSuccess, data.gtmOnFailure);
```

### Synchronous and asynchronous APIs

Most APIs are synchronous. [`runContainer`](./runContainer), [`sendHttpRequest`](./sendHttpRequest) and [`sendHttpGet`](./sendHttpGet) return a **Promise**. The work they start runs after the template's synchronous code has finished, and their Promises settle then.

### Limits

Every run has a time budget: 100 ms by default, and at most 5 s. The budget includes async work and time spent waiting in the queue. Within one request:

| Limit | Value | What happens past it |
| --- | --- | --- |
| `runContainer` calls | 100 | throws |
| Pending sends | 1,000 | throws |
| `createRegex` patterns | 1,000 | throws |
| Response headers | 100 | throws |
| `logToConsole` lines | 100 | extra lines dropped |
| `logToConsole` line length | 1,024 bytes | truncated |

## Not available yet

These APIs are **registered but not implemented**. `require` works, so templates that use them pass validation, but calling them throws `<name>: async APIs are not implemented yet`:

`Firestore` · `BigQuery` · `templateDataStorage` · `sendPixelFromBrowser`

These Google sGTM APIs **don't exist** in TagPiper yet, and `require` throws for them:

`getEventData` · `setCookie` · `getCookieValues` · `setPixelResponse` · `sha256` · `sha256Sync` · `hmacSha256` · `toBase64` · `fromBase64` · `generateRandom` · `getClientName` · `getContainerVersion` · `isRequestMpv1` · `isRequestMpv2` · `extractEventsFromMpv1` · `extractEventsFromMpv2` · `sendEventToGoogleAnalytics` · `getGoogleAuth` · `getGoogleScript` · `addEventCallback` · `addMessageListener` · `hasMessageListener` · `sendMessage` · `callLater`

::: tip Want one of these?
On the server, each API is one `src/api/<name>.js` file, plus a Rust binding in `src/api/binds/` when it needs the host. Once it is added, document it here with a new page in `docs/api/`.
:::
