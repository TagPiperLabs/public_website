---
category: Request
---
# getRemoteAddress

Returns the IP address of the visitor who sent the request.

```js
const getRemoteAddress = require('getRemoteAddress');
getRemoteAddress()
```

## Returns

`string` with an IPv4 or IPv6 address, or `undefined` if none is known. The first of these that is present and non-empty wins:

1. `CF-Connecting-IP`
2. `X-Real-IP`
3. `X-Forwarded-For`, left-most entry
4. the IP of the TCP connection

## Example

```js
const getRemoteAddress = require('getRemoteAddress');

const ip = getRemoteAddress();
```

::: warning
The headers above come from the client unless your proxy overwrites them. Behind a load balancer, make sure it **sets** them, and that TagPiper can't be reached directly. Otherwise a visitor can choose the IP you see. See [Deployment](../deployment#behind-a-load-balancer).
:::
