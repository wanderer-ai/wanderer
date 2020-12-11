<template>
  <div id="app">
    <wanderer-chat/>
  </div>
</template>

<script>

import Vue from 'vue'
import Vuex from 'vuex'
import Wanderer from 'wanderer'
import vueGraphPlugin from 'wanderer-vue-graph'
import chatPlugin from 'wanderer-chat'
//import Worker from "../wanderer.worker.js"
import { client as workerClient } from 'wanderer-webworker'

import pluginBase from 'wanderer-plugin-base-browser'
import pluginQuestion from 'wanderer-plugin-question-browser'
import pluginAction from 'wanderer-plugin-action-browser'



Vue.use(Vuex)

if (typeof(Worker) !== 'undefined') {

  // Create worker
  const worker = new Worker('wanderer.worker.js')

  // Init store
  var store = new Vuex.Store()
  Vue.prototype.$store = store

  // Create a new Wanderer instance
  var wanderer = new Wanderer()

  // Inject the dependencys to Wanderer
  wanderer.provide('store', store)
  wanderer.provide('vue', Vue)
  wanderer.provide('worker', worker)

  // Initiate Wanderer plugins
  wanderer.use(vueGraphPlugin)
  wanderer.use(chatPlugin)
  wanderer.use(workerClient)
  wanderer.use(pluginBase)
  wanderer.use(pluginQuestion)
  wanderer.use(pluginAction)

} else {
  console.lol('No webworker defined ...')
}

export default {
  name: 'App',
  components: {

  }
}

</script>

<style>

</style>
