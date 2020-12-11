import Chat from './Chat'
import ChatComponent from './components/Chat'
import ChatMessageComponent from './components/ui/Message'
import ChatButtonComponent from './components/ui/Button'
import ChatButtonGroupComponent from './components/ui/ButtonGroup'
import ChatContentComponent from './components/ui/Content'

export default {

  install (wanderer) {

    // Require some plugins from Wanderer
    var Vue = wanderer.require('vue')
    var broadcast = wanderer.require('broadcast')
    var worker = wanderer.require('worker')
    var store = wanderer.require('store')
    var vueGraph = wanderer.require('vueGraph')

    // Register chat component
    Vue.component('wanderer-chat', ChatComponent)
    Vue.component('chat-message', ChatMessageComponent)
    Vue.component('chat-button', ChatButtonComponent)
    Vue.component('chat-button-group', ChatButtonGroupComponent)
    Vue.component('chat-content', ChatContentComponent)

    // Extend vuex
    store.registerModule('wandererChat', {
      namespaced: true,
      state: {
        isVisible: false,
        currentLanguage: 'en',
        // messageVertexIds: [],
        messageIds: [],
        messages: {},
        typing: false,
        // interactions: [],
        interactionVertexIds : []
      },
      mutations: {
        setVisible (state, value) {
          state.isVisible = value
        },
        setCurrentLanguage (state, language) {
          state.currentLanguage = language
        },
        setTyping (state, typing) {
          state.typing = typing
        },
        addMessage (state, {vertexId, payload}) {

          var message = {
            id: wanderer.getRandomId(),
            vertexId: vertexId,
            payload: payload
          }

          // Freeze the message object to improve performance
          Object.freeze(message);

          // Add the message to stack if it does not exist already
          state.messageIds.push(message.id)

          state.messages[message.id] = message

          // Remove old messages if there are too many in the stack
          // Unfortunately the browser can't render unlimited messages
          if(state.messageIds.length > 100) {
            var removedItems = state.messageIds.splice(0,1)
            if(removedItems[0] != undefined) {
              // Also remove the message data
              delete state.messages[removedItems[0]]
            }
          }

        },
        cleanMessages (state) {
          // state.messageVertexIds = []
          state.messageIds = []
          state.messages = {}
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

    // Create the chat instance
    var chat = new Chat(wanderer, broadcast, worker, Vue, store, vueGraph)

    // Push it to Wanderer
    wanderer.provide('chat', chat)

    // Push it to vue
    Vue.prototype.$chat = chat

  }
}
