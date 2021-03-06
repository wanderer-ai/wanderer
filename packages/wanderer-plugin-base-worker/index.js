import jexl from 'jexl'

jexl.addTransform('Number', (val) => Number(val))
jexl.addTransform('isNaN', (val) => isNaN(val))

export default {
  install (wanderer) {

    var thread = wanderer.require('thread')
    var broadcast = wanderer.require('broadcast')

    var subscriber = broadcast.subscribe('base-plugin')

    // Define a few traversal variables
    var typingTimeout = false

    // The timer timeouts
    var timerTimeouts = {}

    function truncate () {

      // Clear the message typing timeout
      clearTimeout(typingTimeout)

      // Clear all timer timeouts
      for(var [key, value] of Object.entries(timerTimeouts)) {
        clearTimeout(timerTimeouts[value])
      }

      timerTimeouts = {}

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
                      vertexId: vertex.data.get('_id'),
                      // Send a copy of the vertex lifecycle data to the message because this should be immutable now
                      payload: {
                        lifecycleData: vertex.lifecycle.plain()
                      }
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

    // Add conclusion collection props
    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'conclusion',
      props: {
        graph: {
          edgeConditions: {
            isTrue: function (vertex) {
              if(vertex.lifecycle.get('result') === true) {
                return true
              }
              return false
            },
            isFalse: function (vertex) {
              if(vertex.lifecycle.get('result') === false) {
                return true
              }
              return false
            },
            isEmpty: function (vertex) {
              if(!vertex.lifecycle.get('result')) {
                return true
              }
              return false
            },
            isNumber: function (vertex) {
              if(isNaN(vertex.lifecycle.get('result'))) {
                return false
              }
              return true
            },
            isNaN: function (vertex) {
              if(isNaN(vertex.lifecycle.get('result'))) {
                return true
              }
              return false
            },
          },
          activator: function (vertex) {

          },
          action: function (vertex) {

            if(vertex.data.has('expression')) {

              let expression = vertex.data.get('expression')
              let context = vertex.lifecycle.plain()

              try {
                // Warning! Do not use async version of jexl in here!
                // We need this value imediatelly for the edge conditions because the value should be already there on the active state
                // Otherwise the isNumber condition for example will return wrong results
                const result = jexl.evalSync(expression, context)
                vertex.setLifecycleValue('result', result)
              } catch (e) {

              }

            } else {
              vertex.setLifecycleValue('result', null)
            }

          }
        }
      }
    })

    // Add conclusion collection props
    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'timer',
      props: {
        graph: {
          edgeConditions: {
            expired: function (vertex) {
              if(vertex.lifecycle.get('expired') === true) {
                return true
              }
              return false
            }
          },
          activator: function (vertex) {
            // Am I forgetful?
            if(vertex.data.is('forgetful')) {

              // If the timer is running
              if(timerTimeouts[vertex.data.get('_id')] !== undefined) {
                // Stop the timer
                clearTimeout(timerTimeouts[vertex.data.get('_id')])
                delete timerTimeouts[vertex.data.get('_id')]
              }

              // Ok. Please reset my lifecycle data
              vertex.setLifecycleValue('expired', false)
            }
          },
          action: function (vertex) {

            if(vertex.data.has('seconds')) {

              // If the timer is not running
              if(!timerTimeouts[vertex.data.get('_id')]) {

                // Init and store the timer
                timerTimeouts[vertex.data.get('_id')] = setTimeout(() => {

                  // The timer has expired
                  vertex.setLifecycleValue('expired', true)

                }, vertex.data.get('seconds'))

              }

            }

          }
        }
      }
    })

    // The leads to edge
    wanderer.subscriber.emit('addEdgeCollectionProps', {
      name: 'leadsTo',
      props: {
        graph: {

        }
      }
    })

    subscriber.on('truncate', function() {
      truncate()
    })

    subscriber.on('resetLifecycle', function() {
      truncate()
    })

  } // Install
}
