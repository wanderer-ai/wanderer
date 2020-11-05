import Vue from 'vue'

import Wanderer from 'wanderer'

// TODO: Weg damit
// import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import BuilderPlugin from 'wanderer-builder'

// import WandererBuilderComponent from 'wanderer-builder-vue-component'
// import WandererChatComponent from 'wanderer-chat-vue-component'

import Worker from "../wanderer.worker.js"

import { client as workerClient } from 'wanderer-webworker'

import { client as baseClient } from 'wanderer-plugin-base'

// import WandererVuePlugin from 'wanderer-vue-plugin'
// import WandererPluginBase from 'wanderer-plugin-base'
// import WandererPluginQuestion from 'wanderer-plugin-question'
// import WandererPluginConclusion from 'wanderer-plugin-conclusion'
// import WandererPluginApi from 'wanderer-plugin-api'
// import WandererPluginAction from 'wanderer-plugin-action'
// import WandererPluginTime from 'wanderer-plugin-time'
// import WandererPluginReport from 'wanderer-plugin-report'

// import StoreSingeton from 'wanderer-store-singleton'

export default ({ app, store }) => {

  // Create a new Wanderer instance
  var wanderer = new Wanderer()

  const worker = new Worker();

  // Push the context to wanderer
  wanderer.provide('store', store)
  wanderer.provide('vue', Vue)
  wanderer.provide('worker', worker)

  // Load the builder plugin
  wanderer.use(BuilderPlugin)

  wanderer.use(workerClient)

  wanderer.use(baseClient)

  // Install Vue Bootstrap
  // Vue.use(BootstrapVue)

  // Init vuex store singleton
  // StoreSingeton.set(store)

  // // Install wanderer plugin
  // Vue.use(WandererVuePlugin, {plugins: [
  //   WandererBuilderComponent,
  //   WandererChatComponent,
  //   WandererPluginBase,
  //   // WandererPluginTime,
  //   // WandererPluginConclusion,
  //   // WandererPluginQuestion,
  //   // WandererPluginAction,
  //   // WandererPluginReport
  //
  //   // WandererPluginApi
  // ]})

}
