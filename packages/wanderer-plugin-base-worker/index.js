

export default {
  install (wanderer) {

    var thread = wanderer.require('thread')
    var broadcast = wanderer.require('broadcast')

    var subscriber = broadcast.subscribe('base-plugin')

    // Define a few traversal variables
    var traversedRequiredEdgeIds = []
    var traversedForbiddenEdgeIds = []
    var lastTraversedForbiddenEdgeIds = []
    var typingTimeout = false

    function truncate () {
      // Reset the edge information
      traversedRequiredEdgeIds = []
      traversedForbiddenEdgeIds = []
      lastTraversedForbiddenEdgeIds = []

      clearTimeout(typingTimeout)
    }

    // Add message collection props
    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'message',
      props: {
        graph: {
          edgeConditions: {
          sent: function (vertex) {
              if(vertex.lifecycle.is('sent')) {
                return true
              }
              return false
            }
          },
          becomeReachable: function (vertex) {
            // Am I forgetful?
            if(vertex.data.is('forgetful')) {
              // Ok. Please reset my lifecycle data
              vertex.setLifecycleValue('sent', false)
            }
          },
          visitor: function (vertex) {

            // If this message was not send before
            if(!vertex.lifecycle.is('sent')) {

              // If no other message is typing
              if(!typingTimeout) {

                // Send a typing signal to the chat
                thread.postMessage({
                  'event': 'sendChatTyping',
                  'payload': 1000
                })

                // Now send the message after a while
                // And set the timeout
                typingTimeout = setTimeout(() => {

                  thread.postMessage({
                    'event': 'sendChatMessage',
                    'payload': {
                      vertexId: vertex.data.get('_id')
                    }
                  })

                  // Remember the message now as sent
                  vertex.setLifecycleValue('sent', true)

                  // Free the traversal for other messages
                  typingTimeout = false

                }, 1000)

              }
            }

          } // Visitor
        }
      }
    })

    wanderer.subscriber.emit('addEdgeCollectionProps', {
      name: 'leadsTo',
      props: {
        graph: {
            // testVisitor: function (cytoscapeEdge, edgeData, language) {
            //   // Just remember this edges
            //   if (edgeData.type == 'and') {
            //     traversedRequiredEdgeIds.push(cytoscapeEdge.id())
            //   }
            //   // Use the testVisitor to get a List of all the NOT edges
            //   if (edgeData.type == 'not') {
            //     traversedForbiddenEdgeIds.push(cytoscapeEdge.id())
            //   }
            // },
            visitor: function (edge) {
              // Just remember this edges
              if (edge.data.get('type') == 'and') {
                traversedRequiredEdgeIds.push(edge.data.get('_id'))
              }
              // Use the visitor to get a List of all the NOT edges
              if (edge.data.get('type') == 'not') {
                traversedForbiddenEdgeIds.push(edge.data.get('_id'))
              }

              // Get the source expose data and copy it to the target lifecycle
              edge.data.with('expose', (exposeKey) => {
                if(edge.sourceVertex.lifecycle.has(exposeKey)) {

                  // Get the expose value
                  let exposeValue = edge.sourceVertex.lifecycle.get(exposeKey)

                  // Set alias
                  if(!edge.data.isEmpty('name')) {
                    exposeKey = edge.data.get('name')
                  }

                  // Set target lifecycle value
                  edge.targetVertex.setLifecycleValue(exposeKey, exposeValue)
                }
              })

            },
            allowTraversal: function (edge, vertex) {

              var allow = true

              // Is there a compareVariable available in this data?
              if (edge.data.has('condition')) {

                // if(edgeData.condition=='custom') {
                //
                //   // Check custom conditions
                //
                //   if (edgeData.compareVariable) {
                //     // Get the lifecycle data of the source node
                //     if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()] != undefined){
                //
                //       var variable = vertexLifecycleData[edgeData.compareVariable]
                //       var value = edgeData.compareValue
                //
                //       // Convert strings to int if necessary
                //       // So the end user has not to deal with types like strings and int
                //       if(parseInt(variable)){
                //         variable = parseInt(variable)
                //       }
                //       if(parseInt(value)){
                //         value = parseInt(value)
                //       }
                //
                //       if(edgeData.compareCondition == '==') {
                //         if(variable == value) {
                //           return true
                //         }
                //       }
                //       if(edgeData.compareCondition == '!=') {
                //         if(variable != value) {
                //           return true
                //         }
                //       }
                //       if(edgeData.compareCondition == '<=') {
                //         if(variable <= value) {
                //           return true
                //         }
                //       }
                //       if(edgeData.compareCondition == '>=') {
                //         if(variable >= value) {
                //           return true
                //         }
                //       }
                //       if(edgeData.compareCondition == '<') {
                //         if(variable < value) {
                //           return true
                //         }
                //       }
                //       if(edgeData.compareCondition == '>') {
                //         if(variable > value) {
                //           return true
                //         }
                //       }
                //     }
                //     return false
                //   }
                // } else {

                  // Check predefined condition
                  // Todo: Move this to the Wanderer core
                  // This method is similar to the one specified in wanderer-plugin-question
                  // Nach isEdgeTraversable. Das wäre ein guter Platz dafür
                  vertex.collection.with('edgeConditions.'+edge.data.get('condition'), (condition) => {
                    allow = condition(vertex)
                  })

                // }
              }

              return allow
            },
            allowTargetTraversal: function (vertex, edge) {
              if (edge.data.get('type') == 'and') {
                // Have I already visited this required edge?
                if (traversedRequiredEdgeIds.indexOf(edge.data.get('_id')) === -1) {
                  return false
                }
              }
              if (edge.data.get('type') == 'not') {

                // Have I not visited this forbidden edge before?
                if (traversedForbiddenEdgeIds.indexOf(edge.data.get('_id')) !== -1) {
                  return false
                }
                // Have I not visited this forbidden edges one cycle before?
                // So I can check if there was an forbidden edge to a node after I have visited this node
                if (lastTraversedForbiddenEdgeIds.indexOf(edge.data.get('_id')) !== -1) {
                  return false
                }
              }
              return true
            }
        }
      }
    })

    // Listen for local events
    subscriber.on('traversalStarted', function() {
      // Reset the edge information
      traversedRequiredEdgeIds = []
      traversedForbiddenEdgeIds = []
    })

    subscriber.on('traversalFinished', function() {
      // Remember the forbidden Edges for one more cycle
      lastTraversedForbiddenEdgeIds = [...traversedForbiddenEdgeIds]
    })

    subscriber.on('truncateLifecycle', function() {
      truncate()
    })

    subscriber.on('truncate', function() {
      truncate()
    })

    // Listen for thread events
    // thread.addEventListener('message', function(e) {
    //   switch(e.data.event) {
    //     case 'truncate':
    //       truncate()
    //       break;
    //   }
    // }, false)

  } // Install
}
