---
category: Strings & URLs
---
# parseUrl

Splits a URL into its parts.

```js
const parseUrl = require('parseUrl');
parseUrl(url)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `url` | `string` | An absolute URL with a scheme and `//`, such as `https://…`. |

## Returns

An `object`, or `undefined` if `url` isn't a string or isn't an absolute URL.

| Property | Example | Notes |
| --- | --- | --- |
| `href` | `'https://user@shop.example.com:8443/p/1?a=1&b=x%20y#top'` | The input, unchanged. |
| `protocol` | `'https:'` | Includes the `:`. |
| `username` | `'user'` | Everything before `@`, so a password is included (`'user:pass'`). |
| `hostname` | `'shop.example.com'` | IPv6 literals keep their brackets. |
| `port` | `'8443'` | `''` when there is none. |
| `pathname` | `'/p/1'` | `''` when there is none. |
| `search` | `'?a=1&b=x%20y'` | Includes the `?`. |
| `hash` | `'#top'` | Includes the `#`. |
| `searchParams` | `{ a: '1', b: 'x y' }` | Percent-decoded. When a key repeats, the last value wins. |

## Example

```js
const getAllEventData = require('getAllEventData');
const parseUrl = require('parseUrl');

const url = parseUrl(getAllEventData().page_location);
if (url && url.hostname === 'shop.example.com') {
  const campaign = url.searchParams.utm_campaign;
}
```

## Differences from Google sGTM

- `password` and `origin` aren't separate properties.
- `searchParams` values are always single strings, and `+` isn't turned into a space.
