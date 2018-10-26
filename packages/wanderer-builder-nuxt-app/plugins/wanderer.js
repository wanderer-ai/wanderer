import Vue from 'vue'
// import Vuex from 'vuex'

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

// Install Vue Bootstrap
Vue.use(BootstrapVue)

// Create Vuex store
//Vue.use(Vuex)
//const store = new Vuex.Store()

export default ({ app, store }) => {

  // Create Brain instance
  Brain.init(store)

  // Install Brain plugins
  Brain.use(BrainQuestions)
  Brain.use(BrainAPIs)
  Brain.use(BrainBase) // Load the base plugin at the end because it will set a few default styles which should not be overidden by other plugins

}
