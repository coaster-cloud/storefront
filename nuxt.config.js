export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'coaster.cloud',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      { hid: 'og:title', property: 'og:title', content: 'coaster.cloud' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'coaster.cloud' },
      { hid: 'og:image', property: 'og:image', content: 'https://coaster.cloud/opengraph.jpg' },
      { hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: 'coaster.cloud' },
      { hid: 'apple-itunes-app', name: 'apple-itunes-app', content: 'app-id=1568754220' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        hid: 'analytics',
        src: "https://analytics.coaster.cloud/umami.js",
        body: true,
        async: true,
        defer: true,
        "data-website-id": process.env.ANALYTICS_ID || 'development'
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/css/app.scss'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/node_modules/vue-flux', mode: 'client' },
    '~/plugins/vue-number-animation.client.js',
    '~/plugins/vue-calendar-heatmap.client.js',
    '~/plugins/leaflet.client.js',
    '~/plugins/markdown.js',
    '~/plugins/vue-scroll-to.js',
    '~/plugins/graphql.js',
    '~/plugins/create-head.js',
    '~/plugins/timestamp.js',
    '~/plugins/umami.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [{ path: '~/components', pathPrefix: false }],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/sentry',
    'nuxt-i18n',
    ['cookie-universal-nuxt', { parseJSON: false }]
  ],

  // Bootstrap
  bootstrapVue: {
    icons: true,
    config: {
      BToast: {
        solid: true,
        toaster: 'b-toaster-top-right',
        autoHideDelay: 2000
      }
    }
  },

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

      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
        options: {
          fix: true
        }
      })
    }
  },

  // Public env config
  publicRuntimeConfig: {
    dataServiceUrl: process.env.DATA_SERVICE_URL || 'https://data.coaster.cloud/v1',
    appVersion: process.env.APP_VERSION || 'v0.0.0'
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
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: false,
      onlyOnRoot: true
    }
  },

  // Loading
  loading: false
}
