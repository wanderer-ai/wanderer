import FlowEditor from './components/FlowEditor.vue'
import MessageEditor from './components/MessageEditor.vue'
import LeadsToEditor from './components/LeadsToEditor.vue'
import Message from './components/Message.vue'

var client = {
  install (wanderer) {

    // Require some dependencys from wanderer
    var Vue = wanderer.require('vue')
    var builder = wanderer.require('builder')

    // Register some vue components
    Vue.component('wanderer-flow-editor', FlowEditor)
    Vue.component('wanderer-leads-to-editor', LeadsToEditor)
    Vue.component('wanderer-message-editor', MessageEditor)
    Vue.component('wanderer-message', Message)

    // Set debug mode for this plugin
    var debug = false

    // Register some vertices for the builder
    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'flow',
      props: {
        builder: {
          label: 'Flow',
          color: '#FEC106',
          cytoscapeClasses: 'flow',
          cytoscapeCxtMenuSelector: '.flow',
          creatable: false,
          defaultFields: {
            name: 'flow'
          },
          cytoscapeStyles: [{
            selector: '.flow',
            style: {
              'height': '200px',
              'width': '200px',
              'font-size': '30px',
              'background-color': '#FEC106',
              'border-color': '#FEC106',
              'border-width': '5px',
              'label': 'data(label)'
            }
          }],
          component: 'wanderer-flow-editor',
          toCytoscape: function(vertexData, language) {
            if(vertexData.has('topic.'+language)) {
              return {
                label: vertexData.get('topic.'+language)+(debug?' '+vertexData.get('_id'):'')
              }
            }
            return {
              label: 'Topic'+(debug?' '+vertexData.get('_id'):'')
            }
          }
        }
      }
    })

    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'message',
      props: {
        builder: {
          label: 'Message',
          color: '#007BFF',
          cytoscapeClasses: 'message',
          cytoscapeCxtMenuSelector: '.message',
          creatable: true,
          appendableViaCxtMenu: true,
          injectableViaCxtMenu: true,
          ctxMenuAllowedEdge: 'leadsTo',
          defaultFields: {
            message: {
              en: 'New message',
              de: 'Neue Nachricht'
            }
          },
          cytoscapeStyles: [{
            selector: '.message',
            style: {
              // 'shape': 'round-rectangle',
              'height': '50px',
              'width': '50px',
              'font-size': '20px',
              'background-color': '#007BFF',
              'border-color': '#007BFF',
              'border-width': '5px',
              'label': 'data(label)'
            }
          }],
          component: 'wanderer-message-editor',
          toCytoscape: function(vertexData, language) {
            if(vertexData.has('message.'+language)){
              return {
                label: vertexData.get('message.'+language)+(debug?' '+vertexData.get('_id'):'')
              }
            }
            return {
              label: 'Message'+(debug?' '+vertexData.get('_id'):'')
            }
          },
          lifecycleData: {
            sent: {
              label: 'sent',
              exposeDefault: false
            }
          }
        }
      }
    })

    wanderer.subscriber.emit('addEdgeCollectionProps', {
      name: 'leadsTo',
      props: {
        builder: {
          label: 'leads to',
          cytoscapeClasses: 'leadsTo',
          creatable: true,
          defaultFields: function (fromVertexCollection, toVertexCollection) {

            var defaultData = {
              type: 'or',
              priority: 10,
              name: '',
              expose: '',
              method: false,
              condition: false
            }

            // // Check the source node collection for default edge conditions
            // var defaultCondition = WandererSingleton.getVertexCollectionDefaultEdgeCondition(fromVertexCollection.name)
            // if(defaultCondition) {
            //   defaultData.condition = defaultCondition
            // }
            //
            // // Check the source node for default expose data fields
            // var defaultExposeData = WandererSingleton.getVertexCollectionDefaultExposeField(fromVertexCollection.name)
            // if(defaultExposeData) {
            //   defaultData.expose = defaultExposeData
            // }

            return defaultData
          },
          cytoscapeStyles: [{
            selector: '.leadsTo',
            style: {
              'line-color': '#6C757D',
              'target-arrow-color': '#6C757D',
              'source-arrow-color': '#6C757D',
              'width': 'data(priority)',
              'label': 'data(label)',
              'line-style': 'data(line)'
            }
          },{
            selector: '.leadsTo[type = "and"]',
            style: {
              'line-color': '#FEC106',
              'target-arrow-color': '#FEC106',
              'source-arrow-color': '#FEC106',
              // 'label': 'data(label)'
            }
          },{
            selector: '.leadsTo[type = "not"]',
            style: {
              'line-color': '#DC3545',
              'target-arrow-color': '#DC3545',
              'source-arrow-color': '#DC3545',
              // 'label': 'data(label)'
            }
          }],
          component: 'wanderer-leads-to-editor',
          toCytoscape: function(edgeData, sourceCollectionProps, targetCollectionProps, language) {

            var defaultCondition = false

            sourceCollectionProps.with('edgeConditions', (edgeConditions) => {
              edgeConditions.each((edgeCondition, conditionName) => {
                if(edgeCondition.is('default')) {
                  defaultCondition = conditionName
                }
              })
            })

            var priority = edgeData.get('priority') / 5
            if (priority < 1) {
              priority = 1
            }

            var line = 'solid'
            var label = ''

            if (edgeData.has('name')) {
              label = label+'{{'+edgeData.get('name')+'}}'
            }

            edgeData.with('condition', (condition) => {
              if(defaultCondition!=condition) {
                sourceCollectionProps.with('edgeConditions.'+condition+'.label', (label) => {
                  label = label+' ['+label+']'
                })
              }
              line = 'dashed'
            })

            edgeData.with('method', (method) => {
              if(targetCollectionProps) {
                targetCollectionProps.with('edgeMethods.'+method+'.label', (label) => {
                  label = label+' ('+label+')'
                })
              }
            })

            console.log({
              line: line,
              label: label,
              type: edgeData.get('type'),
              priority: priority
            })

            return {
              line: line,
              label: label,
              type: edgeData.get('type'),
              priority: priority
            }
          }
        }
      }
    })
  }

}


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



