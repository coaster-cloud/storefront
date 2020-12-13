export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'coaster.cloud',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:title', name: 'og:title', content: 'coaster.cloud' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'coaster.cloud' },
      { hid: 'og:image', name: 'og:image', content: '/opengraph.jpg' },
      { hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: 'coaster.cloud' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/css/app.scss'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/node_modules/vue-flux', mode: 'client' },
    '~/plugins/vue-number-animation.client.js',
    '~/plugins/global-components.js',
    '~/plugins/image.js',
    '~/plugins/markdown.js',
    '~/plugins/create-head.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-i18n'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config) {
      config.module.rules.push({
        resourceQuery: /blockType=query/,
        type: 'javascript/auto',
        loader: require.resolve('./loader/query-loader.js')
      })

      config.module.rules.push({
        test:  /\.ya?ml$/,
        type: 'json',
        loader: 'yaml-loader'
      })
    }
  },

  // Public env config
  publicRuntimeConfig: {
    dataServiceUrl: process.env.DATA_SERVICE_URL,
    imageUrl: process.env.IMAGE_URL
  },

  // Translations
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.js',
        icon: 'flag-icon-gb',
        label: 'English'
      },
      {
        code: 'de',
        file: 'de.js',
        icon: 'flag-icon-de',
        label: 'Deutsch'
      }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
    strategy: 'prefix'
  }
}
