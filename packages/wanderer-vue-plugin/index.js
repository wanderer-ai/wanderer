import Wanderer from 'wanderer-singleton'

export default {

  // Vue installer method
  install (Vue, {store, cytoscape, plugins}) {

    // Init Wanderer
    // We have to inject these props
    Wanderer.init(cytoscape, store)

    // Add instance methods
    Vue.prototype.$wanderer = Wanderer

    Vue.prototype.$cytoscape = cytoscape

    // Register wanderer store module
    store.registerModule('wanderer', {
      namespaced: true,
      state: {
        vertexDocumentIds: [],
        vertexDocumentData: {},
        edgeDocumentIds: [],
        edgeDocumentData: {},
      },
      mutations: {
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
          // Push document data
          let data = {
            _id: documentData._id,
            _collection: documentData._collection,
            _from: documentData._from,
            _to: documentData._to
          }
          this._vm.$set(state.edgeDocumentData, documentData._id, data)
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
        truncate (state) {
          this._vm.$set(state, 'vertexDocumentIds', [])
          this._vm.$set(state, 'vertexDocumentData', {})
          this._vm.$set(state, 'edgeDocumentIds', [])
          this._vm.$set(state, 'edgeDocumentData', {})
        }
      }
    })

    // Register child plugins
    for(let i in plugins){
      Vue.use(plugins[i], {wanderer: Wanderer, store: store, cytoscape: cytoscape })
    }

  }

}
