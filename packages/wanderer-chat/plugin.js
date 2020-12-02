import ChatComponent from './components/Chat'
import ChatMessageComponent from './components/Message'
import ChatButtonComponent from './components/Button'
import Chat from './Chat'

export default {

  install (wanderer) {

    // Require some plugins from Wanderer
    var Vue = wanderer.require('vue')
    var broadcast = wanderer.require('broadcast')
    var worker = wanderer.require('worker')
    var store = wanderer.require('store')
    var vueGraph = wanderer.require('vueGraph')

    // Extend vuex
    store.registerModule('wandererChat', {
      namespaced: true,
      state: {
        currentLanguage: 'en',
        messageVertexIds: [],
        // messageIds: [],
        typing: false,
        // interactions: [],
        interactionVertexIds : []
      },
      mutations: {
        setCurrentLanguage (state, language) {
          state.currentLanguage = language
        },
        setTyping (state, typing) {
          state.typing = typing
        },
        addMessage (state, vertexId) {

          // var message = {
          //   id: wanderer.getRandomId()
          // }

          // if (message.component === undefined) { throw Error('Every message needs a Vue component!') }

          // Freeze the message object to improve performance
          // Object.freeze(message);

          // Add the message to stack if it does not exist already
          // state.messageIds.push(message.id)

          state.messageVertexIds.push(vertexId)

          // Remove old messages if there are too many in the stack
          // Unfortunately the browser can't render unlimited messages
          if(state.messageVertexIds.length > 100) {
            state.messageVertexIds.splice(0,1)
            // state.messageIds.splice(0,1)
          }

        },
        cleanMessages (state) {
          state.messageVertexIds = []
          // state.messageIds = []
        },
        addInteraction (state, vertexId) {

          // if (interaction.component === undefined) { throw Error('Every interaction needs a Vue component!') }
          // if (interaction.vertexId === undefined) { throw Error('Every interaction needs a vertex id!') }
          // if (interaction.showInNavigation === undefined) { interaction.showInNavigation = false }
          //
          // // Freeze the message object to improve performance
          // Object.freeze(interaction);

          // state.interactions.push(interaction)
          state.interactionVertexIds.push(vertexId)

        },
        cleanInteractions (state) {
          // state.interactions = []
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

    // Register chat component
    Vue.component('wanderer-chat', ChatComponent)
    Vue.component('chat-message', ChatMessageComponent)
    Vue.component('chat-button', ChatButtonComponent)

    // Create the chat instance
    var chat = new Chat(wanderer, broadcast, worker, Vue, store, vueGraph)

    // Push it to Wanderer
    wanderer.provide('chat', chat)

    // Push it to vue
    Vue.prototype.$chat = chat

  }
}
