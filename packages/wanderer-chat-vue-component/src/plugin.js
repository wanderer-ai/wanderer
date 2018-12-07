import ChatComponent from './App'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    // Register builder component
    Vue.component('wanderer-chat', ChatComponent)

    // Extend vuex with new namespace
    WandererStoreSingleton.store.registerModule(['wanderer', 'chat'], {
      namespaced: true,
      state: {
        messages: []
      },
      mutations: {

      }
    })

    // Add instance methods
    // Vue.prototype.$wandererBuilder = WandererBuilderSingleton

  }

}
