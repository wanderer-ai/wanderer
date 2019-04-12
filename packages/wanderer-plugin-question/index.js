import QuestionEditor from './components/QuestionEditor.vue'
import SuggestionEditor from './components/SuggestionEditor.vue'
import QuestionMessage from './components/QuestionMessage.vue'
import SuggestionMessage from './components/SuggestionMessage.vue'
import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-question-editor', QuestionEditor)
    Vue.component('wanderer-suggestion-editor', SuggestionEditor)
    Vue.component('wanderer-question-message', QuestionMessage)
    Vue.component('wanderer-suggestion-message', SuggestionMessage)

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
        withdrawSuggestion (state, vertexId) {
          state.answeredSuggestions.splice(state.answeredSuggestions.indexOf(vertexId), 1)
        },
        clean (state) {
          state.answeredQuestions = []
          state.answeredSuggestions = []
        }
      }
    })

    WandererSingleton.on('clean', function() {
      WandererStoreSingleton.store.commit('wanderer/plugin-question/clean')
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
        cytoscapeStyles: [{
          selector: '.question',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#007BFF',
            'label': 'data(label)'
          }
        }],
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
        // Add the question only to result if it was not answered before
        if(WandererStoreSingleton.store.state.wanderer['plugin-question'].answeredQuestions.indexOf(cytoscapeVertex.id())==-1){

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

        }

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
      },
      finisher: function () {
        console.log('asking the question finisher')
        if(
          traversalResult.lastFoundQuestionId === undefined || // If no question was found
          traversalResult.lastFoundSuggestionIds.length == 0 // Or if the question has no suggestions
        ){
          return true
        }
        return false
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
          },
          'type': 'button',
          'name': '',
          'priority': 50
        },
        cytoscapeStyles: [{
          selector: '.suggestion',
          style: {
            'height': 'data(priority)',
            'width': 'data(priority)',
            'font-size': '20px',
            'background-color': '#28A745',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-suggestion-editor'
      },
      toCytoscape: function(data, language){
        var varname = '';
        if(data.name){
          varname = ' ('+data.name+')';
        }
        var label = 'Suggestion'
        if(data.suggestion[language]){
          label = data.suggestion[language]+varname
        }
        var priority = data['priority'];
        if (priority < 10) {
          priority = 10;
        }
        priority = priority + 'px'
        return {
          label: label,
          priority: priority
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {
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
        restrictSourceVertices: [
          'question'
        ],
        restrictTargetVertices: [
          'suggestion'
        ],
        cytoscapeStyles: [{
          selector: '.isAnswerableBy',
          style: {
            'line-color': '#28A745',
            'target-arrow-color': '#28A745',
            'source-arrow-color': '#28A745',
            //'label': 'data(label)'
          }
        }]
      },
      toCytoscape: function(data){
        return {
          //label: 'isAnswerableBy'
        }
      }
    })

    // ToDo: Place this event listener in chat
    // That would require a not globalized traversal result
    // Listen for traversal event
    WandererSingleton.on('traversalFinished', function() {

      if(
        traversalResult.lastFoundQuestionId !== undefined //&& // We need a question
        // Das ist an der Stelle nicht so gut, weil es dazu führt, dass hier nix mehr geht, wenn eine frage keine antwort hat.
        // Das gehört eher in den traversal prozess, damit ein alternativfrage geholt werden kann
        // traversalResult.lastFoundSuggestionIds.length>0 // Every question needs at least one suggestion
      ) {

        WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
          // id: traversalResult.lastFoundQuestionId,
          component: 'wanderer-question-message',
          data: {
            vertexId: traversalResult.lastFoundQuestionId,
            suggestionVertexIds: traversalResult.lastFoundSuggestionIds
          },
          backgroundColor: '#007BFF',
          delay: 2000
        })

      }

      // }else{

        // No question was found :-(
        // Trigger the end of the flow
        // WandererSingleton.trigger('flowFinished')

      // }

      // Reset the result object
      traversalResult = {};

    })

  }

}
