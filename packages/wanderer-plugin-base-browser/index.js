import FlowEditor from './components/FlowEditor.vue'
import MessageEditor from './components/MessageEditor.vue'
import LeadsToEditor from './components/LeadsToEditor.vue'
import Message from './components/Message.vue'

export default {
  install (wanderer) {

    // Require some dependencys from wanderer
    var Vue = wanderer.require('vue')
    var builder = wanderer.require('builder')

    // Register some vue components
    Vue.component('wanderer-flow-editor', FlowEditor)
    Vue.component('wanderer-leads-to-editor', LeadsToEditor)
    Vue.component('wanderer-message-editor', MessageEditor)
    Vue.component('wanderer-message', Message)

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
                label: vertexData.get('message.'+language)
              }
            }
            return {
              label: 'Message'
            }
          },
          lifecycleData: {
            sent: {
              label: 'sent',
              exposeDefault: false
            }
          },
          edgeConditions: {
            sent: {
              default: true,
              label: 'sent'
            }
          },
        },
        chat: {
          messageComponent: 'wanderer-message'
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
          defaultFields: function (sourceCollectionProps, targetCollectionProps) {

            var defaultData = {
              type: 'or',
              priority: 10,
              name: '',
              expose: '',
              method: false,
              condition: 'none'
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
              'line-color': '#FEC106',
              'target-arrow-color': '#FEC106',
              'source-arrow-color': '#FEC106',
              'width': 'data(priority)',
              'label': 'data(label)',
              'line-style': 'data(line)'
            }
          },{
            selector: '.leadsTo[type = "and"]',
            style: {
              'line-color': '#DC3545',
              'target-arrow-color': '#DC3545',
              'source-arrow-color': '#DC3545',
              // 'label': 'data(label)'
            }
          },{
            selector: '.leadsTo[type = "not"]',
            style: {
              'line-color': '#000000',
              'target-arrow-color': '#000000',
              'source-arrow-color': '#000000',
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

            if (!edgeData.isEmpty('name')) {
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
