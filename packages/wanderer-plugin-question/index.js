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

    // Extend vuex with new namespace and create store instance for the questions and its answers
    WandererStoreSingleton.store.registerModule(['wanderer', 'plugin-question'], {
      namespaced: true,
      state: {
        answeredQuestions: [],
        answeredSuggestions: []
      },
      mutations: {
        answerQuestion (state, vertexId) {
          state.answeredQuestions.push(vertexId)
        },
        answerSuggestion (state, vertexId) {
          state.answeredSuggestions.push(vertexId)
        },
        clean (state) {
          state.answeredQuestions = []
          state.answeredSuggestions = []
        }
      }
    })

    var traversalResult = {};

    // Register the question vertex
    WandererSingleton.registerVertexCollection('question',{
      builder: {
        label: 'Question',
        color: '#007BFF',
        cytoscapeClasses: 'question',
        cytoscapeCxtMenuSelector: '.question',
        creatable: true,
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
      visitor: function (cytoscapeVertex, vertexData, language) {
        console.log('cleaning suggestions')
        traversalResult.lastFoundQuestionId = cytoscapeVertex.id()
        traversalResult.lastFoundSuggestionIds = []
        // Find and add suggestions to result
        let cytoscapeEdges = cytoscapeVertex.connectedEdges()
        cytoscapeEdges.forEach(function(cytoscapeEdge){
          let currentEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[cytoscapeEdge.id()]
          if(
            cytoscapeVertex.id()==cytoscapeEdge.data('source') && // If this is an outbound edge
            currentEdgeData._collection=='isAnswerableBy' // If this edge is of the type isAnswerableBy
          ){
            traversalResult.lastFoundSuggestionIds.push(cytoscapeEdge.target().id()) // Add the target vertex (suggestion)
          }
        })
      },
      expander: function (cytoscapeVertex, vertexData, outboundCyEdges) {

        let returnEdges = []

        // Iterate over he outbound cytoscape edges
        outboundCyEdges.forEach(function(outboundCyEdge){
          let targetVertex = outboundCyEdge.target()
          let targetVertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[targetVertex.id()]

          // If the target node is a suggestion
          if(targetVertexData['_collection']=='suggestion'){
            returnEdges.push(outboundCyEdge)
          }else{
            // Push the edge only if the question was answered
            if(WandererStoreSingleton.store.state.wanderer['plugin-question'].answeredQuestions.indexOf(cytoscapeVertex.id())!=-1){
              returnEdges.push(outboundCyEdge)
            }
          }

        })

        return returnEdges
      }
    })

    // Register the suggestion vertex
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
            through: 'isAnswerableBy'
          }
        ],
        defaultFields: {
          'suggestion': {
            'de': 'Antwortvorschlag',
            'en': 'Suggestion'
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
      visitor: function (cytoscapeVertex, vertexData, language) {
        // console.log('add new suggestion')
        // traversalResult.lastFoundSuggestionIds.push(cytoscapeVertex.id())
      },
      expander: function (cytoscapeVertex, currentVertexData, outboundCyEdges) {
        let returnEdges = []

        // Iterate over he outbound cytoscape edges
        outboundCyEdges.forEach(function(outboundCyEdge){

          // Push the edge only if the suggestion was answered
          if(WandererStoreSingleton.store.state.wanderer['plugin-question'].answeredSuggestions.indexOf(cytoscapeVertex.id())!=-1){
            returnEdges.push(outboundCyEdge)
          }

        })

        return returnEdges
      }
    })

    // Register the isAnswerableBy edge
    WandererSingleton.registerEdgeCollection('isAnswerableBy',{
      builder: {
        label: 'isAnswerableBy',
        cytoscapeClasses: 'isAnswerableBy',
        creatable: true,
        defaultFields: {},
        cytoscapeStyle: {
          selector: '.isAnswerableBy',
          style: {
            'line-color': '#28A745',
            'target-arrow-color': '#28A745',
            'source-arrow-color': '#28A745',
            'label': 'data(label)'
          }
        }
      },
      toCytoscape: function(data){
        return {
          label: 'isAnswerableBy'
        }
      }
    })

    var addedMessages = []

    // ToDo: Place this event listener in chat
    // That would require a not globalized traversal result
    // Listen for traversal event
    WandererSingleton.on('traversalFinished', function() {

      console.log('finished traversal')
      console.log(traversalResult)

      if(traversalResult.lastFoundQuestionId != undefined){
        // Add message if not already added
        if(addedMessages.indexOf(traversalResult.lastFoundQuestionId)==-1){

          // addedMessages.push(traversalResult.lastFoundQuestionId)

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
