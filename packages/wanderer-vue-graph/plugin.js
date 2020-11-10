import VueGraph from './VueGraph'

export default {

  install (wanderer) {

    // Require some plugins
    var Vue = wanderer.require('vue')
    var store = wanderer.require('store')

    // Extend vuex with new namespace
    store.registerModule('wandererGraph', {
      namespaced: true,
      state: {
        // currentLanguage: 'en',
        originVertexId : '',
        vertexDocumentIds: [],
        vertexDocumentData: {},
        edgeDocumentIds: [],
        edgeDocumentData: {},
        vertexLifecycleData: {},
        // traversedEdges: [],
        // traversedVertices: []
      },
      mutations: {
        setOriginVertex (state, vertexId) {
          state.originVertexId = vertexId
        },
        addVertex (state, vertexData) {
          state.vertexDocumentIds.push(vertexData._id)
          this._vm.$set(state.vertexDocumentData, vertexData._id, vertexData)
          console.log(state)
        },
        removeVertex (state, vertexId) {
          state.vertexDocumentIds.splice(state.vertexDocumentIds.indexOf(vertexId), 1)
          this._vm.$delete(state.vertexDocumentData, vertexId)
        },
        addEdge (state, documentData) {
          state.edgeDocumentIds.push(documentData._id)
          this._vm.$set(state.edgeDocumentData, documentData._id, documentData)
        },
        removeEdge (state, edgeId) {
          state.edgeDocumentIds.splice(state.edgeDocumentIds.indexOf(edgeId), 1)
          this._vm.$delete(state.edgeDocumentData, edgeId)
        },
        setVertexDataValue (state, {id, key, value, language}) {
          if(language !== undefined) {
            if(state.vertexDocumentData[id][key] == undefined) {
              this._vm.$set(state.vertexDocumentData[id], key, {})
            }
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
        setVertexLifecycleData (state, {id, key, value}) {
          if(state.vertexLifecycleData[id] == undefined) {
            this._vm.$set(state.vertexLifecycleData, id, {})
          }
          this._vm.$set(state.vertexLifecycleData[id], key, value)
        },
        cleanVertexLifecycleData (state) {
          this._vm.$set(state, 'vertexLifecycleData', {})
        },
        // enableLanguage (state, language) {
        //   //state.enabledLanguages.push(language)
        //   // Store the new language into the origin node
        //   state.vertexDocumentData[state.originVertexId].languages.push(language);
        // },
        // disableLanguage (state, language) {
        //   //state.enabledLanguages.splice(state.enabledLanguages.indexOf(language), 1)
        //   state.vertexDocumentData[state.originVertexId].languages.splice(state.vertexDocumentData[state.originVertexId].languages.indexOf(language), 1);
        // },
        // setCurrentLanguage (state, language) {
        //   state.currentLanguage = language
        // },
        // rememberTraversedEdges (state, edgeIds) {
        //   this._vm.$set(state, 'traversedEdges', edgeIds)
        // },
        // rememberTraversedVertices (state, vertexIds) {
        //   this._vm.$set(state, 'traversedVertices', vertexIds)
        // },
        // resetTraversal (state) {
        //   this._vm.$set(state, 'traversedEdges', [])
        //   this._vm.$set(state, 'traversedVertices', [])
        // },
        truncate (state) {
          this._vm.$set(state, 'originVertexId', '')
          this._vm.$set(state, 'vertexDocumentIds', [])
          this._vm.$set(state, 'vertexDocumentData', {})
          this._vm.$set(state, 'edgeDocumentIds', [])
          this._vm.$set(state, 'edgeDocumentData', {})
          this._vm.$set(state, 'vertexLifecycleData', {})
          //this._vm.$set(state, 'traversedEdges', [])
          //this._vm.$set(state, 'traversedVertices', [])
        }
      }
    })

    // Create the graph instance
    var vueGraph = new VueGraph(wanderer, Vue, store)

    // Push it to Wanderer
    wanderer.provide('vueGraph', vueGraph)

    // Push wanderer to vue
    Vue.prototype.$wanderer = wanderer

    // Push it to vue
    Vue.prototype.$vueGraph = vueGraph



  }

}
