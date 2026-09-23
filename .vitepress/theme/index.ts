import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import DocsWip from './components/DocsWip.vue'
import ReleaseBadge from './components/ReleaseBadge.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      // Above the front page's hero title.
      'home-hero-info-before': () => h(ReleaseBadge),
      // Top of every docs page.
      'doc-before': () => h(DocsWip),
    }),
}
