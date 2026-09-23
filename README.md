# TagPiper website

The public website and documentation for TagPiper, built with [VitePress](https://vitepress.dev). Every page is a Markdown file.

```
index.md              front page
docs/*.md             documentation (/docs/...)
docs/api/*.md         API reference, one page per API
public/               static files (logos, favicon)
.vitepress/config.mts site config: nav, sidebar, GitHub links
.vitepress/theme/     brand colours and front-page styles
```

## Develop

```sh
bun install       # or npm install
bun run dev       # http://localhost:5173
bun run build     # static site in .vitepress/dist
bun run preview
```

## Deploy

The site is published at **https://tagpiper.com**. Pushing to `main` builds it and deploys it to GitHub Pages (`.github/workflows/deploy.yml`).

One-time setup:

1. **Settings → Pages → Source**: choose **GitHub Actions**.
2. **Settings → Pages → Custom domain**: enter `tagpiper.com`, then tick **Enforce HTTPS** once the certificate is ready.
3. DNS for `tagpiper.com`: `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and for `www`, a `CNAME` pointing to `tagpiperlabs.github.io`.


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
