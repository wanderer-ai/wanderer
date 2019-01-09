import Vue from 'vue'
// import Vuex from 'vuex'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import WandererBuilderComponent from 'wanderer-builder-vue-component'
import WandererChatComponent from 'wanderer-chat-vue-component'

import PortalVue from 'portal-vue'

import WandererVuePlugin from 'wanderer-vue-plugin'
import WandererPluginBase from 'wanderer-plugin-base'
import WandererPluginQuestion from 'wanderer-plugin-question'
import WandererPluginConclusion from 'wanderer-plugin-conclusion'
import WandererPluginApi from 'wanderer-plugin-api'

import StoreSingeton from 'wanderer-store-singleton'

export default ({ app, store }) => {

  // Use portal plugin
  Vue.use(PortalVue)

  // Install Vue Bootstrap
  Vue.use(BootstrapVue)

  // Init vuex store singleton
  StoreSingeton.set(store)

  // Install wanderer plugin
  Vue.use(WandererVuePlugin, {plugins: [
    WandererBuilderComponent,
    WandererChatComponent,
    WandererPluginBase,

    // Place this plugin before the questions plugin.
    // So the conclusions will appear befor the questions in the chat!
    // As an alternative this could be reached by using priorities inside the traversalFinished event callbacks
    WandererPluginConclusion,

    WandererPluginQuestion,
    WandererPluginApi
  ]})

}
