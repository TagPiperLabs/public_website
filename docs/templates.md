# Built-in templates

TagPiper runs a built-in container with one client and one tag.

## GA4 client

Template name: `ga4_client`

This client claims GA4 Measurement Protocol v2 hits: requests to `/g/collect`, `/mp/collect` or `/j/collect` with `v=2`, sent by `gtag.js` or directly. It answers `204` once every tag has finished. A batched `POST` can carry several events, and the container runs once for each.

The client builds the event data **itself, in the template**, using Google sGTM's [common event data](https://developers.google.com/tag-platform/tag-manager/server-side/common-event-data) shape (`event_name`, `client_id`, `page_location`, `ip_override`, `user_agent`, `x-ga-*` parameters and so on). It follows the types that Google sGTM emits: for example, `ga_session_id` stays a string while `ga_session_number` is a number. Because the mapping lives in the template, you can change it by writing a different client, with no rebuild.

## GA4 tag

Template name: `ga4_tag`

This tag forwards the **original hit** to Google as it came in. It doesn't rebuild the hit from event data, so no parameter can be lost in a mapping. It keeps the browser's method and body (`GET` stays `GET`, `POST` stays `POST`).

The two things the browser couldn't send itself are added: the visitor's IP (`_uip`) and user agent (`_ua`). Any existing values are replaced, not duplicated. The tag also sets `User-Agent` and `X-Forwarded-For` on the outgoing request.

| Field | Default | Description |
| --- | --- | --- |
| `endpoint` | `https://www.google-analytics.com/g/collect` | Where hits are sent. |
