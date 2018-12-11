import ChatComponent from './App'
import WandererSingleton from 'wanderer-singleton'
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
        addMessage (state, message) {
          state.messages.push(message)
        },
      }
    })

    // // Listen for traversal event
    // WandererSingleton.on('traversalFinished', function() {
    //   console.log('finished')
    //
    //   // Add messages to chat
    //
    // })

    // Add instance methods
    // Vue.prototype.$wandererBuilder = WandererBuilderSingleton

  }

}
