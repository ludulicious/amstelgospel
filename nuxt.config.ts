import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const contentRoot = fileURLToPath(new URL('./content/', import.meta.url))
const contentRoutes = ['2.information', '3.events'].flatMap((folder) =>
  readdirSync(`${contentRoot}${folder}`)
    .filter((file) => file.endsWith('.md') && file !== '1.home-concert.md')
    .map(
      (file) =>
        `${folder === '3.events' ? '/agenda' : ''}/${file.replace(/^\d+\./, '').replace(/\.md$/, '')}`,
    ),
)

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  modules: ['@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  icon: {
    provider: 'none',
    clientBundle: {
      scan: true,
      icons: [
        'lucide:house',
        'lucide:users',
        'lucide:calendar-days',
        'lucide:arrow-up-right',
        'lucide:arrow-right',
        'lucide:arrow-left',
        'lucide:heart',
        'lucide:audio-lines',
        'lucide:mic-vocal',
        'lucide:mail',
        'lucide:play',
        'lucide:expand',
        'lucide:info',
        'lucide:menu',
        'lucide:x',
      ],
    },
  },
  hooks: {
    'vite:configResolved'(config) {
      // MDC is nested under Nuxt Content in pnpm installations. Resolve its
      // prebundled dependencies from MDC itself instead of the project root.
      const include = config.optimizeDeps?.include
      if (!include?.some((entry) => entry.startsWith('@nuxtjs/mdc > '))) return
      const projectRequire = createRequire(import.meta.url)
      const contentRequire = createRequire(
        projectRequire.resolve('@nuxt/content'),
      )
      const mdcRequire = createRequire(contentRequire.resolve('@nuxtjs/mdc'))
      config.optimizeDeps!.include = include.map((entry) =>
        entry.startsWith('@nuxtjs/mdc > ')
          ? mdcRequire.resolve(entry.slice('@nuxtjs/mdc > '.length))
          : entry,
      )
    },
  },
  devtools: { enabled: false },
  ui: { colorMode: false, fonts: false },
  app: {
    pageTransition: { name: 'page', mode: 'default', duration: 240 },
    head: {
      htmlAttrs: { lang: 'nl' },
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          sizes: '16x16 32x32 48x48',
          href: '/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          sizes: 'any',
          href: '/favicon.svg?v=unison',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
      ],
      meta: [{ name: 'theme-color', content: '#291e35' }],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', ...contentRoutes],
      failOnError: true,
    },
  },
  experimental: { payloadExtraction: true },
})
