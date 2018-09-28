// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Brain from 'wanderer-brain'
import BrainBase from 'wanderer-brain-base'
import BrainQuestions from 'wanderer-brain-questions'
import BrainAPIs from 'wanderer-brain-apis'

// Create Vuex store
Vue.use(Vuex)
const store = new Vuex.Store()

// Create Brain instance
// Vue.use(Brain)
Brain.init(store)

// Install Brain plugins
Brain.use(BrainBase)
Brain.use(BrainQuestions)
Brain.use(BrainAPIs)

// Brain.setStore(store)

// Install Vue Bootstrap
Vue.use(BootstrapVue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store, // Push the store to all child components
  // brain, // Push the brain to all child components
  components: { App },
  template: '<App/>'
})
