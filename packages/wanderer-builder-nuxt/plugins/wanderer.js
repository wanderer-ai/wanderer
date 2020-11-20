import Vue from 'vue'
import Wanderer from 'wanderer'
import VueGraphPlugin from 'wanderer-vue-graph'
import BuilderPlugin from 'wanderer-builder'
import ChatPlugin from 'wanderer-chat'
import Worker from "../wanderer.worker.js"
import { client as workerClient } from 'wanderer-webworker'

// import { client as workerClient } from 'wanderer-webworker'
import { client as baseClient } from 'wanderer-plugin-base'

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
  wanderer.use(VueGraphPlugin)
  wanderer.use(BuilderPlugin)
  wanderer.use(ChatPlugin)
  wanderer.use(workerClient)
  wanderer.use(baseClient)

}
