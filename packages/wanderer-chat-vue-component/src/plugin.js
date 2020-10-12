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
        typing: false,
        interactions: [],
        interactionVertexIds : []
      },
      mutations: {
        setTyping (state, typing) {
          state.typing = typing
        },
        addMessage (state, message) {

          // Generate unique id for this message
          if (message.id === undefined) {
            message.id = uuidv4()
          }

          if (message.component === undefined) { throw Error('Every message needs a Vue component!') }

          // Add the message to stack if it does not exist already
          state.messageIds.push(message.id)
          state.messages.push(message)

          // Remove old messages if there are too many in the stack
          // The browser can't render unlimited messages
          if(state.messages.length>100) {
            state.messages.splice(0,1)
            state.messageIds.splice(0,1)
          }

        },

        cleanMessages (state) {
          state.messages = []
          state.messageIds = []
        },
        addInteraction (state, interaction) {

          if (interaction.component === undefined) { throw Error('Every interaction needs a Vue component!') }
          if (interaction.vertexId === undefined) { throw Error('Every interaction needs a vertex id!') }

          state.interactions.push(interaction)
          state.interactionVertexIds.push(interaction.vertexId)

        },
        cleanInteractions (state) {
          state.interactions = []
          state.interactionVertexIds = []
        },
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
      WandererStoreSingleton.store.commit('wanderer/chat/cleanInteractions')
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
