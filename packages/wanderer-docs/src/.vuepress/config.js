const { description } = require('../../package')

module.exports = {
  base: '/docs/',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Wanderer.ai Docs',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'User guide',
        link: '/user-guide/',
      },
      {
        text: 'Developer guide',
        link: '/dev-guide/'
      },
      {
        text: 'Wanderer.ai',
        link: 'https://wanderer.ai'
      }
    ],
    sidebar: {
      '/user-guide/': [
        {
          title: 'User guide',
          collapsable: false,
          children: [
            'toolbar',
            'map',
            'map-tools',
            'first-bot'
          ]
        },
      ],
      '/dev-guide/': [
        {
          title: 'Developer guide',
          collapsable: false,
          // children: [
          //   '',
          //   'using-vue',
          // ]
        },
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
