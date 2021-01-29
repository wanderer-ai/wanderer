
export default class VueGraph {

  constructor (wanderer, broadcast, vue, store) {

    // Inject a few required classes
    this.wanderer = wanderer
    this.broadcast = broadcast
    this.vue = vue
    this.store = store

    // Register a broadcast subscriber
    // So we can keep our vue graph in sync with cytoscape and other plugins
    this.subscriber = this.broadcast.subscribe('vueGraph')

    // Truncate
    this.subscriber.on('truncate', () => {
      this.store.commit('wandererGraph/truncate')
    })

    // ResetLifecycle
    this.subscriber.on('resetLifecycle', () => {

      // Clear lifecycle data
      this.store.commit('wandererGraph/cleanVertexLifecycleData')

    })

    // Listen for new vertices
    this.subscriber.on('addVertexFromData', (vertexData) => {
      this.store.commit('wandererGraph/addVertex', vertexData)
    })

    // Listen for new edges
    this.subscriber.on('addEdgeFromData', (edgeData) => {
      this.store.commit('wandererGraph/addEdge', edgeData)
    })

    // Listen for vertex deletions
    this.subscriber.on('removeVertexById', (vertexId) => {
      this.store.commit('wandererGraph/removeVertex', vertexId)
    })

    // Listen for edge deletions
    this.subscriber.on('removeEdgeById', (edgeId) => {
      this.store.commit('wandererGraph/removeEdge', edgeId)
    })

    // Listen for vertex data changes
    this.subscriber.on('setVertexDataValue', (data) => {
      this.store.commit('wandererGraph/setVertexDataValue', data)
    })

    // Listen for edge data changes
    this.subscriber.on('setEdgeDataValue', (data) => {
      this.store.commit('wandererGraph/setEdgeDataValue', data)
    })

    // Listen for vertex lifecycle changes
    this.subscriber.on('setVertexLifecycleValue', (data) => {
      this.store.commit('wandererGraph/setVertexLifecycleValue', data)
    })

    // Listen for traversed vertices
    this.subscriber.on('setTraversedVertices', (data) => {
      this.store.commit('wandererGraph/setTraversedVertices', data)
    })

    // Listen for traversed edges
    this.subscriber.on('setTraversedEdges', (data) => {
      this.store.commit('wandererGraph/setTraversedEdges', data)
    })

  }

  enableLanguage (language) {
    this.store.commit('wandererGraph/enableLanguage', language)
  }

  disableLanguage (language) {
    this.store.commit('wandererGraph/disableLanguage', language)
  }

  getOriginVertexId () {
    return this.store.state.wandererGraph.originVertexId
  }

  removeVertex (vertexId) {
    this.store.commit('wandererGraph/removeVertex', vertexId)
    this.subscriber.emit('removeVertex', vertexId)
  }

  removeEdge (edgeId) {
    this.store.commit('wandererGraph/removeEdge', edgeId)
    this.subscriber.emit('removeEdge', edgeId)
  }

  getAllVertexData () {
    return this.store.state.wandererGraph.vertexDocumentData
  }

  getAllEdgeData () {
    return this.store.state.wandererGraph.edgeDocumentData
  }

  getVertexDataById (id) {
    return this.store.state.wandererGraph.vertexDocumentData[id]
  }

  getEdgeDataById (id) {
    return this.store.state.wandererGraph.edgeDocumentData[id]
  }

  getOriginDataValue (key, language) {
    return this.getVertexDataValue(this.getOriginVertexId(), key, language)
  }

  getVertexDataValue (id, key, language) {
    if(this.store.state.wandererGraph.vertexDocumentData[id] !== undefined) {
      if(this.store.state.wandererGraph.vertexDocumentData[id][key] !== undefined) {
        if(language === undefined) {
          return this.store.state.wandererGraph.vertexDocumentData[id][key]
        } else {
          if(this.store.state.wandererGraph.vertexDocumentData[id][key][language] !== undefined) {
            // console.log(id, key, language, this.store.state.wandererGraph.vertexDocumentData[id][key][language])
            return this.store.state.wandererGraph.vertexDocumentData[id][key][language]
          }
        }
      }
    }
    return undefined
  }

  setVertexDataValue (id, key, value, language) {
    // console.log(id, key, value, language)
    if(value !== undefined) {
      this.store.commit('wandererGraph/setVertexDataValue', {
        id: id,
        key: key,
        value: value,
        language: language
      })
      this.subscriber.emit('setVertexDataValue', {
        id: id,
        key: key,
        value: value,
        language: language
      })
    }
  }

  getEdgeDataValue (id, key, language) {
    if(this.store.state.wandererGraph.edgeDocumentData[id] !== undefined) {
      if(this.store.state.wandererGraph.edgeDocumentData[id][key] !== undefined) {
        if(language === undefined) {
          return this.store.state.wandererGraph.edgeDocumentData[id][key]
        } else {
          if(this.store.state.wandererGraph.edgeDocumentData[id][key][language] !== undefined) {
            return this.store.state.wandererGraph.edgeDocumentData[id][key][language]
          }
        }
      }
    }
    return undefined
  }

  setEdgeDataValue (id, key, value, language) {
    if(value !== undefined) {
      this.store.commit('wandererGraph/setEdgeDataValue', {
        id: id,
        key: key,
        value: value,
        language: language
      })
      this.subscriber.emit('setEdgeDataValue', {
        id: id,
        key: key,
        value: value,
        language: language
      })
    }
  }

  // Sometimes we need the plain data from vue instead of the reactive version
  // Than we have to convert it first
  vueDataToPlain (vueData) {
    var returnData = {}
    for (const [key, value] of Object.entries(vueData)) {
      if(typeof vueData[key] === 'object' && vueData[key] !== null) {
        returnData[key] = this.vueDataToPlain(value.data)
      } else {
        returnData[key] = value
      }
    }
    return returnData
  }

  // Return the whole data as plain
  getPlainVertexLifecycleValuesById (id) {
    return this.vueDataToPlain(this.store.state.wandererGraph.vertexLifecycleData[id])
  }

  getVertexLifecycleValue (id, key) {
    if(this.store.state.wandererGraph.vertexLifecycleData[id] !== undefined) {
      if(this.store.state.wandererGraph.vertexLifecycleData[id][key] !== undefined) {
        return this.store.state.wandererGraph.vertexLifecycleData[id][key]
      }
    }
    return undefined
  }

  setVertexLifecycleValue (id, key, value) {
    if(value !== undefined) {
      this.store.commit('wandererGraph/setVertexLifecycleValue', {
        id: id,
        key: key,
        value: value
      })
      this.subscriber.emit('setVertexLifecycleValue', {
        id: id,
        key: key,
        value: value
      })
    }
  }

}
