export default class Chat {

  constructor (wanderer, broadcast, vue, store, vueGraph) {
    this.wanderer = wanderer
    this.broadcast = broadcast
    this.vue = vue
    this.store = store
    this.vueGraph = vueGraph
    this.cytoscape = undefined

    // Register subscriber
    this.subscriber = this.broadcast.subscribe('chat')

    // Set language
    this.subscriber.on('setLanguage', (language) => {
      this.store.commit('wandererChat/setCurrentLanguage', language)
    })

    // Truncate
    this.subscriber.on('truncate', (vertexData) => {
      this.store.commit('wandererChat/cleanMessages')
      this.store.commit('wandererChat/cleanInteractions')
      this.store.commit('wandererChat/setTyping', false)
    })

    // Listen for vertex data changes
    this.subscriber.on('setVertexDataValue', ({id, key, value, language}) => {

    })

    // Listen for edge data changes
    this.subscriber.on('setEdgeDataValue', ({id, key, value, language}) => {

    })

  }

  setCurrentLanguage (language) {
    this.store.commit('wandererChat/setCurrentLanguage', language)
    this.subscriber.emit('setLanguage', language);
  }

  getCurrentLanguage () {
    return this.store.state.wandererChat.currentLanguage;
  }

}
