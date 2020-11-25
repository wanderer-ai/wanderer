import WandererNestedData from 'wanderer-nested-data'

export default class Chat {

  constructor (wanderer, broadcast, worker, vue, store, vueGraph) {
    this.wanderer = wanderer
    this.broadcast = broadcast
    this.worker = worker
    this.vue = vue
    this.store = store
    this.vueGraph = vueGraph
    this.cytoscape = undefined

    this.vertexCollectionProps = new WandererNestedData()

    // Register subscriber
    this.subscriber = this.broadcast.subscribe('chat')

    // Listen for new vertex collection props
    this.subscriber.on('addVertexCollectionProps', ({name, props}) => {
      props = new WandererNestedData(props)
      props.with('chat', (props) => {
        this.vertexCollectionProps.set(name, props)
      })
    })

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

    // Listen for worker events
    worker.addEventListener('message', (e) => {
      switch(e.data.event) {
        case 'sendChatMessage':
          this.store.commit('wandererChat/addMessage', e.data.payload)
          break;
      }
    }, false);

    // // Listen for vertex data changes
    // this.subscriber.on('setVertexDataValue', ({id, key, value, language}) => {
    //
    // })
    //
    // // Listen for edge data changes
    // this.subscriber.on('setEdgeDataValue', ({id, key, value, language}) => {
    //
    // })

  }

  getVertexCollectionPropsById (vertexId) {
    var collection = this.vueGraph.getVertexDataValue(vertexId, '_collection')
    if(collection) {
      if(this.vertexCollectionProps.has(collection)) {
        return this.vertexCollectionProps.get(collection)
      }
    }
  }

  setCurrentLanguage (language) {
    this.store.commit('wandererChat/setCurrentLanguage', language)
    this.subscriber.emit('setLanguage', language);
  }

  getCurrentLanguage () {
    return this.store.state.wandererChat.currentLanguage;
  }

}
