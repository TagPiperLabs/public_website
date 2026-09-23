---
category: Strings & URLs
---
# computeEffectiveTldPlusOne

Returns the registrable domain (eTLD+1) of a domain or URL.

```js
const computeEffectiveTldPlusOne = require('computeEffectiveTldPlusOne');
computeEffectiveTldPlusOne(domainOrUrl)
```

It uses the [Public Suffix List](https://publicsuffix.org/), so `shop.example.co.uk` gives `example.co.uk`, not `co.uk`. Use it to set cookies on the right domain, or to compare sites.

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `domainOrUrl` | `string` | A domain (`www.example.com`) or a URL (`https://www.example.com:8443/path`). The scheme, user info, port, path, query and fragment are ignored. |

## Returns

`string`: the registrable domain, in lower case, or `''` when there is none (for example, for a bare public suffix). `null` and `undefined` are returned unchanged. Anything else is converted to a string first.

## Example

```js
const computeEffectiveTldPlusOne = require('computeEffectiveTldPlusOne');

computeEffectiveTldPlusOne('sst.shop.example.co.uk');          // 'example.co.uk'
computeEffectiveTldPlusOne('https://www.Example.com/path?q=1'); // 'example.com'
computeEffectiveTldPlusOne('co.uk');                            // ''
```

::: info
The list is compiled into the server, so it is as up to date as your build. Google sGTM can fall back to returning the input when it can't fetch the list. TagPiper never needs to.
:::
