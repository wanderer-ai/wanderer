<template>
  <div>
    <wanderer-chat flow-url="https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/intro/welcome.json" />
  </div>
</template>

<script>

// This is the nuxt-custom-elements entry file
// We use this component as a wrapper to generate a web component with nuxt while building for production
// See details here: https://github.com/GrabarzUndPartner/nuxt-custom-elements

import Vue from 'vue'

import Vuex from 'vuex'

import Wanderer from 'wanderer'
import vueGraphPlugin from 'wanderer-vue-graph'
import chatPlugin from 'wanderer-chat-browser'
import Worker from "../wanderer.worker.js"
import { client as workerClient } from 'wanderer-webworker'

import pluginBase from 'wanderer-plugin-base-browser'
import pluginQuestion from 'wanderer-plugin-question-browser'
import pluginAction from 'wanderer-plugin-action-browser'

Vue.use(Vuex)

const store = new Vuex.Store()

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

export default {
  store
}

</script>

<style>

</style>
