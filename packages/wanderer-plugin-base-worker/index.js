
    //   // testVisitor: function (cytoscapeEdge, edgeData, language) {
    //   //   // Just remember this edges
    //   //   if (edgeData.type == 'and') {
    //   //     traversedRequiredEdgeIds.push(cytoscapeEdge.id())
    //   //   }
    //   //   // Use the testVisitor to get a List of all the NOT edges
    //   //   if (edgeData.type == 'not') {
    //   //     traversedForbiddenEdgeIds.push(cytoscapeEdge.id())
    //   //   }
    //   // },
    //   visitor: function (cytoscapeEdge, edgeData, language) {
    //     // Just remember this edges
    //     if (edgeData.type == 'and') {
    //       traversedRequiredEdgeIds.push(cytoscapeEdge.id())
    //     }
    //     // Use the visitor to get a List of all the NOT edges
    //     if (edgeData.type == 'not') {
    //       traversedForbiddenEdgeIds.push(cytoscapeEdge.id())
    //     }
    //   },
    //   allowTraversal: function (cytoscapeVertex, vertexData, cytoscapeEdge, edgeData, language) {
    //     // Is there a compareVariable available in this data?
    //     if (edgeData.condition) {
    //
    //       let vertexLifecycleData = WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()]
    //
    //       // if(edgeData.condition=='custom') {
    //       //
    //       //   // Check custom conditions
    //       //
    //       //   if (edgeData.compareVariable) {
    //       //     // Get the lifecycle data of the source node
    //       //     if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()] != undefined){
    //       //
    //       //       var variable = vertexLifecycleData[edgeData.compareVariable]
    //       //       var value = edgeData.compareValue
    //       //
    //       //       // Convert strings to int if necessary
    //       //       // So the end user has not to deal with types like strings and int
    //       //       if(parseInt(variable)){
    //       //         variable = parseInt(variable)
    //       //       }
    //       //       if(parseInt(value)){
    //       //         value = parseInt(value)
    //       //       }
    //       //
    //       //       if(edgeData.compareCondition == '==') {
    //       //         if(variable == value) {
    //       //           return true
    //       //         }
    //       //       }
    //       //       if(edgeData.compareCondition == '!=') {
    //       //         if(variable != value) {
    //       //           return true
    //       //         }
    //       //       }
    //       //       if(edgeData.compareCondition == '<=') {
    //       //         if(variable <= value) {
    //       //           return true
    //       //         }
    //       //       }
    //       //       if(edgeData.compareCondition == '>=') {
    //       //         if(variable >= value) {
    //       //           return true
    //       //         }
    //       //       }
    //       //       if(edgeData.compareCondition == '<') {
    //       //         if(variable < value) {
    //       //           return true
    //       //         }
    //       //       }
    //       //       if(edgeData.compareCondition == '>') {
    //       //         if(variable > value) {
    //       //           return true
    //       //         }
    //       //       }
    //       //     }
    //       //     return false
    //       //   }
    //       // } else {
    //
    //         // Check predefined condition
    //         // Todo: Move this to the Wanderer core
    //         // This method is similar to the one specified in wanderer-plugin-question
    //         let sourceNodeCollection = WandererSingleton.getVertexCollection(vertexData._collection)
    //         if(sourceNodeCollection.edgeConditions !== undefined) {
    //           if(sourceNodeCollection.edgeConditions[edgeData.condition] !== undefined) {
    //             return sourceNodeCollection.edgeConditions[edgeData.condition].condition(vertexLifecycleData)
    //           }
    //         }
    //       // }
    //     }
    //
    //     return true
    //   },
    //   allowTargetTraversal: function (cytoscapeVertex, vertexData, cytoscapeEdge, edgeData, language) {
    //     if (edgeData.type == 'and') {
    //       // Have I already visited this required edge?
    //       if (traversedRequiredEdgeIds.indexOf(cytoscapeEdge.id()) === -1) {
    //         return false
    //       }
    //     }
    //     if (edgeData.type == 'not') {
    //       // Have I not visited this forbidden edge before?
    //       if (traversedForbiddenEdgeIds.indexOf(cytoscapeEdge.id()) !== -1) {
    //         return false
    //       }
    //       // Have I not visited this forbidden edges one cycle before?
    //       // So I can check if there was an forbidden edge to a node after I have visited this node
    //       if (lastTraversedForbiddenEdgeIds.indexOf(cytoscapeEdge.id()) !== -1) {
    //         return false
    //       }
    //     }
    //     return true
    //   }
    // })




