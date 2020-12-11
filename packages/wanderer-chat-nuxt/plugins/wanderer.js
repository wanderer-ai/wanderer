import Vue from 'vue'
import Wanderer from 'wanderer'
import vueGraphPlugin from 'wanderer-vue-graph'
import chatPlugin from 'wanderer-chat-browser'
import Worker from "../wanderer.worker.js"
import { client as workerClient } from 'wanderer-webworker'

import pluginBase from 'wanderer-plugin-base-browser'
import pluginQuestion from 'wanderer-plugin-question-browser'
import pluginAction from 'wanderer-plugin-action-browser'

export default ({ app, store }) => {

  // Create a new Wanderer instance
  var wanderer = new Wanderer()

  // Create a new webworker instance
  const worker = new Worker()

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

}
