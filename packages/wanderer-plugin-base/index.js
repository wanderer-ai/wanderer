// import Editor from './components/Editor.vue'
import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'
import WandererCsytoscapeSingleton from 'wanderer-cytoscape-singleton'

import FlowEditor from './components/FlowEditor.vue'
import MessageEditor from './components/MessageEditor.vue'
import LeadsToEditor from './components/LeadsToEditor.vue'
import Message from './components/Message.vue'

export default {

  install (Vue) {

    Vue.component('wanderer-flow-editor', FlowEditor)
    Vue.component('wanderer-leads-to-editor', LeadsToEditor)
    Vue.component('wanderer-message-editor', MessageEditor)
    Vue.component('wanderer-message', Message)

    // var traversalResult = {};
    var edgeTraversalResult = {};
    var flowVertexId = '';
    var transferedMessages = [];

    WandererSingleton.registerVertexCollection({
      name: 'flow',
      builder: {
        label: 'Flow',
        color: '#6C757D',
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
            'font-size': '20px',
            'background-color': '#6C757D',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-flow-editor'
      },
      lifecycleData: {
        flowFinished: {
          label: 'Flow finished',
          exposeDefault: false
        }
      },
      toCytoscape: function(data, language){
        if(data.topic[language]){
          return {
            label: data.topic[language]
          }
        }
        return {
          label: 'Flow'
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {
        flowVertexId = cytoscapeVertex.id()
      },
      edgeConditions: {
        finished: {
          label: 'finished',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData != undefined){
              if(vertexLifecycleData.flowFinished){
                return true;
              }
            }
            return false;
          }
        }
      }
    })

    // var foundMessages = 0;

    WandererSingleton.registerVertexCollection({
      name: 'message',
      builder: {
        label: 'Message',
        color: '#6C757D',
        cytoscapeClasses: 'message',
        cytoscapeCxtMenuSelector: '.message',
        creatable: true,
        showInCxtMenu: true,
        defaultFields: {
          message: {
            en: 'New message',
            de: 'Neue Nachricht'
          }
        },
        cytoscapeStyles: [{
          selector: '.message',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#6C757D',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-message-editor'
      },
      toCytoscape: function(data, language){
        if(data.message[language]){
          return {
            label: data.message[language]
          }
        }
        return {
          label: 'Message'
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {
        // if(traversalResult.lastFoundMessageIds == undefined){
        //   traversalResult.lastFoundMessageIds = []
        // }
        // traversalResult.lastFoundMessageIds.push(cytoscapeVertex.id())

        // Hand over the message to the chat if it was not transfered before
        if(transferedMessages.indexOf(cytoscapeVertex.id())==-1){

          transferedMessages.push(cytoscapeVertex.id())

          WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
            // id: traversalResult.lastFoundConclusionIds[i],
            component: 'wanderer-message',
            backgroundColor: '#6C757D',
            data: {
              vertexId: cytoscapeVertex.id()
            },
            delay: 1000
          })

          // foundMessages++

        }

      },
    })

    // var displayedMessages = []

    // var onboardingWasDisplayed = false;
    WandererSingleton.on('traversalFinished', function() {

      // foundMessages = 0;

    })

    WandererSingleton.registerEdgeCollection({
      name: 'leadsTo',
      builder: {
        label: 'leadsTo',
        cytoscapeClasses: 'leadsTo',
        creatable: true,
        defaultFields: function (fromVertexCollection, toVertexCollection) {

          var defaultData = {
            type: 'or',
            priority: 10,
            name: '',
            expose: '',
            condition: false,
            compareVariable: false,
            compareCondition: '==',
            compareValue: ''
          }

          // Check the source node collection for default edge conditions
          var defaultCondition = WandererSingleton.getVertexCollectionDefaultEdgeCondition(fromVertexCollection.name)
          if(defaultCondition) {
            defaultData.condition = defaultCondition
          }

          // Check the source node for default expose data fields
          var defaultExposeData = WandererSingleton.getVertexCollectionDefaultExposeField(fromVertexCollection.name)
          if(defaultExposeData) {
            defaultData.expose = defaultExposeData
          }

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
        component: 'wanderer-leads-to-editor'
      },
      toCytoscape: function(data) {

        // Get the source vertex collection
        var cytoscapeSourceNode = WandererCsytoscapeSingleton.cy.getElementById(data._from)
        var sourceNodeCollection = WandererSingleton.getVertexCollectionById(cytoscapeSourceNode.id())

        // Find default data
        var defaultCondition = WandererSingleton.getVertexCollectionDefaultEdgeCondition(sourceNodeCollection.name)

        var priority = data['priority'] / 2.5
        if (priority < 1) {
          priority = 1
        }

        var line = 'solid'
        var label = ''

        if (data.name) {
          label = label+data.name
        }

        if (data.condition) {
          if(data.condition=='custom') {
            if(data.compareVariable) {
              label = label+'('+data.compareVariable + data.compareCondition + data.compareValue+')'
              line = 'dashed'
            }
          } else {

              // console.log(data);
              // let collection = WandererSingleton.getVertexCollection(data._collection)
              // label = collection.edgeConditions[data.condition].label
              // Print the corrent label from the outgoing vertex condition

              // Only draw condition if not default
              if(defaultCondition!=data.condition) {
                label = label+'('+sourceNodeCollection.edgeConditions[data.condition].label+')'
              }

              line = 'dashed'

          }
        }

        return {
          line: line,
          label: label,
          type: data['type'],
          priority: priority
        }
      },
      visitor: function (cytoscapeEdge, edgeData, language) {
        // Just remember this edges
        if (edgeData.type == 'and') {
          edgeTraversalResult.lastTraversedRequiredEdgeIds.push(cytoscapeEdge.id())
        }
        if (edgeData.type == 'not') {
          edgeTraversalResult.lastTraversedForbiddenEdgeIds.push(cytoscapeEdge.id())
        }
      },
      allowTraversal: function (cytoscapeVertex, vertexData, cytoscapeEdge, edgeData, language) {
        // Is there a compareVariable available in this data?
        if (edgeData.condition) {

          let vertexLifecycleData = WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()]

          if(edgeData.condition=='custom') {

            // Check custom conditions

            if (edgeData.compareVariable) {
              // Get the lifecycle data of the source node
              if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()] != undefined){

                var variable = vertexLifecycleData[edgeData.compareVariable]
                var value = edgeData.compareValue

                // Convert strings to int if necessary
                // So the end user has not to deal with types like strings and int
                if(parseInt(variable)){
                  variable = parseInt(variable)
                }
                if(parseInt(value)){
                  value = parseInt(value)
                }

                if(edgeData.compareCondition == '==') {
                  if(variable == value) {
                    return true
                  }
                }
                if(edgeData.compareCondition == '!=') {
                  if(variable != value) {
                    return true
                  }
                }
                if(edgeData.compareCondition == '<=') {
                  if(variable <= value) {
                    return true
                  }
                }
                if(edgeData.compareCondition == '>=') {
                  if(variable >= value) {
                    return true
                  }
                }
                if(edgeData.compareCondition == '<') {
                  if(variable < value) {
                    return true
                  }
                }
                if(edgeData.compareCondition == '>') {
                  if(variable > value) {
                    return true
                  }
                }
              }
              return false
            }
          } else {

            // Check predefined condition
            let sourceNodeCollection = WandererSingleton.getVertexCollection(vertexData._collection)
            if(sourceNodeCollection.edgeConditions != undefined) {
              if(sourceNodeCollection.edgeConditions[edgeData.condition] != undefined) {
                return sourceNodeCollection.edgeConditions[edgeData.condition].condition(vertexLifecycleData)
              }
            }
          }
        }

        return true
      },
      allowTargetTraversal: function (cytoscapeVertex, vertexData, cytoscapeEdge, edgeData, language) {
        if (edgeData.type == 'and') {
          // Have I already visited this required edge?
          if (edgeTraversalResult.lastTraversedRequiredEdgeIds.indexOf(cytoscapeEdge.id()) === -1) {
            return false
          }
        }
        if (edgeData.type == 'not') {
          // Have I not visited this forbidden edge before?
          if (edgeTraversalResult.lastTraversedForbiddenEdgeIds.indexOf(cytoscapeEdge.id()) !== -1) {
            return false
          }
        }
        return true
      }
    })

    var edgeTraversalResult = {
      lastTraversedRequiredEdgeIds: [],
      lastTraversedForbiddenEdgeIds: []
    }

    WandererSingleton.on('traversalFinished', function() {
      // Reset the result object
      edgeTraversalResult = {
        lastTraversedRequiredEdgeIds: [],
        lastTraversedForbiddenEdgeIds: []
      }
    })

    var flowFinished = false;

    // var offboardingWasDisplayed = false;
    WandererSingleton.on('flowFinished', function() {

      // We have to check if the flow was already finished
      // Because the flow can trigger a traversal for the last time if it was finished
      // This clause will work only one and will then deny all other traversal attempts
      if(!flowFinished){
        flowFinished = true;

        // Send the finished statement to the root node
        WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
          id: flowVertexId,
          key: 'flowFinished',
          value: true
        })

        // Start the traversal again
        WandererSingleton.traverse()

      }

      // if(!offboardingWasDisplayed){
        // offboardingWasDisplayed = true
        // WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
        //   // id: flowVertexId+'_offboarding',
        //   component: 'wanderer-offboarding-message',
        //   data: {
        //     vertexId: flowVertexId
        //   },
        //   delay: 1000
        // })
      // }
    })

    WandererSingleton.on('reset-chat', function() {
      // displayedMessages = []
      transferedMessages = []
      // offboardingWasDisplayed = false
      // onboardingWasDisplayed = false
      flowFinished = false

    })

  },

}
