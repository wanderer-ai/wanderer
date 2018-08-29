// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Brain from 'wanderer-brain'
import BrainBase from 'wanderer-brain-base'
import BrainQuestions from 'wanderer-brain-questions'
import BrainAPIs from 'wanderer-brain-apis'

// Install Vue plugins
Vue.use(BootstrapVue)
Vue.use(Brain)

// Install Brain plugins
Brain.use(BrainBase)
Brain.use(BrainQuestions)
Brain.use(BrainAPIs)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
