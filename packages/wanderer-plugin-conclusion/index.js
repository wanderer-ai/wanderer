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
        cytoscapeStyles: [{
          selector: '.conclusion',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#FEC106',
            'label': 'data(label)'
          }
        }],
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
        if(traversalResult.lastFoundConclusionIds == undefined){
          traversalResult.lastFoundConclusionIds = []
        }
        traversalResult.lastFoundConclusionIds.push(cytoscapeVertex.id())
      },
      // expander: function (cytoscapeVertex, vertexData, outboundCyEdges) {
      //   return outboundCyEdges
      // }
    })

    var displayedConclusions = []

    WandererSingleton.on('traversalFinished', function() {

      if(traversalResult.lastFoundConclusionIds != undefined){

        for(var i in traversalResult.lastFoundConclusionIds){

          // Was this conclusion already added?
          if(displayedConclusions.indexOf(traversalResult.lastFoundConclusionIds[i])==-1){

            displayedConclusions.push(traversalResult.lastFoundConclusionIds[i])

            // Add the conclusion message
            WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
              // id: traversalResult.lastFoundConclusionIds[i],
              component: 'wanderer-conclusion-message',
              backgroundColor: '#FEC106',
              data: {
                vertexId: traversalResult.lastFoundConclusionIds[i]
              },
              delay: 1000
            })

          }

        }

      }

      // Reset the result object
      traversalResult = {};

    })

    WandererSingleton.on('clean', function() {
      displayedConclusions = []
    })

  }

}
