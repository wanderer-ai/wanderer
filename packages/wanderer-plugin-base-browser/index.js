import FlowEditor from './components/FlowEditor.vue'
import MessageEditor from './components/MessageEditor.vue'
import VoidEditor from './components/VoidEditor.vue'
import LeadsToEditor from './components/LeadsToEditor.vue'
import Message from './components/Message.vue'
import ConclusionEditor from './components/ConclusionEditor.vue'
import TimerEditor from './components/TimerEditor.vue'

export default {
  install (wanderer) {

    // Require some dependencys from wanderer
    var Vue = wanderer.require('vue')

    // Register some vue components
    Vue.component('wanderer-flow-editor', FlowEditor)
    Vue.component('wanderer-leads-to-editor', LeadsToEditor)
    Vue.component('wanderer-message-editor', MessageEditor)
    Vue.component('wanderer-void-editor', VoidEditor)
    Vue.component('wanderer-message', Message)
    Vue.component('wanderer-conclusion-editor', ConclusionEditor)
    Vue.component('wanderer-timer-editor', TimerEditor)

    // Register some vertices for the builder
    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'flow',
      props: {
        builder: {
          label: 'Flow',
          description: 'This is the starting point of every flow.',
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
                label: vertexData.get('topic.'+language)
              }
            }
            return {
              label: 'Topic'
            }
          }
        }
      }
    })

    // Register some vertices for the builder
    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'void',
      props: {
        builder: {
          label: 'Void',
          description: 'A simple empty node. Use it to bundle or forward information.',
          color: '#6c757d',
          cytoscapeClasses: 'void',
          cytoscapeCxtMenuSelector: '.void',
          creatable: true,
          ctxMenuAllowedEdge: 'leadsTo',
          appendableViaCxtMenu: true,
          defaultFields: {
          },
          cytoscapeStyles: [{
            selector: '.void',
            style: {
              'height': '50px',
              'width': '50px',
              'font-size': '20px',
              'background-color': '#6c757d',
              'border-color': '#6c757d',
              'border-width': '5px'
            }
          }],
          toCytoscape: function(vertexData, language) {
            return {
              label: ''
            }
          },
          component: 'wanderer-void-editor',
          lifecycleData: {
          },
          edgeConditions: {
          }
        }
      }
    })

    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'message',
      props: {
        builder: {
          label: 'Message',
          description: 'A simple chat message that support Markdown.',
          infoUrl: 'https://wanderer.ai/docs/user-guide/nodes.html#message',
          color: '#007BFF',
          cytoscapeClasses: 'message',
          cytoscapeCxtMenuSelector: '.message',
          creatable: true,
          appendableViaCxtMenu: true,
          ctxMenuAllowedEdge: 'leadsTo',
          defaultFields: {
            message: {
              en: 'New message',
              de: 'Neue Nachricht'
            },
            forgetful: false
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
                label: vertexData.get('message.'+language)
              }
            }
            return {
              label: 'Message'
            }
          },
          lifecycleData: {

          },
          edgeConditions: {
            sent: {
              default: true,
              label: 'message was sent'
            },
            notSent: {
              default: false,
              label: 'message has not yet been sent'
            }
          },
        },
        chat: {
          messageComponent: 'wanderer-message'
        }
      }
    })

    // Register some vertices for the builder
    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'conclusion',
      props: {
        builder: {
          label: 'Conclusion',
          description: 'This node can calculate new data from incomming information.',
          infoUrl: 'https://wanderer.ai/docs/user-guide/nodes.html#conclusion',
          color: '#FEC106',
          cytoscapeClasses: 'conclusion',
          cytoscapeCxtMenuSelector: '.conclusion',
          creatable: true,
          ctxMenuAllowedEdge: 'leadsTo',
          appendableViaCxtMenu: true,
          defaultFields: {
            conclusion: {
              en: 'New conclusion',
              de: 'Neue Schlussfolgerung'
            },
            expression: ''
          },
          cytoscapeStyles: [{
            selector: '.conclusion',
            style: {
              'height': '50px',
              'width': '50px',
              'font-size': '20px',
              'background-color': '#FEC106',
              'border-color': '#FEC106',
              'border-width': '5px',
              'label': 'data(label)'
            }
          }],
          toCytoscape: function(vertexData, language) {
            if(vertexData.has('conclusion.'+language)){
              return {
                label: vertexData.get('conclusion.'+language)
              }
            }
            return {
              label: 'Conclusion'
            }
          },
          component: 'wanderer-conclusion-editor',
          lifecycleData: {
            result: {
              label: 'Result',
              exposeDefault: true
            }
          },
          edgeConditions: {
            isTrue: {
              default: false,
              label: 'is true'
            },
            isFalse: {
              default: false,
              label: 'is false'
            },
            isEmpty: {
              default: false,
              label: 'is empty'
            },
            isNumber: {
              default: false,
              label: 'is a number'
            },
            isNaN: {
              default: false,
              label: 'is not a number'
            }
          }
        }
      }
    })

    // Register some vertices for the builder
    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'timer',
      props: {
        builder: {
          label: 'Timer',
          description: 'This node becomes active when a certain number of seconds has passed.',
          infoUrl: 'https://wanderer.ai/docs/user-guide/nodes.html#timer',
          color: '#a136ff',
          cytoscapeClasses: 'timer',
          cytoscapeCxtMenuSelector: '.timer',
          creatable: true,
          ctxMenuAllowedEdge: 'leadsTo',
          appendableViaCxtMenu: false,
          defaultFields: {
            seconds: 5000,
            forgetful: false
          },
          cytoscapeStyles: [{
            selector: '.timer',
            style: {
              'height': '50px',
              'width': '50px',
              'font-size': '20px',
              'background-color': '#a136ff',
              'border-color': '#a136ff',
              'border-width': '5px',
              'label': 'data(label)'
            }
          }],
          toCytoscape: function(vertexData, language) {
            return {
              label: 'Timer '+(vertexData.get('seconds')/1000)
            }
          },
          component: 'wanderer-timer-editor',
          lifecycleData: {

          },
          edgeConditions: {
            expired: {
              default: true,
              label: 'expired'
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
          defaultFields: function (sourceCollectionProps) {

            var defaultData = {
              type: 'or',
              priority: 10,
              name: '',
              expose: 'none',
              // method: false,
              condition: 'active'
            }

            // Check the source node collection for default edge conditions
            sourceCollectionProps.with('edgeConditions', (edgeConditions) => {
              edgeConditions.each((edgeCondition, conditionName) => {
                if(edgeCondition.is('default')) {
                  defaultData.condition = conditionName
                }
              })
            })

            // Check the source node for default expose data fields
            // var defaultExposeData = WandererSingleton.getVertexCollectionDefaultExposeField(fromVertexCollection.name)
            // if(defaultExposeData) {
            //   defaultData.expose = defaultExposeData
            // }

            return defaultData
          },
          cytoscapeStyles: [{
            selector: '.leadsTo',
            style: {
              'line-color': '#6c757d',
              'target-arrow-color': '#6c757d',
              'source-arrow-color': '#6c757d',
              'width': 'data(priority)',
              'label': 'data(label)',
              'line-style': 'data(line)',
              'line-dash-pattern': 'data(pattern)'
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
          toCytoscape: function(edgeData, sourceCollectionProps, targetCollectionProps) {

            // "Active" is the default condition for all vertices
            var defaultCondition = 'active'

            // But it can be overridden by other conditions of this vertex
            // Get the default condition
            sourceCollectionProps.with('edgeConditions', (edgeConditions) => {
              edgeConditions.each((edgeCondition, conditionName) => {
                if(edgeCondition.is('default')) {
                  defaultCondition = conditionName
                }
              })
            })

            // Define the line weight
            var priority = edgeData.get('priority') / 5
            if (priority < 1) { priority = 1 }

            // Define the dash pattern
            var dash = edgeData.get('priority') / 5;
            if (dash < 1) { dash = 1 }
            var pattern = [
              dash * 1.5,
              dash * 1.5
            ]

            // Create line style
            var line = 'solid'

            // Create display label
            var displayLabel = ''

            // Display the exported variable
            if (!edgeData.isEmpty('name')) {
              displayLabel = displayLabel+'{{'+edgeData.get('name')+'}}'
            }

            edgeData.with('condition', (condition) => {

              // Make the line dashed, if there is any kind of a condition
              line = 'dashed'

              // Make the line solid for "active" conditions
              if(condition == 'active') {
                line = 'solid'
              }

              if(defaultCondition!=condition) {

                // Set the name for the inative condition here since this is not defined by the node
                if(condition == 'inactive') {
                  displayLabel = displayLabel+' [inactive]'
                }

                // Get the custom condition name
                sourceCollectionProps.with('edgeConditions.'+condition+'.label', (label) => {
                  displayLabel = displayLabel+' ['+label+']'
                })
              }

            })

            return {
              line: line,
              label: displayLabel,
              type: edgeData.get('type'),
              priority: priority,
              pattern: pattern
            }
          }
        }
      }
    })
  }
}
