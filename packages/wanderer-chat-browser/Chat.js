import WandererNestedData from 'wanderer-nested-data'

import Mustache from 'mustache'

import Markdown from 'markdown-it'

var md = Markdown({
  html:         false,       // Enable HTML tags in source
  breaks:       true,        // Convert '\n' in paragraphs into <br>
  linkify:      false        // Autoconvert URL-like text to links
})

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
    this.subscriber.on('truncate', () => {
      this.store.commit('wandererChat/cleanMessages')
      this.store.commit('wandererChat/cleanInteractions')
      this.store.commit('wandererChat/setTyping', false)
    })

    // ResetLifecycle
    this.subscriber.on('resetLifecycle', () => {
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
        case 'sendChatTyping':
          this.store.dispatch('wandererChat/setTyping', e.data.payload)
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

  getMessageDataById (messageId) {
    if(this.store.state.wandererChat.messages[messageId] != undefined) {
      return this.store.state.wandererChat.messages[messageId]
    }
    return undefined
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

  getVertexDataValue (id, key) {
    return this.vueGraph.getVertexDataValue(id, key)
  }

  getTranslatableVertexDataValue (id, key) {
    var currentLanguage = this.store.state.wandererChat.currentLanguage
    return this.vueGraph.getVertexDataValue(id, key, currentLanguage)
  }

  getTranslatableOriginDataValue (key) {
    var currentLanguage = this.store.state.wandererChat.currentLanguage
    return this.vueGraph.getOriginDataValue(key, currentLanguage)
  }

  evaluateVertexDataValue (vertexId, templateKey) {

    // Get the template string
    var template = this.getTranslatableVertexDataValue(vertexId, templateKey)

    // Render template
    if(typeof template === 'string') {
      var data = this.vueGraph.getVertexLifecycleValuesById(vertexId)

      template = Mustache.render(template, data)
      template = md.renderInline(template)

    }

    return template

  }


}
