# Management UI

::: info In development
The TagPiper UI is being built now. This page describes what it will do. Today, the server runs a [built-in container](./templates).
:::

The TagPiper UI is a web app for managing everything the server runs: your containers, the clients, tags, firing rules and variables inside them, and the servers running them. Like the Tag Manager web UI for Google sGTM, but for TagPiper, and something you host yourself.

## What you'll manage

| Area | What you can do |
| --- | --- |
| **Projects** | Group containers by site, client or team. |
| **Containers** | Create and configure server containers, the unit a TagPiper server runs. |
| **Clients** | Add the clients that claim incoming requests, such as GA4 or your own. |
| **Tags** | Add the tags that send events to vendors, and configure their fields. |
| **Firing rules** | Decide which tags fire for which events (triggers), instead of every tag firing for every event. |
| **Variables** | Define reusable values and lookups for your tags and rules. |
| **Templates** | Write, import and manage custom templates. Most Google sGTM templates can be used directly ([compatibility](./comparison#template-compatibility)). |
| **Versions** | Publish container versions, and see what changed and when. |
| **Stats** | Follow hits, events and tag results over time. |
| **Monitoring** | See the TagPiper servers running each container and their health: CPU, memory, queue depth, and sent, dropped or failed hits. |
| **Debugging** | Inspect individual hits: which client claimed each one, the events it built, and every outgoing request. |

## How it's built

| Layer | Technology |
| --- | --- |
| Web app | [Nuxt 4](https://nuxt.com) (Vue) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Database | [PostgreSQL](https://www.postgresql.org) |

The UI is separate from the server. The UI and its database store your configuration. The lightweight TagPiper servers only run it, so the servers that handle your traffic stay small and fast, and you can run as many of them as you need.

Like the server, the UI is self-hosted: your configuration, your users and your stats stay on infrastructure you control.
