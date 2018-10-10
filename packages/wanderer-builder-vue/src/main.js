// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import PortalVue from 'portal-vue'

import Brain from 'wanderer-brain'
import BrainBase from 'wanderer-brain-base'
import BrainQuestions from 'wanderer-brain-questions'
import BrainAPIs from 'wanderer-brain-apis'

// Use portal
Vue.use(PortalVue)

// Create Vuex store
Vue.use(Vuex)
const store = new Vuex.Store()

// Create Brain instance
Brain.init(store)

// Install Brain plugins
Brain.use(BrainQuestions)
Brain.use(BrainAPIs)
Brain.use(BrainBase) // Load the base plugin at the end because it will set a few default styles which should not be overidden by other plugins

// Install Vue Bootstrap
Vue.use(BootstrapVue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store, // Push the store to all child components
  components: { App },
  template: '<App/>'
})
