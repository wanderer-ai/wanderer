import QuestionEditor from './components/QuestionEditor.vue'
import SuggestionEditor from './components/SuggestionEditor.vue'
import QuestionMessage from './components/QuestionMessage.vue'
import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-question-editor', QuestionEditor)
    Vue.component('wanderer-suggestion-editor', SuggestionEditor)
    Vue.component('wanderer-question-message', QuestionMessage)

    var traversalResult = {};

    WandererSingleton.registerVertexCollection('question',{
      builder: {
        label: 'Question',
        color: '#007BFF',
        cytoscapeClasses: 'question',
        cytoscapeCxtMenuSelector: '.question',
        creatable: true,
        restrictOutgoingConnections: [
          {
            through: 'leadsTo',
            to: 'suggestion'
          }
        ],
        defaultFields: {
          question: {
            en: 'New question',
            de: 'Neue Frage'
          }
        },
        cytoscapeStyle: {
          selector: '.question',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#007BFF',
            'label': 'data(label)'
          }
        },
        component: 'wanderer-question-editor'
      },
      chat: {
        // component: 'wanderer-question-message'
      },
      toCytoscape: function(data, language){
        if(data.question[language]){
          return {
            label: data.question[language]
          }
        }
        return {
          label: 'Question'
        }
      },
      visitor: function (nodeId, vertexData, language) {
        traversalResult.lastFoundQuestionId = nodeId
        traversalResult.lastFoundSuggestionIds = []
      },
      expander: function (nodeId, vertexData, outboundCyEdges) {
        return outboundCyEdges
      }
    })

    WandererSingleton.registerVertexCollection('suggestion',{
      builder: {
        label: 'Suggestion',
        color: '#28A745',
        cytoscapeClasses: 'suggestion',
        cytoscapeCxtMenuSelector: '.suggestion',
        creatable: true,
        restrictIncommingConnections: [
          {
            from: 'question',
            through: 'leadsTo'
          }
        ],
        defaultFields: {
          'suggestion': {
            'de': 'Antwort',
            'en': 'Answer'
          }
        },
        cytoscapeStyle: {
          selector: '.suggestion',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#28A745',
            'label': 'data(label)'
          }
        },
        component: 'wanderer-suggestion-editor'
      },
      toCytoscape: function(data, language){
        if(data.suggestion[language]){
          return {
            label: data.suggestion[language]
          }
        }
        return {
          label: 'Suggestion'
        }
      },
      visitor: function (nodeId, vertexData, language) {
        traversalResult.lastFoundSuggestionIds.push(nodeId)
      }
    })

    var addedMessages = []

    // Listen for traversal event
    WandererSingleton.on('traversalFinished', function() {

      console.log('finished traversal')
      console.log(traversalResult)

      if(traversalResult.lastFoundQuestionId != undefined){
        // Add message if not already added
        if(addedMessages.indexOf(traversalResult.lastFoundQuestionId)==-1){

          addedMessages.push(traversalResult.lastFoundQuestionId)

          WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
            id: traversalResult.lastFoundQuestionId,
            component: 'wanderer-question-message',
            data: {
              vertexId: traversalResult.lastFoundQuestionId,
              suggestionVertexIds: traversalResult.lastFoundSuggestionIds
            }
          })

        }
      }

      // Reset the result object
      traversalResult = {};

    })

  }

}
