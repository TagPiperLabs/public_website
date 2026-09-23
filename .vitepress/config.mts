import fs from 'node:fs'
import { defineConfig, type DefaultTheme } from 'vitepress'

// The TagPiper Labs GitHub organisation, linked from the nav.
const org = 'https://github.com/TagPiperLabs'

// The GitHub repository this site lives in. Used for the "Edit this page"
// links and the contributing guide.
const repo = `${org}/public_website`

// Where the site is published (GitHub Pages, custom domain).
const siteUrl = 'https://tagpiper.com'

// '/' for a custom domain or <org>.github.io; '/<repo>/' for a project page.
// The GitHub Pages workflow sets BASE from the repository settings.
const base = process.env.BASE || '/'

// API pages live in docs/api/, one file per API, each with a `category:`
// line in its frontmatter. The sidebar is built from those, so adding an API
// page needs no change here. Categories appear in this order; any other
// category goes at the end.
const apiCategories = [
  'Request',
  'Response',
  'Events & container',
  'Outgoing HTTP',
  'Strings & URLs',
  'Regular expressions',
  'Types & conversion',
  'Built-in objects',
  'Time & logging',
]

function apiSidebar(): DefaultTheme.SidebarItem[] {
  const dir = new URL('../docs/api/', import.meta.url)
  const groups = new Map<string, DefaultTheme.SidebarItem[]>()
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.md') || file === 'index.md') continue
    const source = fs.readFileSync(new URL(file, dir), 'utf8')
    const category = source.match(/^category:\s*(.+)$/m)?.[1].trim() ?? 'Other'
    const name = file.slice(0, -3)
    if (!groups.has(category)) groups.set(category, [])
    groups.get(category)!.push({ text: name, link: `/docs/api/${name}` })
  }
  const order = (c: string) => {
    const i = apiCategories.indexOf(c)
    return i === -1 ? apiCategories.length : i
  }
  return [
    {
      text: 'API reference',
      items: [
        { text: 'Overview & sandbox', link: '/docs/api/' },
        { text: '← Back to docs', link: '/docs/' },
      ],
    },
    ...[...groups.keys()]
      .sort((a, b) => order(a) - order(b))
      .map((text) => ({ text, collapsed: false, items: groups.get(text)! })),
  ]
}

export default defineConfig({
  title: 'TagPiper',
  description:
    'TagPiper is the lightweight, open-source server-side tagging alternative: a fast, self-hosted server-side tag manager that runs Google sGTM templates.',
  lang: 'en-US',
  // Light by default, whatever the system setting. The toggle still switches to dark.
  appearance: { initialValue: 'light' },

  base,

  cleanUrls: true,
  sitemap: { hostname: siteUrl },
  lastUpdated: true,
  // Links to a locally running TagPiper server in the docs.
  ignoreDeadLinks: 'localhostLinks',
  // Repo files that are not pages.
  srcExclude: ['README.md', 'CONTRIBUTING.md'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#2f5bf6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:title', content: 'TagPiper: the lightweight, open-source server-side tagging alternative' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'The lightweight, open-source server-side tagging alternative. Runs Google sGTM templates on a 4 MB self-hosted image.',
      },
    ],
  ],

  themeConfig: {
    // The logo already contains the wordmark.
    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg', alt: 'TagPiper' },
    siteTitle: false,

    nav: [
      { text: 'Docs', link: '/docs/', activeMatch: '^/docs/(?!api/)' },
      { text: 'API', link: '/docs/api/', activeMatch: '^/docs/api/' },
      { text: 'Contribute', link: `${repo}/blob/main/CONTRIBUTING.md` },
    ],

    sidebar: {
      '/docs/api/': apiSidebar(),
      '/docs/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is TagPiper?', link: '/docs/' },
            { text: 'Why TagPiper?', link: '/docs/why' },
            { text: 'Getting started', link: '/docs/getting-started' },
            { text: 'How it works', link: '/docs/how-it-works' },
            { text: 'TagPiper vs Google sGTM', link: '/docs/comparison' },
            { text: 'Management UI', link: '/docs/ui' },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'Playground & debugging', link: '/docs/playground' },
            { text: 'Deployment', link: '/docs/deployment' },
            { text: 'Binary & Docker image', link: '/docs/image' },
            { text: 'Benchmarks', link: '/docs/benchmarks' },
          ],
        },
        {
          text: 'Reference',
          items: [
            { text: 'Configuration', link: '/docs/configuration' },
            { text: 'Built-in templates', link: '/docs/templates' },
            { text: 'API reference', link: '/docs/api/' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: org }],

    editLink: {
      pattern: `${repo}/edit/main/:path`,
      text: 'Edit this page on GitHub',
    },

    search: { provider: 'local' },

    footer: {
      message: 'Found a mistake? Open a pull request.',
      copyright: `© ${new Date().getFullYear()} TagPiper Labs · by <a href="https://www.analytics-debugger.com" target="_blank" rel="noopener">Analytics Debugger S.L.U.</a>`,
    },
  },
})
