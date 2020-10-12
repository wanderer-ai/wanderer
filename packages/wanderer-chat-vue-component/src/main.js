// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'Vuex'
import App from './App'

import PortalVue from 'portal-vue'

import WandererVuePlugin from 'wanderer-vue-plugin'
import WandererPluginBase from 'wanderer-plugin-base'
import WandererPluginQuestion from 'wanderer-plugin-question'
import WandererPluginConclusion from 'wanderer-plugin-conclusion'
import WandererPluginApi from 'wanderer-plugin-api'
import WandererPluginTime from 'wanderer-plugin-time'

import StoreSingleton from 'wanderer-store-singleton'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import WandererChatComponent from './plugin.js'

// Install Vue Bootstrap
Vue.use(BootstrapVue)

Vue.config.productionTip = false

// Use portal plugin
Vue.use(PortalVue)

// Init vuex store singleton
// Remember: You are not in a nuxt project! So you have to init the store by yourself.
Vue.use(Vuex)
const store = new Vuex.Store()
StoreSingleton.set(store)

// Install wanderer plugin
Vue.use(WandererVuePlugin, {plugins: [

  WandererChatComponent,
  WandererPluginBase,
  WandererPluginConclusion,
  WandererPluginQuestion,
  WandererPluginApi,
  WandererPluginTime
]})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
