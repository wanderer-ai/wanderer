// import Editor from './components/Editor.vue'
import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

import FlowEditor from './components/FlowEditor.vue'
import OnboardingMessage from './components/OnboardingMessage.vue'
import OffboardingMessage from './components/OffboardingMessage.vue'

export default {

  install (Vue) {

    Vue.component('wanderer-flow-editor', FlowEditor)
    Vue.component('wanderer-onboarding-message', OnboardingMessage)
    Vue.component('wanderer-offboarding-message', OffboardingMessage)

    var traversalResult = {};

    WandererSingleton.registerVertexCollection('flow',{
      builder: {
        label: 'Flow',
        color: '#DC3545',
        cytoscapeClasses: 'flow',
        cytoscapeCxtMenuSelector: '.flow',
        creatable: false,
        cytoscapeStyle: {
          selector: '.flow',
          style: {
            'height': '200px',
            'width': '200px',
            'font-size': '20px',
            'background-color': '#6C757D',
            'label': 'data(label)'
          }
        },
        component: 'wanderer-flow-editor'
      },
      toCytoscape: function(data){
        return {
          label: 'Flow'
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {
        traversalResult.flowVertexId = cytoscapeVertex.id()
      },
    })

    WandererSingleton.on('traversalFinished', function() {
      WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
        id: traversalResult.flowVertexId+'_onboarding',
        component: 'wanderer-onboarding-message',
        data: {
          vertexId: traversalResult.flowVertexId
        }
      })
    })

    WandererSingleton.on('flowFinished', function() {
      WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
        id: traversalResult.flowVertexId+'_offboarding',
        component: 'wanderer-offboarding-message',
        data: {
          vertexId: traversalResult.flowVertexId
        }
      })
    })

    WandererSingleton.registerEdgeCollection('leadsTo',{
      builder: {
        label: 'leadsTo',
        cytoscapeClasses: 'leadsTo',
        creatable: true,
        defaultFields: {},
        cytoscapeStyle: {
          selector: '.leadsTo',
          style: {
            'line-color': '#6C757D',
            'target-arrow-color': '#6C757D',
            'source-arrow-color': '#6C757D',
            'label': 'data(label)'
          }
        }
      },
      toCytoscape: function(data){
        return {
          label: 'leadsTo'
        }
      }
    })

    WandererSingleton.registerVertexCollection('default',{
      builder: {
        label: 'Default',
        color: '#6C757D',
        cytoscapeClasses: 'default-vertex',
        cytoscapeCxtMenuSelector: '.default',
        creatable: false,
        defaultFields: {},
        cytoscapeStyle: {
          selector: '.default-vertex',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#6C757D',
            'label': 'data(label)'
          }
        }
      },
      toCytoscape: function(data){
        return {
          label: 'Default'
        }
      },
    })

    WandererSingleton.registerEdgeCollection('default',{
      builder: {
        label: 'Default',
        color: '#6C757D',
        cytoscapeClasses: 'default-edge',
        creatable: false,
        defaultFields: {},
        cytoscapeStyle: {
          selector: '.default-edge',
          style: {
            'line-color': '#6C757D',
            'target-arrow-color': '#6C757D',
            'source-arrow-color': '#6C757D',
            'label': 'data(label)'
          }
        }
      },
      toCytoscape: function(data){
        return {
          label: 'Default'
        }
      }
    })

  },

}
