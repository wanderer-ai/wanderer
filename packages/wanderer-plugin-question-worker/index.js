

export default {
  install (wanderer) {

    // Grap some dependencys
    var thread = wanderer.require('thread')
    var broadcast = wanderer.require('broadcast')

    // Subscribe to the broadcast
    var subscriber = broadcast.subscribe('question-plugin')

    // Define some variables for collecting some data while traversing
    var openQuestions = {}
    var traversedQuestions = []

    // Add collection props
    subscriber.emit('addVertexCollectionProps', {
      name: 'question',
      props: {
        graph: {
          edgeConditions: {
            answered:  function (vertex) {
              if(vertex.lifecycle.is('answered')) {
                return true
              }
              return false
            },
            notAnswered: function (vertex) {
              if(!vertex.lifecycle.is('answered')) {
                return true
              }
              return false
            }
          },
          becomeReachable: function (vertex) {

            // Reset the lifecycle data
            vertex.lifecycle.set('answered', false)

            // Reset all suggestions
            vertex.outboundEdges.each((edge) => {
              var target = edge.targetVertex
              if(target.data.get('_collection') == 'suggestion') {
                target.lifecycle.set('answered', false)
              }
            })

          },
          visitor: function (vertex) {
            if(!vertex.lifecycle.is('answered')) {
              openQuestions[vertex.data.get('_id')] = []
            }
            traversedQuestions.push(vertex.data.get('_id'))
          },
          expander: function (vertex, traversal) {

            var returnOutboundEdges = vertex.getOutboundEdges()

            // For each outbound edge
            returnOutboundEdges.each((edge) => {
              // If this is a isAnswerableBy edge
              if(edge.data.get('_collection') == 'isAnswerableBy') {

                var suggestionVertex = edge.targetVertex
                if (traversal.isVertexTraversable(suggestionVertex)) {

                  // For each outbound child edge
                  var suggestionVertexOutboundEdges = suggestionVertex.getOutboundEdges()
                  suggestionVertexOutboundEdges.each((childEdge) => {
                    if(traversal.isEdgeTraversable(childEdge, suggestionVertex)) {
                      returnOutboundEdges.add(childEdge)
                    }
                  })

                  // Add this suggestion to question result
                  if(openQuestions[vertex.data.get('_id')]) {
                    openQuestions[vertex.data.get('_id')].push(suggestionVertex.data.get('_id'))
                  }

                }

              }
            })

            return returnOutboundEdges

          },
        }
      }
    })

    // Add collection props
    subscriber.emit('addVertexCollectionProps', {
      name: 'suggestion',
      props: {
        graph: {
          edgeConditions: {
            answered:  function (vertex) {
              if(vertex.lifecycle.is('answered')) {
                return true
              }
              return false
            },
            notAnswered: function (vertex) {
              if(!vertex.lifecycle.is('answered')) {
                return true
              }
              return false
            }
          },
          becomeReachable: function (vertex) {
            vertex.lifecycle.set('answered', false)
          },
          visitor: function (vertex) {

          },
          expander: function (vertex) {
            // Never expand your edges since the question vertex will do this within its own expander
            return false
          }
        }
      }
    })

    // Listen for local events
    subscriber.on('traversalStarted', function() {

    })

    subscriber.on('traversalFinished', function() {

      thread.postMessage({
        'event': 'sendOpenQuestions',
        'payload': openQuestions
      })

      thread.postMessage({
        'event': 'sendTraversedQuestions',
        'payload': traversedQuestions
      })

      openQuestions = {}
      traversedQuestions = []

    })

    subscriber.on('truncate', function() {
      openQuestions = {}
      traversedQuestions = []
    })

    // // Listen for thread events
    // thread.addEventListener('message', function(e) {
    //   switch(e.data.event) {
    //     case 'truncate':
    //
    //
    //
    //       break;
    //   }
    // }, false)

  } // Install
}
