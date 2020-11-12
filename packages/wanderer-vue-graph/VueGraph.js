
export default class VueGraph {

  constructor (wanderer, vue, store) {

    // Inject a few required classes
    this.wanderer = wanderer
    this.vue = vue
    this.store = store

    // Register a broadcast subscriber
    // So we can keep our vue graph in sync with cytoscape and the traverser
    this.subscriber = this.wanderer.broadcast.subscribe('vueGraph')

    // Truncate
    this.subscriber.on('truncate', (vertexData) => {
      this.store.commit('wandererGraph/truncate')
    })

    // Listen for new vertices
    this.subscriber.on('addVertex', (vertexData) => {
      this.store.commit('wandererGraph/addVertex', vertexData)
      if(vertexData._origin !== undefined && vertexData._origin) {
        this.store.commit('wandererGraph/setOriginVertex', vertexData._id)
      }
    })

    // Listen for new edges
    this.subscriber.on('addEdge', (edgeData) => {
      this.store.commit('wandererGraph/addEdge', edgeData)
    })

    // Listen for vertex deletions
    this.subscriber.on('removeVertex', (vertexId) => {
      this.store.commit('wandererGraph/removeVertex', vertexId)
    })

    // Listen for edge deletions
    this.subscriber.on('removeEdge', (edgeId) => {
      this.store.commit('wandererGraph/removeEdge', edgeId)
    })

    // Listen for vertex data changes
    this.subscriber.on('setVertexDataValue', ({id, key, value, language}) => {
      this.store.commit('wandererGraph/setVertexDataValue', {
        id: id,
        key: key,
        value: value,
        language: language
      })
    })

    // Listen for edge data changes
    this.subscriber.on('setEdgeDataValue', ({id, key, value, language}) => {
      this.store.commit('wandererGraph/setEdgeDataValue', {
        id: id,
        key: key,
        value: value,
        language: language
      })
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
    subscriber.removeVertex(vertexId)
  }

  removeEdge (edgeId) {
    this.store.commit('wandererGraph/removeEdge', edgeId)
    subscriber.removeEdge(edgeId)
  }

  getAllVertexData () {
    return this.store.state.wandererGraph.vertexDocumentData
  }

  getAllEdgeData () {
    return this.store.state.wandererGraph.vertexDocumentData
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
            return this.store.state.wandererGraph.vertexDocumentData[id][key][language]
          }
        }
      }
    }
    return undefined
  }

  setVertexDataValue (id, key, value, language) {
    if(value !== undefined) {
      this.store.commit('wandererGraph/setVertexDataValue', {
        id: id,
        key: key,
        value: value,
        language: language
      })
      this.subscriber.setVertexDataValue({
        id: id,
        key: key,
        value: value,
        language: language
      })
    }
  }

  getEdgeDataValue (id, key) {
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
      this.subscriber.setEdgeDataValue({
        id: id,
        key: key,
        value: value,
        language: language
      })
    }
  }

  // getVertexDataValueModel (vertexId, key, language) {
  //   var graph = this
  //   return {
  //     get() {
  //       if(graph.store.state.wandererGraph.vertexDocumentData[vertexId] !== undefined) {
  //         if(language !== undefined) {
  //           if(graph.store.state.wandererGraph.vertexDocumentData[vertexId][key] !== undefined) {
  //             return graph.store.state.wandererGraph.vertexDocumentData[vertexId][key][language]
  //           }
  //         }
  //         return graph.store.state.wandererGraph.vertexDocumentData[vertexId][key]
  //       }
  //     },
  //     set(data) {
  //       if(data !== undefined) {
  //         graph.store.commit('wandererGraph/setVertexDataValue', {
  //           id: vertexId,
  //           key: key,
  //           value: data,
  //           language: language
  //         })
  //         graph.subscriber.setVertexDataValue({
  //           id: vertexId,
  //           key: key,
  //           value: data,
  //           language: language
  //         })
  //       }
  //     }
  //   }
  // }
  //
  // getEdgeDataValueModel (edgeId, key, language) {
  //   var graph = this
  //   return {
  //     get() {
  //       if(graph.store.state.wandererGraph.edgeDocumentData[edgeId] !== undefined) {
  //         if(language !== undefined) {
  //           if(graph.store.state.wandererGraph.edgeDocumentData[edgeId][key] !== undefined) {
  //             return graph.store.state.wandererGraph.edgeDocumentData[edgeId][key][language]
  //           }
  //         }
  //         return graph.store.state.wandererGraph.edgeDocumentData[edgeId][key]
  //       }
  //     },
  //     set(data) {
  //       if(data !== undefined) {
  //         graph.store.commit('wandererGraph/setEdgeDataValue', {
  //           id: edgeId,
  //           key: key,
  //           value: data,
  //           language: language
  //         })
  //         graph.subscriber.setEdgeDataValue({
  //           id: edgeId,
  //           key: key,
  //           value: data,
  //           language: language
  //         })
  //       }
  //     }
  //   }
  // }

  // getVertexModel (key) {
  //   return {
  //     get() {
  //       if(this.store.state.wanderer.builder.editVertex) {
  //         if(this.store.state.wanderer.vertexDocumentData[this.store.state.wanderer.builder.editVertex] !== undefined) {
  //           return this.store.state.wanderer.vertexDocumentData[this.store.state.wanderer.builder.editVertex][key]
  //         }
  //       }
  //     },
  //     set(data) {
  //       if(data != undefined) {
  //         StoreSingleton.store.commit('wanderer/setVertexDataValue', {
  //           id: StoreSingleton.store.state.wanderer.builder.editVertex,
  //           key: key,
  //           value: data
  //         })
  //       }
  //     }
  //   }
  // }
  //
  // getTranslatableVertexModel(key) {
  //   return {
  //     get(){
  //       if(StoreSingleton.store.state.wanderer.builder.editVertex){
  //         if(StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex] !== undefined){
  //           if(StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex][key] !== undefined){
  //             return StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex][key][StoreSingleton.store.state.wanderer.currentLanguage]
  //           }
  //         }
  //       }
  //     },
  //     set(data){
  //       if(data != undefined){
  //         StoreSingleton.store.commit('wanderer/setVertexDataValue', {
  //           id: StoreSingleton.store.state.wanderer.builder.editVertex,
  //           key: key,
  //           value: data,
  //           language: StoreSingleton.store.state.wanderer.currentLanguage
  //         })
  //       }
  //     }
  //   }
  // }
  //
  // getEdgeModel(key) {
  //   return {
  //     get(){
  //       if(StoreSingleton.store.state.wanderer.builder.editEdge){
  //         if(StoreSingleton.store.state.wanderer.edgeDocumentData[StoreSingleton.store.state.wanderer.builder.editEdge] !== undefined){
  //           return StoreSingleton.store.state.wanderer.edgeDocumentData[StoreSingleton.store.state.wanderer.builder.editEdge][key]
  //         }
  //       }
  //     },
  //     set(data){
  //       if(data != undefined){
  //         StoreSingleton.store.commit('wanderer/setEdgeDataValue', {
  //           id: StoreSingleton.store.state.wanderer.builder.editEdge,
  //           key: key,
  //           value: data
  //         })
  //       }
  //     }
  //   }
  // }


}
