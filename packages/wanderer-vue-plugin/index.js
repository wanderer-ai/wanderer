import WandererSingleton from 'wanderer-singleton'
import StoreSingleton from 'wanderer-store-singleton'
import CytoscapeSingleton from 'wanderer-cytoscape-singleton'

export default {

  // Vue installer method
  install (Vue, {plugins}) {

    // Init Wanderer
    // We have to inject these props
    // Wanderer.init(cytoscape, store)

    // Add instance methods
    Vue.prototype.$wanderer = WandererSingleton
    Vue.prototype.$cytoscape = CytoscapeSingleton

    // Register wanderer store module
    StoreSingleton.store.registerModule('wanderer', {
      namespaced: true,
      state: {
        originVertexId : '',
        vertexDocumentIds: [],
        vertexDocumentData: {},
        edgeDocumentIds: [],
        edgeDocumentData: {},
        // enabledLanguages: ['en', 'de'],
        currentLanguage: 'en',
        collectedValues: {}
      },
      mutations: {
        setOriginVertex (state, vertexId) {
          state.originVertexId = vertexId
        },
        addVertex (state, documentData) {
          state.vertexDocumentIds.push(documentData._id)
          this._vm.$set(state.vertexDocumentData, documentData._id, documentData)
        },
        removeVertex (state, vertexId) {
          // Remove id from stack
          state.vertexDocumentIds.splice(state.vertexDocumentIds.indexOf(vertexId), 1)
          // Remove object
          this._vm.$delete(state.vertexDocumentData, vertexId)
        },
        addEdge (state, documentData) {
          // Push document id
          state.edgeDocumentIds.push(documentData._id)
          this._vm.$set(state.edgeDocumentData, documentData._id, documentData)
        },
        removeEdge (state, edgeId) {
          // Remove id from stack
          state.edgeDocumentIds.splice(state.edgeDocumentIds.indexOf(edgeId), 1)
          // Remove object
          this._vm.$delete(state.edgeDocumentData, edgeId)
        },
        setVertexDataValue (state, {id, key, value, language}) {
          if(language !== undefined){
            this._vm.$set(state.vertexDocumentData[id][key], language, value)
          }else{
            this._vm.$set(state.vertexDocumentData[id], key, value)
          }
        },
        setEdgeDataValue (state, {id, key, value, language}) {
          if(language !== undefined){
            this._vm.$set(state.edgeDocumentData[id][key], language, value)
          }else{
            this._vm.$set(state.edgeDocumentData[id], key, value)
          }
        },
        enableLanguage (state, language) {
          //state.enabledLanguages.push(language)
          // Store the new language into the origin node
          state.vertexDocumentData[state.originVertexId].languages.push(language);
        },
        disableLanguage (state, language) {
          //state.enabledLanguages.splice(state.enabledLanguages.indexOf(language), 1)
          state.vertexDocumentData[state.originVertexId].languages.splice(state.vertexDocumentData[state.originVertexId].languages.indexOf(language), 1);
        },
        setCurrentLanguage (state, language) {
          state.currentLanguage = language
        },
        setValue (state, {key, value}) {
          this._vm.$set(state.collectedValues, key, value)
        },
        truncate (state) {
          this._vm.$set(state, 'originVertexId', '')
          this._vm.$set(state, 'vertexDocumentIds', [])
          this._vm.$set(state, 'vertexDocumentData', {})
          this._vm.$set(state, 'edgeDocumentIds', [])
          this._vm.$set(state, 'edgeDocumentData', {})
          // this._vm.$set(state, 'enabledLanguages', ['en', 'de'])
          this._vm.$set(state, 'currentLanguage', 'en')
          this._vm.$set(state, 'collectedValues', {})
        }
      }
    })

    // Register child plugins
    for(let i in plugins){
      Vue.use(plugins[i])
    }

  }

}
