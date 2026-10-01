import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const contentRoot = fileURLToPath(new URL('./content/', import.meta.url))
const contentRoutes = ['pages', 'events'].flatMap((folder) =>
  readdirSync(`${contentRoot}${folder}`)
    .filter((file) => file.endsWith('.md'))
    .map(
      (file) =>
        `${folder === 'events' ? '/agenda' : ''}/${file.replace(/\.md$/, '')}`,
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
  devtools: { enabled: false },
  ui: { colorMode: false, fonts: false },
  app: {
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
