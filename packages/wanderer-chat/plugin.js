import ChatComponent from './components/Chat'
import ChatMessageComponent from './components/Message'
import Chat from './Chat'

export default {

  install (wanderer) {

    // Require some plugins from Wanderer
    var Vue = wanderer.require('vue')
    var broadcast = wanderer.require('broadcast')
    var store = wanderer.require('store')
    var vueGraph = wanderer.require('vueGraph')

    // Extend vuex
    store.registerModule('wandererChat', {
      namespaced: true,
      state: {
        currentLanguage: 'en',
        messages: [],
        messageIds: [],
        typing: false,
        interactions: [],
        interactionVertexIds : []
      },
      mutations: {
        setCurrentLanguage (state, language) {
          state.currentLanguage = language
        },
        setTyping (state, typing) {
          state.typing = typing
        },
        addMessage (state, message) {

          // Generate unique id for this message
          if (message.id === undefined) {
            message.id = uuidv4()
          }

          // Messages should have also a static message string
          if (message.text === undefined) {
            message.text = ''
          }

          if (message.component === undefined) { throw Error('Every message needs a Vue component!') }

          // Freeze the message object to improve performance
          Object.freeze(message);

          // Add the message to stack if it does not exist already
          state.messageIds.push(message.id)
          state.messages.push(message)

          // Remove old messages if there are too many in the stack
          // Unfortunately the browser can't render unlimited messages
          if(state.messages.length > 100) {
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
          if (interaction.showInNavigation === undefined) { interaction.showInNavigation = false }

          // Freeze the message object to improve performance
          Object.freeze(interaction);

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

    // Register chat component
    Vue.component('wanderer-chat', ChatComponent)
    Vue.component('chat-message', ChatMessageComponent)

    // Create the chat instance
    var chat = new Chat(wanderer, broadcast, Vue, store, vueGraph)

    // Push it to Wanderer
    wanderer.provide('chat', chat)

    // Push it to vue
    Vue.prototype.$chat = chat

  }
}
