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
        messages: [],
        messageIds : []
      },
      mutations: {
        addMessage (state, message) {
          if(message.id==undefined){throw Error('Every message needs an unique id!')}
          if(message.component==undefined){throw Error('Every message needs an component!')}
          // Add the message to stack if it does not exist already
          if(state.messageIds.indexOf(message.id)==-1){
            state.messageIds.push(message.id)
            state.messages.push(message)
          }
        },
        cleanMessages (state) {
          state.messages = []
          state.messageIds = []
        }
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
