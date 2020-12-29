import path from 'path'
import { UserConfig } from 'vite'
import Voie from 'vite-plugin-voie'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import ViteComponents from 'vite-plugin-components'
import Markdown from 'vite-plugin-md'
import Shiki from 'markdown-it-shiki'
import { VitePWA } from 'vite-plugin-pwa'

const alias = {
  '/~/': path.resolve(__dirname, 'src'),
}

const config: UserConfig = {
  alias,
  plugins: [
    // https://github.com/vamplate/vite-plugin-voie
    Voie({
      // load index page sync and bundled with the landing page to improve first loading time.
      // feel free to remove if you don't need it
      importMode(path: string) {
        return path === '/src/pages/index.vue' ? 'sync' : 'async'
      },
      extensions: ['vue', 'md'],
    }),

    // https://github.com/antfu/vite-plugin-md
    Markdown({
      // for https://github.com/tailwindlabs/tailwindcss-typography
      wrapperClasses: 'prose prose-sm m-auto',
      markdownItSetup(md) {
        // https://github.com/antfu/markdown-it-shiki
        md.use(Shiki, {
          theme: {
            dark: 'min-dark',
            light: 'min-light',
          },
        })
      },
    }),

    // https://github.com/antfu/vite-plugin-components
    ViteComponents({
      // currently, vite does not provide an API for plugins to get the config https://github.com/vitejs/vite/issues/738
      // as the `alias` changes the behavior of middlewares, you have to pass it to ViteComponents to do the resolving
      alias,

      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      customLoaderMatcher({ path }) {
        return path.endsWith('.md')
      },

      // auto import icons
      customComponentResolvers: [
        // https://github.com/antfu/vite-plugin-icons
        ViteIconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
      ],
    }),

    // https://github.com/antfu/vite-plugin-icons
    ViteIcons(),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      manifest: {
        name: 'Vitesse',
        short_name: 'Vitesse',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
}

export default config
