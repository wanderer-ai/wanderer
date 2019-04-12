// import Editor from './components/Editor.vue'
import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

import FlowEditor from './components/FlowEditor.vue'
import LeadsToEditor from './components/LeadsToEditor.vue'
import OnboardingMessage from './components/OnboardingMessage.vue'
import OffboardingMessage from './components/OffboardingMessage.vue'

export default {

  install (Vue) {

    Vue.component('wanderer-flow-editor', FlowEditor)
    Vue.component('wanderer-leads-to-editor', LeadsToEditor)
    Vue.component('wanderer-onboarding-message', OnboardingMessage)
    Vue.component('wanderer-offboarding-message', OffboardingMessage)

    var edgeTraversalResult = {};
    var flowVertexId = '';

    WandererSingleton.registerVertexCollection('flow',{
      builder: {
        label: 'Flow',
        color: '#DC3545',
        cytoscapeClasses: 'flow',
        cytoscapeCxtMenuSelector: '.flow',
        creatable: false,
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
    })

    var onboardingWasDisplayed = false;
    WandererSingleton.on('traversalFinished', function() {
      if(!onboardingWasDisplayed){
        onboardingWasDisplayed = true
        WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
          // id: flowVertexId+'_onboarding',
          component: 'wanderer-onboarding-message',
          data: {
            vertexId: flowVertexId
          },
          delay: 500
        })
      }
    })

    WandererSingleton.registerEdgeCollection('leadsTo',{
      builder: {
        label: 'leadsTo',
        cytoscapeClasses: 'leadsTo',
        creatable: true,
        defaultFields: {
          type: 'or',
          priority: 10
        },
        cytoscapeStyles: [{
          selector: '.leadsTo',
          style: {
            'line-color': '#6C757D',
            'target-arrow-color': '#6C757D',
            'source-arrow-color': '#6C757D',
            'width': 'data(priority)',
            // 'label': 'data(myWidth)'
          }
        },{
          selector: '.leadsTo[type = "and"]',
          style: {
            'line-color': '#DC3545',
            'target-arrow-color': '#DC3545',
            'source-arrow-color': '#DC3545',
            // 'label': 'data(label)'
          }
        }],
        component: 'wanderer-leads-to-editor'
      },
      toCytoscape: function(data){

        var priority = data['priority'] / 2.5;
        if (priority < 1) {
          priority = 1;
        }

        return {
          // label: data['type'],
          type: data['type'],
          priority: priority
        }
      },
      visitor: function (cytoscapeEdge, edgeData, language) {
        // Just remember this edges
        if (edgeData.type == 'and') {
          edgeTraversalResult.lastTraversedRequiredEdgeIds.push(cytoscapeEdge.id())
        }
      },
      allowTargetTraversal: function (cytoscapeVertex, vertexData, cytoscapeEdge, edgeData, language) {
        if (edgeData.type == 'and') {
          // Have I already visited this required edge?
          if (edgeTraversalResult.lastTraversedRequiredEdgeIds.indexOf(cytoscapeEdge.id()) === -1) {
            return false
          }
        }
        return true
      }
    })

    var edgeTraversalResult = {
      lastTraversedRequiredEdgeIds: []
    }

    // WandererSingleton.registerEdgeCollection('isRequiredBy', {
    //   builder: {
    //     label: 'isRequiredBy',
    //     cytoscapeClasses: 'isRequiredBy',
    //     creatable: true,
    //     defaultFields: {},
    //     cytoscapeStyle: {
    //       selector: '.isRequiredBy',
    //       style: {
    //         'line-color': '#DC3545',
    //         'target-arrow-color': '#DC3545',
    //         'source-arrow-color': '#DC3545',
    //         'label': 'data(label)'
    //       }
    //     }
    //   },
    //   toCytoscape: function (data) {
    //     return {
    //       label: 'isRequiredBy'
    //     }
    //   },
    //   visitor: function (cytoscapeEdge, edgeData, language) {
    //     // Just remember this edges
    //     console.log('calling the visitor')
    //     traversalResult.lastTraversedRequiredEdgeIds.push(cytoscapeEdge.id())
    //   },
    //   allowTargetTraversal: function (cytoscapeVertex, vertexData, cytoscapeEdge, edgeData, language) {
    //     console.log('allowTargetTraversal')
    //     // Have I already visited this required edge?
    //     if (traversalResult.lastTraversedRequiredEdgeIds.indexOf(cytoscapeEdge.id()) === -1) {
    //       return false
    //     }
    //     return true
    //   }
    // })

    // WandererSingleton.registerVertexCollection('default', {
    //   builder: {
    //     label: 'Default',
    //     color: '#6C757D',
    //     cytoscapeClasses: 'default-vertex',
    //     cytoscapeCxtMenuSelector: '.default',
    //     creatable: false,
    //     defaultFields: {},
    //     cytoscapeStyle: {
    //       selector: '.default-vertex',
    //       style: {
    //         'height': '50px',
    //         'width': '50px',
    //         'font-size': '20px',
    //         'background-color': '#6C757D',
    //         'label': 'data(label)'
    //       }
    //     }
    //   },
    //   toCytoscape: function(data){
    //     return {
    //       label: 'Default'
    //     }
    //   },
    // })

    // WandererSingleton.registerEdgeCollection('default',{
    //   builder: {
    //     label: 'Default',
    //     color: '#6C757D',
    //     cytoscapeClasses: 'default-edge',
    //     creatable: false,
    //     defaultFields: {},
    //     cytoscapeStyle: {
    //       selector: '.default-edge',
    //       style: {
    //         'line-color': '#6C757D',
    //         'target-arrow-color': '#6C757D',
    //         'source-arrow-color': '#6C757D',
    //         'label': 'data(label)'
    //       }
    //     }
    //   },
    //   toCytoscape: function(data){
    //     return {
    //       label: 'Default'
    //     }
    //   }
    // })

    WandererSingleton.on('traversalFinished', function() {
      // Reset the result object
      edgeTraversalResult = {
        lastTraversedRequiredEdgeIds: []
      }
    })

    // var offboardingWasDisplayed = false;
    WandererSingleton.on('flowFinished', function() {
      // if(!offboardingWasDisplayed){
        // offboardingWasDisplayed = true
        WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
          // id: flowVertexId+'_offboarding',
          component: 'wanderer-offboarding-message',
          data: {
            vertexId: flowVertexId
          },
          delay: 1000
        })
      // }
    })

    WandererSingleton.on('clean', function() {
      // offboardingWasDisplayed = false
      onboardingWasDisplayed = false
    })

  },

}
