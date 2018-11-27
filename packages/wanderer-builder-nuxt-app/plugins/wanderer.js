import Vue from 'vue'
// import Vuex from 'vuex'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import WandererBuilderComponent from 'wanderer-builder-vue-component'

import PortalVue from 'portal-vue'

import WandererVuePlugin from 'wanderer-vue-plugin'
import WandererPluginBase from 'wanderer-plugin-base'
import WandererPluginQuestion from 'wanderer-plugin-question'
import WandererPluginApi from 'wanderer-plugin-api'

import CytoscapeSingleton from 'cytoscape-singleton'

export default ({ app, store }) => {

  // Use portal plugin
  Vue.use(PortalVue)

  // Install Vue Bootstrap
  Vue.use(BootstrapVue)

  // Install wanderer plugin
  Vue.use(WandererVuePlugin, {store: store, cytoscape: CytoscapeSingleton, plugins: [WandererBuilderComponent, WandererPluginBase, WandererPluginQuestion, WandererPluginApi ]})

  // Install builder plugin
  // Vue.use(WandererBuilderComponent, {store: store, cytoscape: CytoscapeSingleton, wanderer: Wanderer, wandererPlugins: [ WandererPluginBase, WandererPluginQuestion, WandererPluginApi ]})

}
