const pkg = require('./package')

module.exports = {
  // target: 'static', // Habe das hier mal deaktiviert. Hat beim generaten trotz änderungen plötzlich behauptet: Skipping webpack build as no changes detected
  router: {
    base: '/builder/'
  },
  ssr: false,

  /*
  ** Headers of the page
  */

  head: {
    title: 'Wanderer.ai Conversation Builder',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Reactive chatbot builder for the web' },

      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@wanderer_ai' },
      { name: 'twitter:title', content: 'Reactive chatbot builder for the web' },
      { name: 'twitter:description', content: 'reactive context, open source, privacy by design, no registering or payments, runs completely offline' },
      { name: 'twitter:image', content: 'https://wanderer.ai/builder/preview.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/wanderer'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, { isDev, isClient }) {
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" }
      });
    }
  },
  buildModules: [
    '@nuxtjs/tailwindcss'
  ],
  // purgeCSS: {
  //   whitelist: [],
  // },
}
