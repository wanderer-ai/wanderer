

export default {
  install (wanderer) {

    var thread = wanderer.require('thread')
    var broadcast = wanderer.require('broadcast')

    var subscriber = broadcast.subscribe('base-plugin')

    // Define a few traversal variables
    var typingTimeout = false

    function truncate () {

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
            },
            notSent: function (vertex) {
              if(vertex.lifecycle.is('sent')) {
                return false
              }
              return true
            }
          },
          activator: function (vertex) {
            // Am I forgetful?
            if(vertex.data.is('forgetful')) {
              // Ok. Please reset my lifecycle data
              vertex.setLifecycleValue('sent', false)
            }
          },
          action: function (vertex) {

            // If this message was not send before
            if(!vertex.lifecycle.is('sent')) {

              // If no other message is typing
              if(!typingTimeout) {

                // Send a typing signal to the chat
                thread.postMessage({
                  'event': 'sendChatTyping',
                  'payload': 2000
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
                  clearTimeout(typingTimeout)
                  typingTimeout = false

                }, 2000)

              }
            }

          } // action
        }
      }
    })

    wanderer.subscriber.emit('addEdgeCollectionProps', {
      name: 'leadsTo',
      props: {
        graph: {

        }
      }
    })


  } // Install
}
