import ConclusionEditor from './components/ConclusionEditor.vue'
import ConclusionMessage from './components/ConclusionMessage.vue'

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-conclusion-editor', ConclusionEditor)
    Vue.component('wanderer-conclusion-message', ConclusionMessage)

    var traversalResult = {};

    // Register the question vertex
    WandererSingleton.registerVertexCollection('conclusion',{
      builder: {
        label: 'Conclusion',
        color: '#FEC106',
        cytoscapeClasses: 'conclusion',
        cytoscapeCxtMenuSelector: '.conclusion',
        creatable: true,
        defaultFields: {
          conclusion: {
            en: 'New conclusion',
            de: 'Neue Schlussfolgerung'
          }
        },
        cytoscapeStyle: {
          selector: '.conclusion',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#FEC106',
            'label': 'data(label)'
          }
        },
        component: 'wanderer-conclusion-editor'
      },
      chat: {
        // component: 'wanderer-question-message'
      },
      toCytoscape: function(data, language){
        if(data.conclusion[language]){
          return {
            label: data.conclusion[language]
          }
        }
        return {
          label: 'Conclusion'
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {
        traversalResult.lastFoundConclusionId = cytoscapeVertex.id()
      },
      // expander: function (cytoscapeVertex, vertexData, outboundCyEdges) {
      //   return outboundCyEdges
      // }
    })

    WandererSingleton.on('traversalFinished', function() {

      WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
        id: traversalResult.lastFoundConclusionId,
        component: 'wanderer-conclusion-message',
        data: {
          vertexId: traversalResult.lastFoundConclusionId
        }
      })

    })

  }

}
