
export default {
  install (wanderer) {

    // Grap some dependencys
    var broadcast = wanderer.require('broadcast')

    // Subscribe to the broadcast
    var subscriber = broadcast.subscribe('action-plugin')

    var currentSwitchedLanguage = ''

    // Add collection props
    subscriber.emit('addVertexCollectionProps', {
      name: 'jump',
      props: {
        graph: {
          action: function (vertex) {
            if(!vertex.data.isEmpty('url')) {
              wanderer.loadFromUrl(vertex.data.get('url'))
            }
          }
        }
      }
    })

    // Add collection props
    subscriber.emit('addVertexCollectionProps', {
      name: 'import',
      props: {
        graph: {
          edgeConditions: {
            imported: (vertex) => {
              if(vertex.lifecycle.is('imported')) {
                return true
              }
              return false
            }
          },
          action: async function (vertex) {

            // If this data was not imported before...
            if(!vertex.lifecycle.is('imported')) {

              if(!vertex.data.isEmpty('url')) {

                // Request the data
                let data = await wanderer.fetchFromUrl(vertex.data.get('url'))

                // Find the origin of the imported data
                let targetVertexId = false

                // For each vertex
                for (let key in data.vertices) {
                  // Mark the data as foreign data
                  data.vertices[key]['_foreign'] = true
                  // Adjust the position
                  data.vertices[key]['_x'] = data.vertices[key]['_x'] + vertex.data.get('_x')
                  data.vertices[key]['_y'] = data.vertices[key]['_y'] + vertex.data.get('_y')
                  // Find the origin of the imported data
                  if(data.vertices[key]['_origin'] !== undefined && data.vertices[key]['_origin']) {
                    targetVertexId = data.vertices[key]['_id']
                  }
                }

                // For each edge
                for (let key in data.edges) {
                  // Mark the data as foreign data
                  data.edges[key]['_foreign'] = true
                }

                // Load the new data
                wanderer.loadFromData(data)

                // Override the target with the given vertex ID
                if(!vertex.data.isEmpty('vertexId')) {
                  targetVertexId = vertex.data.get('vertexId')
                }

                // Connect the imported data to the flow
                if(targetVertexId) {
                  wanderer.subscriber.emit('addEdgeFromData', {
                    '_id': wanderer.getRandomId(),
                    '_collection': 'imports',
                    '_from': vertex.data.get('_id'),
                    '_to': targetVertexId,
                    '_foreign': true
                  })
                }

                // Remember this data as imported
                vertex.setLifecycleValue('imported', true)

              }

            }

          }
        }
      }
    })

    // Add collection props
    subscriber.emit('addVertexCollectionProps', {
      name: 'language',
      props: {
        graph: {
          activator: function (vertex) {
            vertex.setLifecycleValue('switched', false)
          },
          edgeConditions: {
            switched: (vertex) => {
              if(vertex.lifecycle.is('switched')) {
                return true
              }
              return false
            }
          },
          action: function (vertex) {
            // Switch the language
            if(!vertex.lifecycle.is('switched')) {
              // Don't switch the language if its the same as before
              if(currentSwitchedLanguage != vertex.data.get('switchToLanguage')) {
                subscriber.emit('setLanguage', vertex.data.get('switchToLanguage'))
                currentSwitchedLanguage = vertex.data.get('switchToLanguage')
                vertex.setLifecycleValue('switched', true)
              }
            }
          }
        }
      }
    })

    // Add collection props
    subscriber.emit('addVertexCollectionProps', {
      name: 'reset',
      props: {
        graph: {
          action: function (vertex, traversal) {
            subscriber.emit('resetLifecycle')
          }
        }
      }
    })

  } // Install
}
