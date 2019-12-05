import ActionEditor from './components/ActionEditor.vue'
import ActionMessage from './components/ActionMessage.vue'

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-action-message', ActionMessage)
    Vue.component('wanderer-action-editor', ActionEditor)

    // Extend vuex with new namespace and create store instance for the questions and its answers
    // WandererStoreSingleton.store.registerModule(['wanderer', 'plugin-action'], {
    //   namespaced: true,
    //   state: {
    //     finishedActions: []
    //   },
    //   mutations: {
    //     finishAction (state, vertexId) {
    //       state.finishedActions.push(vertexId)
    //     },
    //     clean (state) {
    //       state.finishedActions = []
    //     }
    //   }
    // })

    var doneActions = [];

    // Register the vertex
    WandererSingleton.registerVertexCollection({
      name: 'action',
      builder: {
        label: 'Action',
        color: '#DC3545',
        cytoscapeClasses: 'action',
        cytoscapeCxtMenuSelector: '.action',
        creatable: true,
        defaultFields: {
          message: {
            de: '',
            en: ''
          },
          type: 'link',
          link: ''
        },
        cytoscapeStyles: [{
          selector: '.action',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#DC3545',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-action-editor'
      },
      edgeConditions: {
        finished: {
          default: true,
          label: 'finished',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData!=undefined && vertexLifecycleData.finished) {
              return true;
            }
            return false;
          }
        }
      },
      toCytoscape: function(data, language){
        return {
          label: 'Action ('+data.type+')'
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        if(doneActions.indexOf(cytoscapeVertex.id())==-1) {

          doneActions.push(cytoscapeVertex.id())

          // Add the action message
          WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
            // id: traversalResult.lastFoundConclusionIds[i],
            component: 'wanderer-action-message',
            backgroundColor: '#DC3545',
            data: {
              vertexId: cytoscapeVertex.id()
            },
            delay: 1000
          })

        }

      },
      expander: function (cytoscapeVertex, vertexData, outboundCyEdges) {

        let returnEdges = []

        // Iterate over the outbound cytoscape edges
        outboundCyEdges.forEach(function(outboundCyEdge){

          // Push the edge only if the action is done
          // if(WandererStoreSingleton.store.state.wanderer['plugin-action'].finishedActions.indexOf(cytoscapeVertex.id())!=-1){
          // if(
          //   !WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()] ||
          //   WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()].finished === true) {
            returnEdges.push(outboundCyEdge)
          //}

        })

        return returnEdges
      },
      finisher: function () {
        // // console.log('asking the question finisher')
        // if(
        //   traversalResult.firstFoundQuestionId === undefined || // If no question was found
        //   traversalResult.firstFoundSuggestionIds.length == 0 // Or if the question has no suggestions
        // ){
        //   return true
        // }
        // return false

        return true
      }
    })

    WandererSingleton.on('reset-chat', function() {
      doneActions = []

      // WandererStoreSingleton.store.commit('wanderer/plugin-action/clean')

    })

  }

}