export default {
  install (wanderer) {

    var thread = wanderer.require('thread')

    // Define a few traversal variables
    // var traversedRequiredEdgeIds = []
    // var traversedForbiddenEdgeIds = []
    // var lastTraversedForbiddenEdgeIds = []
    // var typingTimeouts = {}

    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'message',
      props: {
        graph: {
          // edgeConditions: {
          //   sent: {
          //     default: true,
          //     label: 'sent',
          //     condition: function (vertexLifecycleData) {
          //       if(vertexLifecycleData!=undefined && vertexLifecycleData.sent) {
          //         return true;
          //       }
          //       return false;
          //     }
          //   }
          // },
          // becomeReachable: function (cytoscapeVertex, vertexData) {
          //   WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', false)
          // },
          visitor: function (vertex) {

            thread.postMessage({
              'event': 'sendChatMessage',
              'payload': vertex.data.get('_id')
            })

            // If this message was not send before
            // if(!WandererSingleton.getLifecycleValue(cytoscapeVertex.id(), 'sent')) {
            //
            //   // if this message is currently not typing
            //   if(typingTimeouts[cytoscapeVertex.id()] === undefined) {
            //
            //     // Send a typing signal to the chat
            //     WandererStoreSingleton.store.dispatch('wanderer/chat/setTyping', 1000)
            //
            //     // Now send the message after a while
            //     // And set the timeout
            //     typingTimeouts[cytoscapeVertex.id()] = setTimeout(()=>{
            //
            //       // Get the message text
            //       var text = WandererSingleton.markdown2html(WandererSingleton.evaluateVertexTemplate(WandererSingleton.getTranslatableVertexValue(cytoscapeVertex.id(), 'message'), cytoscapeVertex.id()))
            //
            //       // Push the message to the chat
            //       WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
            //         component: 'wanderer-message',
            //         backgroundColor: '#6C757D',
            //         vertexId: cytoscapeVertex.id(),
            //         text: text
            //       })
            //
            //       // Remember the message now as sent
            //       WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', true)
            //
            //       // Remove the message from the typing object
            //       delete typingTimeouts[cytoscapeVertex.id()]
            //
            //     }, 1000)
            //
            //   }
            //
            // }

          }
        }
      }
    })
  }
}

//export default {


    // WandererSingleton.on('traversalStart', function() {
    //   // Reset the edge information
    //   traversedRequiredEdgeIds = []
    //   traversedForbiddenEdgeIds = []
    // })
    //
    // WandererSingleton.on('traversalFinished', function() {
    //
    //   // Remember the forbidden Edges for one more cycle
    //   lastTraversedForbiddenEdgeIds = [...traversedForbiddenEdgeIds]
    //
    //
    // })
    //
    // WandererSingleton.on('truncate', function() {
    //
    //   // Reset the edge information
    //   traversedRequiredEdgeIds = []
    //   traversedForbiddenEdgeIds = []
    //   lastTraversedForbiddenEdgeIds = []
    //
    //   // Clear all timeouts
    //   for (let i in typingTimeouts) {
    //     if(typingTimeouts.hasOwnProperty(i)) {
    //       clearTimeout(typingTimeouts[i]);
    //       delete typingTimeouts[i]
    //     }
    //   }
    //
    // })

  //}

//}
