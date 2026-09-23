# Contributing to the TagPiper docs

Thanks for helping! The docs are plain Markdown, so most fixes take a single pull request.

## Quick edits

Every docs page has an **Edit this page on GitHub** link at the bottom. It opens the file in GitHub's editor, which will fork the repo and open the pull request for you.

## Bigger changes

1. Fork the repo and clone it.
2. `bun install` (or `npm install`), then `bun run dev`.
3. Edit or add files under `docs/`. The dev server reloads as you type.
4. Run `bun run build` to check that the site builds with no dead links.
5. Open a pull request.

## Adding a page

1. Create `docs/my-page.md`, starting with a `# Title`.
2. Add it to the `sidebar` in `.vitepress/config.mts`.
3. Link to other pages with relative links, such as `[Configuration](./configuration)`.

## Documenting an API

Each sandbox API has one page in `docs/api/`, named exactly after the API (`docs/api/getRequestHeader.md`). The sidebar is built from these files automatically, grouped by the `category` in the frontmatter, so you don't need to edit the config.

Start from this template:

````md
---
category: Request
---
# apiName

One sentence: what it does.

```js
const apiName = require('apiName');
apiName(param)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `param` | `string` | … |

## Returns

What it returns, including edge cases (missing values, bad input) and what it throws.

## Example

```js
// A complete snippet: require every API you use.
```

## Differences from Google sGTM

Only if there are any.
````

Existing categories: `Request`, `Response`, `Events & container`, `Outgoing HTTP`, `Strings & URLs`, `Regular expressions`, `Types & conversion`, `Built-in objects`, `Time & logging`. Also add the API to the table on `docs/api/index.md`, and remove it from the "Not available yet" list there.

Describe what the server really does. The source of truth is `src/api/<name>.js` and `src/api/binds/<name>.rs` in the server.

## Style

- Write short sentences in plain English, in the second person ("you").
- Put code, env vars, paths and API names in `backticks`.
- Every code example should work as written.
- Use VitePress callouts where they help: `::: tip`, `::: warning`, `::: danger`.
- Document what TagPiper does today. Put plans in issues, not in the docs.

See the VitePress [Markdown guide](https://vitepress.dev/guide/markdown) for tables, callouts, code groups and more.
