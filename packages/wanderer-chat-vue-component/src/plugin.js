import ChatComponent from './App'
import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'
import axios from 'axios'
const uuidv4 = require('uuid/v4')

export default {

  install (Vue) {
    // Add axios to Vue
    Vue.prototype.$axios = axios

    // Register builder component
    Vue.component('wanderer-chat', ChatComponent)

    // var messageDelayResetTimeout
    // var messageDelay = 0

    var typingTimer = null;

    // Extend vuex with new namespace
    WandererStoreSingleton.store.registerModule(['wanderer', 'chat'], {
      namespaced: true,
      state: {
        messages: [],
        messageIds: [],
        typing: false
      },
      mutations: {
        setTyping (state, typing) {
          state.typing = typing
        },
        addMessage (state, message) {
          if (message.id === undefined) {
            // console.log(message)
            // throw Error('Every message needs an unique id!')
            message.id = uuidv4()
          }
          if (message.component === undefined) { throw Error('Every message needs a Vue component!') }
          // if (message.delay === undefined) { message.delay = 0 }

          // Delay the messages and delay every message longer than the message before
          // message.delay = 1000+1000*messageDelay
          // messageDelay++
          // // Reset the delay counter after one second
          // messageDelayResetTimeout = setTimeout( function ( ) {
          //   messageDelay = 0
          // }, 1000);


          // Add the message to stack if it does not exist already
          // if (state.messageIds.indexOf(message.id) === -1) {
          state.messageIds.push(message.id)
          state.messages.push(message)
          // }
        },
        // showMessage (state, key) {
        //   this._vm.$set(state.messages[key], 'show', true)
        // },
        cleanMessages (state) {
          state.messages = []
          state.messageIds = []
        }
      },
      actions: {
        async setTyping(context, time) {
          context.commit('setTyping', true)
          setTimeout(()=>{
            context.commit('setTyping', false)
          }, time)
        }
      }
    })

    // This event will be fired on loading new data or on resetting the chat
    WandererSingleton.on('truncate', function () {
      WandererStoreSingleton.store.commit('wanderer/chat/cleanMessages')
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
