
export default {
  install (wanderer) {

    // Grap some dependencys
    var thread = wanderer.require('thread')
    var broadcast = wanderer.require('broadcast')

    // Subscribe to the broadcast
    var subscriber = broadcast.subscribe('action-plugin')

    var currentSwitchedLanguage = ''

    // Add collection props
    subscriber.emit('addVertexCollectionProps', {
      name: 'jump',
      props: {
        graph: {
          visitor: function (vertex, traversal) {
            if(!vertex.data.isEmpty('url')) {
              // if(!vertex.lifecycle.is('requesting')) {
              //   vertex.lifecycle.set('requesting', true)
                wanderer.loadFromUrl(vertex.data.get('url'))
              // }
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
          visitor: function (vertex) {

            // If this data was not imported before...
            if(!vertex.lifecycle.is('imported')) {

              if(!vertex.data.isEmpty('url')) {

                // WandererSingleton.importJsonRemote(vertexData.url, cytoscapeVertex.id())

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
          becomeReachable: function (vertex) {
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
          visitor: function (vertex) {
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
          visitor: function (vertex) {
            subscriber.emit('truncate')
          }
        }
      }
    })

  } // Install
}
