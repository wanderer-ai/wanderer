import SectionEditor from './components/SectionEditor.vue'
import QuestionEditor from './components/QuestionEditor.vue'
import SuggestionEditor from './components/SuggestionEditor.vue'
import QuestionMessage from './components/QuestionMessage.vue'
import SuggestionMessage from './components/SuggestionMessage.vue'
import IsAnswerableByEditor from './components/IsAnswerableByEditor.vue'
import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-section-editor', SectionEditor)
    Vue.component('wanderer-question-editor', QuestionEditor)
    Vue.component('wanderer-suggestion-editor', SuggestionEditor)
    Vue.component('wanderer-question-message', QuestionMessage)
    Vue.component('wanderer-suggestion-message', SuggestionMessage)
    Vue.component('wanderer-is-answerable-by-editor', IsAnswerableByEditor)

    var debug = false

    // Extend vuex with new namespace and create store instance for the questions and its answers
    // WandererStoreSingleton.store.registerModule(['wanderer', 'plugin-question'], {
    //   namespaced: true,
    //   state: {
    //     answeredQuestions: [],
    //     answeredSuggestions: []
    //   },
    //   mutations: {
    //     answerQuestion (state, vertexId) {
    //       state.answeredQuestions.push(vertexId)
    //     },
    //     answerSuggestion (state, vertexId) {
    //       state.answeredSuggestions.push(vertexId)
    //     },
    //     withdrawSuggestion (state, vertexId) {
    //       state.answeredSuggestions.splice(state.answeredSuggestions.indexOf(vertexId), 1)
    //     },
    //     clean (state) {
    //       state.answeredQuestions = []
    //       state.answeredSuggestions = []
    //     }
    //   }
    // })

    // WandererSingleton.on('truncate', function() {
    //   WandererStoreSingleton.store.commit('wanderer/plugin-question/clean')
    // })

    var traversalResult = {}
    var questionsInSections = {}

    // Register the section vertex
    WandererSingleton.registerVertexCollection({
      name: 'section',
      builder: {
        label: 'Section',
        color: '#6C757D',
        cytoscapeClasses: 'section',
        cytoscapeCxtMenuSelector: '.section',
        showInCxtMenu: false,
        creatable: true,
        defaultFields: {
          title: {
            en: 'New section',
            de: 'Neue Section'
          }
        },
        cytoscapeStyles: [{
          selector: '.section',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#6C757D',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-section-editor'
      },
      lifecycleData: {
        finished: {
          label: 'Section finished',
          exposeDefault: false
        }
      },
      toCytoscape: function(data, language){
        if(data.title[language]){
          return {
            label: data.title[language]+(debug? ' ('+data._id+')':'')
          }
        }
        return {
          label: 'Section'
        }
      },
      edgeConditions: {
        finished: {
          label: 'finished',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData != undefined){
              if(vertexLifecycleData.finished){
                return true;
              }
            }
            return false;
          }
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {
        // Add this section to the found sections
        if(questionsInSections[cytoscapeVertex.id()] === undefined) {
          questionsInSections[cytoscapeVertex.id()] = [];
        }
      },
      finisher: function (cytoscapeVertex, vertexData) {
        // If we do not have any unanswered questions in this section...
        if(questionsInSections[cytoscapeVertex.id()].length===0) {
          // Send the finished statement to the root node
          WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
            id: cytoscapeVertex.id(),
            key: 'finished',
            value: true
          })
        }
      }
    })

    // Register the question vertex
    WandererSingleton.registerVertexCollection({
      name: 'question',
      builder: {
        label: 'Question',
        color: '#007BFF',
        cytoscapeClasses: 'question',
        cytoscapeCxtMenuSelector: '.question',
        showInCxtMenu: true,
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
      toCytoscape: function(data, language){
        if(data.question[language]){
          return {
            label: data.question[language]+(debug? ' ('+data._id+')':'')
          }
        }
        return {
          label: 'Question'
        }
      },
      edgeConditions: {
        answered: {
          default: true,
          label: 'answered',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData!=undefined && vertexLifecycleData.answered) {
              return true;
            }
            return false;
          }
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {
        // Add the question only to result if it was not answered before
        if(
          !WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()] ||
          WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()].answered !== true) {

          // Add only the first found question
          // Other occurances of questions in the traversal should be skipped
          // We want only ask one question
          if(traversalResult.firstFoundQuestionId === undefined) {

            traversalResult.firstFoundQuestionId = cytoscapeVertex.id()
            // traversalResult.firstFoundSuggestionIds = []
            // Find and add suggestions to result
            // let cytoscapeEdges = cytoscapeVertex.connectedEdges()
            // cytoscapeEdges.forEach(function(cytoscapeEdge){
            //   let currentEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[cytoscapeEdge.id()]
            //   if(
            //     cytoscapeVertex.id()==cytoscapeEdge.data('source') && // If this is an outbound edge
            //     currentEdgeData._collection=='isAnswerableBy' // If this edge is of the type isAnswerableBy
            //   ){
            //     traversalResult.firstFoundSuggestionIds.push(cytoscapeEdge.target().id()) // Add the target vertex (suggestion)
            //   }
            // })
          }

          // Also add this unanswered question to every entered section
          for (var key in questionsInSections) {
            if(questionsInSections.hasOwnProperty(key)){
              questionsInSections[key].push(cytoscapeVertex.id());
            }
          }

        }

      },
      expander: function (cytoscapeVertex, vertexData, outboundCyEdges) {

        let returnEdges = []

        // Iterate over the outbound cytoscape edges
        outboundCyEdges.forEach(function(outboundCyEdge) {
          // let targetVertex = outboundCyEdge.target()
          // let targetVertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[targetVertex.id()]

          // If the target node is a suggestion
          // if(targetVertexData['_collection']=='suggestion'){
            returnEdges.push(outboundCyEdge)
          // }

          // else{
          //   // Push the edge only if the question was answered
          //   if(WandererStoreSingleton.store.state.wanderer['plugin-question'].answeredQuestions.indexOf(cytoscapeVertex.id())!=-1){
          //     returnEdges.push(outboundCyEdge)
          //   }
          // }

        })

        return returnEdges
      },
      finisher: function () {
        // // console.log('asking the question finisher')
        // if(
        //   traversalResult.firstFoundQuestionId === undefined // If no question was found
        //   // || traversalResult.firstFoundSuggestionIds.length == 0 // Or if the question has no suggestions
        // ){
        //   return true
        // }
        // return false
      }
    })

    // Register the suggestion vertex
    WandererSingleton.registerVertexCollection({
      name: 'suggestion',
      builder: {
        label: 'Suggestion',
        color: '#28A745',
        cytoscapeClasses: 'suggestion',
        cytoscapeCxtMenuSelector: '.suggestion',
        showInCxtMenu: true,
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
      edgeConditions: {
        answered: {
          default: true,
          label: 'answered',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData!=undefined && vertexLifecycleData.answered) {
              return true
            }
            return false
          }
        },
        notAnswered: {
          label: 'not answered',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData!=undefined) {
              if(vertexLifecycleData.answered) {
                return false
              }
              return true
            }
            return false
          }
        }
      },
      lifecycleData: {
        value: {
          label: 'Value',
          exposeDefault: true
        }
      },
      toCytoscape: function(data, language) {
        var varname = '';
        if(data.name){
          varname = ' ('+data.name+')';
        }
        var label = 'Suggestion'+varname
        if(data.suggestion[language]) {
          label = data.suggestion[language]+varname
        }
        var priority = data['priority'];
        if (priority < 10) {
          priority = 10
        }
        priority = priority + 'px'
        return {
          label: label+(debug? ' ('+data._id+')':''),
          priority: priority
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

      },
      expander: function (cytoscapeVertex, currentVertexData, outboundCyEdges) {
        let returnEdges = []

        // Iterate over he outbound cytoscape edges
        outboundCyEdges.forEach(function(outboundCyEdge) {

          // Push the edge only if the suggestion was answered
          // if(WandererStoreSingleton.store.state.wanderer['plugin-question'].answeredSuggestions.indexOf(cytoscapeVertex.id())!=-1){
            returnEdges.push(outboundCyEdge)
          // }

        })

        return returnEdges
      }
    })

    // Register the isAnswerableBy edge
    WandererSingleton.registerEdgeCollection({
      name: 'isAnswerableBy',
      builder: {
        label: 'isAnswerableBy',
        cytoscapeClasses: 'isAnswerableBy',
        creatable: true,
        defaultFields: function (fromVertexCollection, toVertexCollection) {
          return {
            priority: 25
          }
        },
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
            'width': 'data(priority)',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-is-answerable-by-editor'
      },
      toCytoscape: function(data){

        var priority = data['priority'] / 5;
        if (priority < 1) {
          priority = 1
        }

        return {
          // label: data._id,
          priority: priority
        }
      },
    })

    var lastAddedQuestion = false;

    // Listen for traversal event
    WandererSingleton.on('traversalFinished', function() {

      if(
        traversalResult.firstFoundQuestionId !== undefined //&& // We need a question
      ) {

        // Add question only to message stack if it was not added already directly before
        if(lastAddedQuestion != traversalResult.firstFoundQuestionId) {
          lastAddedQuestion = traversalResult.firstFoundQuestionId

          WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
            // id: traversalResult.firstFoundQuestionId,
            component: 'wanderer-question-message',
            vertexId: traversalResult.firstFoundQuestionId,
            backgroundColor: '#007BFF',
            delay: 1000
          })
        }

      }

      // Reset the result object
      traversalResult = {}

      // Reset the questions in sections
      questionsInSections = {}

    })

    WandererSingleton.on('truncate', function() {
      traversalResult = {}
      questionsInSections = {}
      lastAddedQuestion = false

    })

  }

}