var thread = {
  install (wanderer) {

    var thread = Wanderer.require('thread')

    // Define a few traversal variables
    var traversedRequiredEdgeIds = []
    var traversedForbiddenEdgeIds = []
    var lastTraversedForbiddenEdgeIds = []
    var typingTimeouts = {}

    wanderer.addGraphConfiguration('message', 'traversal', {
      edgeConditions: {
        sent: {
          default: true,
          label: 'sent',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData!=undefined && vertexLifecycleData.sent) {
              return true;
            }
            return false;
          }
        }
      },
      becomeReachable: function (cytoscapeVertex, vertexData) {
        WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', false)
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        // If this message was not send before
        if(!WandererSingleton.getLifecycleValue(cytoscapeVertex.id(), 'sent')) {

          // if this message is currently not typing
          if(typingTimeouts[cytoscapeVertex.id()] === undefined) {

            // Send a typing signal to the chat
            WandererStoreSingleton.store.dispatch('wanderer/chat/setTyping', 1000)

            // Now send the message after a while
            // And set the timeout
            typingTimeouts[cytoscapeVertex.id()] = setTimeout(()=>{

              // Get the message text
              var text = WandererSingleton.markdown2html(WandererSingleton.evaluateVertexTemplate(WandererSingleton.getTranslatableVertexValue(cytoscapeVertex.id(), 'message'), cytoscapeVertex.id()))

              // Push the message to the chat
              WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
                component: 'wanderer-message',
                backgroundColor: '#6C757D',
                vertexId: cytoscapeVertex.id(),
                text: text
              })

              // Remember the message now as sent
              WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', true)

              // Remove the message from the typing object
              delete typingTimeouts[cytoscapeVertex.id()]

            }, 1000)

          }

        }

      }

    })

  }
}

export {
  client, thread
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
