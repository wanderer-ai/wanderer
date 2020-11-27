import QuestionEditor from './components/QuestionEditor.vue'
import SuggestionEditor from './components/SuggestionEditor.vue'
import QuestionInteraction from './components/QuestionInteraction.vue'
import SuggestionMessage from './components/SuggestionMessage.vue'
import QuestionMessage from './components/QuestionMessage.vue'
import IsAnswerableByEditor from './components/IsAnswerableByEditor.vue'

export default {
  install (wanderer) {

    // Require some dependencys from wanderer
    var Vue = wanderer.require('vue')
    var builder = wanderer.require('builder')
    var store = wanderer.require('store')
    var worker = wanderer.require('worker')

    // Register vue components
    Vue.component('wanderer-question-editor', QuestionEditor)
    Vue.component('wanderer-suggestion-editor', SuggestionEditor)
    Vue.component('wanderer-question-interaction', QuestionInteraction)
    Vue.component('wanderer-suggestion-message', SuggestionMessage)
    Vue.component('wanderer-question-message', QuestionMessage)
    Vue.component('wanderer-is-answerable-by-editor', IsAnswerableByEditor)

    // Add a separate store module for some question data
    store.registerModule('wandererQuestion', {
      namespaced: true,
      state: {
        suggestions: {}
      },
      mutations: {
        addSuggestions (state, {questionId, suggestionIds}) {
          // Add suggestion array
          if(state.suggestions[questionId] == undefined) {
            this._vm.$set(state.suggestions, questionId, [])
          }
          this._vm.$set(state.suggestions, questionId, suggestionIds)
        },
        truncate (state) {
          this._vm.$set(state, 'suggestions', {})
        }
      }
    })

    // Set debug mode for this plugin
    var debug = false

    // Register some vertices for the builder
    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'question',
      props: {
        builder: {
          label: 'Question',
          color: '#28A745',
          cytoscapeClasses: 'question',
          cytoscapeCxtMenuSelector: '.question',
          appendableViaCxtMenu: true,
          injectableViaCxtMenu: true,
          ctxMenuAllowedEdge: 'leadsTo',
          creatable: true,
          restrictPossibleChildren: [
            'suggestion'
          ],
          defaultFields: {
            question: {
              en: 'New question',
              de: 'Neue Frage'
            },
            hideMessages: false,
            showInNavigation: false
          },
          cytoscapeStyles: [
            {
              selector: '.question',
              style: {
                // 'shape': 'round-rectangle',
                'height': '100px',
                'width': '100px',
                'font-size': '30px',
                // 'background-opacity': 0,
                'background-color': '#28A745',
                'border-color': '#28A745',
                'border-width': '20px',
                'label': 'data(label)'
              }
            },
            {
              selector: '.question:parent',
              style:{
                'background-opacity': 0,
                'background-color': '#fff',
                // 'shape': 'roundrectangle',
                'border-color': '#28A745',
                'padding': '50px'
              },
            }
          ],
          component: 'wanderer-question-editor',
          canBeChild: true,
          canBeParent: true,
          parentLabel: (data, language) => {
            if(data.question[language]) {
              return data.question[language]+(debug? ' ('+data._id+')':'')
            }
            return 'Question'
          },
          toCytoscape: function(vertexData, language) {
            if(vertexData.has('question.'+language)) {
              return {
                label: vertexData.get('question.'+language)+(debug?' '+vertexData.get('_id'):'')
              }
            }
            return {
              label: 'Question'+(debug?' '+vertexData.get('_id'):'')
            }
          },
          lifecycleData: {
            answered: {
              label: 'read',
              exposeDefault: true
            }
          }
        }
      }
    })

    // Add the suggestion vertex to the builder
    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'suggestion',
      props: {
        builder: {
          label: 'Suggestion',
          color: '#28A745',
          cytoscapeClasses: 'suggestion',
          cytoscapeCxtMenuSelector: '.suggestion',
          ctxMenuAllowedEdge: 'isAnswerableBy',
          appendableViaCxtMenu: true,
          injectableViaCxtMenu: true,
          creatable: true,
          // restrictIncommingConnections: [
          //   // {
          //   //   from: 'question',
          //   //   through: 'isAnswerableBy'
          //   // }
          // ],
          restrictPossibleParents: [
            'question'
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
              'border-color': '#28A745',
              'border-width': '5px',
              'label': 'data(label)'
            }
          }],
          component: 'wanderer-suggestion-editor',
          canBeChild: true,
          toCytoscape: function(vertexData, language) {
            var varname = ''
            if(vertexData.has('name')){
              varname = ' ('+vertexData.get('name')+')'
            }
            var label = 'Suggestion'+varname
            if(vertexData.has('suggestion.'+language)) {
              label = vertexData.get('suggestion.'+language)+varname
            }
            var priority = vertexData.get('priority')
            if (priority < 10) {
              priority = 10
            }
            priority = priority + 'px'
            return {
              label: label+(debug? ' ('+vertexData.get('_id')+')':''),
              priority: priority
            }
          },
          lifecycleData: {
            value: {
              label: 'Value',
              exposeDefault: true
            }
          }
        }
      }
    })

    wanderer.subscriber.emit('addEdgeCollectionProps', {
      name: 'isAnswerableBy',
      props: {
        builder: {
          label: 'is answerable by',
          cytoscapeClasses: 'isAnswerableBy',
          creatable: true,
          defaultFields: function (fromVertexCollection, toVertexCollection) {
            return {

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
              // 'display': 'none',
              'line-color': '#28A745',
              'target-arrow-color': '#28A745',
              'source-arrow-color': '#28A745',
              // 'width': 'data(priority)',
              // 'label': 'data(label)'
            }
          }],
          component: 'wanderer-is-answerable-by-editor'
        }
      }
    })

    // Listen to worker events
    worker.addEventListener('message', function(e) {
      switch(e.data.event) {
        case 'truncate':
          store.commit('wandererQuestion/truncate')
          break;
        case 'sendInteractionQuestions':

          var foundQuestions = e.data.payload

          // Clear the current interactions from the chat
          store.commit('wandererChat/cleanInteractions')

          // Remove the suggestions
          // Because maybe some have been removed or blocked
          store.commit('wandererQuestion/truncate')

          // Add all found interactions and suggestions
          for (let q in e.data.payload) {

            // If suggestions was found for this interaction
            if(foundQuestions[q].length) {

              // Push the question to the chat
              store.commit('wandererChat/addInteraction', q)

              // Add the vertexId to the question/suggestions store
              store.commit('wandererQuestion/addSuggestions', {
                questionId: q,
                suggestionIds: foundQuestions[q]
              })

            }

          }

          break;
      }
    }, false)

  }
}