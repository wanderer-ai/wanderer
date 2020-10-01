import QuestionEditor from './components/QuestionEditor.vue'
import SuggestionEditor from './components/SuggestionEditor.vue'
import QuestionInteraction from './components/QuestionInteraction.vue'
import SuggestionMessage from './components/SuggestionMessage.vue'
import IsAnswerableByEditor from './components/IsAnswerableByEditor.vue'
import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-question-editor', QuestionEditor)
    Vue.component('wanderer-suggestion-editor', SuggestionEditor)
    Vue.component('wanderer-question-interaction', QuestionInteraction)
    Vue.component('wanderer-suggestion-message', SuggestionMessage)
    Vue.component('wanderer-is-answerable-by-editor', IsAnswerableByEditor)

    var debug = false

    // var typingTimeouts = {}
    // var questionFoundUnansweredBefore = false

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
        restrictPossibleChildren: [
          'suggestion'
        ],
        defaultFields: {
          question: {
            en: 'New question',
            de: 'Neue Frage'
          }
        },
        cytoscapeStyles: [
          {
            selector: '.question',
            style: {
              'height': '100px',
              'width': '100px',
              'font-size': '20px',
              'background-color': '#007BFF',
              'label': 'data(label)'
            }
          },
          {
            selector: '.question:parent',
            style:{
                'shape': 'roundrectangle',
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
          return 'Section'
        },
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
      lifecycleData: {
        // sent: {
        //   label: 'sent',
        //   exposeDefault: false
        // },
        answered: {
          label: 'read',
          exposeDefault: true
        },
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
        },
        // sent: {
        //   default: false,
        //   label: 'sent',
        //   condition: function (vertexLifecycleData) {
        //     if(vertexLifecycleData!=undefined && vertexLifecycleData.sent) {
        //       return true;
        //     }
        //     return false;
        //   }
        // }
      },
      edgeMethods: {
        reset: {
          label: 'Reset message',
          method: (cytoscapeVertex, vertexData) => {

            // Clear the typing timeout
            // if(typingTimeouts[cytoscapeVertex.id()] !== undefined) {
            //   clearTimeout(typingTimeouts[cytoscapeVertex.id()]);
            //   delete typingTimeouts[cytoscapeVertex.id()];
            // }

            // Reset the lifecycle data
            // WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', false)
            WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'answered', false)

            // Reset all suggestions
            var childrens = cytoscapeVertex.outgoers('.suggestion');
            childrens.forEach(function(child) {
              WandererSingleton.setLifecycleValue(child.id(), 'answered', false)
            })

          }
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        // Add the question only to result if it was not answered before
        if(!WandererSingleton.getLifecycleValue(cytoscapeVertex.id(), 'answered')) {

          // If no other unanswered question was found in traversal before...
          // We want ask all questions after another and not all at the same time
          //if(!questionFoundUnansweredBefore) {

            // I am the question that will now block all other remaining questions until I am answered
            // questionFoundUnansweredBefore = true

            // // Add the question only, if it was not already sent before
            // if(!WandererSingleton.getLifecycleValue(cytoscapeVertex.id(), 'sent')) {
            //
            //   // if this message is currently not typing
            //   if(typingTimeouts[cytoscapeVertex.id()] === undefined) {

                // Send a typing signal to the chat
                // WandererStoreSingleton.store.dispatch('wanderer/chat/setTyping', 1000)

                // Now send the message after a while
                // And set the timeout
                //(function(vertexId) {

                // typingTimeouts[cytoscapeVertex.id()] = setTimeout(()=>{

                  // Push the question to the chat
                  WandererStoreSingleton.store.commit('wanderer/chat/addInteraction', {
                    component: 'wanderer-question-interaction',
                    vertexId: cytoscapeVertex.id()
                  })

                  // WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', true)

                  // Remove the message from the typing object
                  // delete typingTimeouts[cytoscapeVertex.id()]

                // }, 1000)

                //})(cytoscapeVertex.id())

            //   }
            // }
          //}
        }
      },
      expander: function (cytoscapeVertex, vertexData, outboundCyEdges) {
        return outboundCyEdges
      },
      childExpander: function (cytoscapeVertex, vertexData, children) {
        return children
      },
      parentFinisher: function (vertexLifecycleData) {
        if(vertexLifecycleData!=undefined && vertexLifecycleData.answered) {
          return true;
        }
        return false;
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
          // {
          //   from: 'question',
          //   through: 'isAnswerableBy'
          // }
        ],
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
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-suggestion-editor',
        canBeChild: true
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
      edgeMethods: {
        reset: {
          label: 'Reset suggestion',
          method: (cytoscapeVertex, vertexData) => {

            WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'answered', false)

          }
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
    // WandererSingleton.registerEdgeCollection({
    //   name: 'isAnswerableBy',
    //   builder: {
    //     label: 'isAnswerableBy',
    //     cytoscapeClasses: 'isAnswerableBy',
    //     creatable: true,
    //     defaultFields: function (fromVertexCollection, toVertexCollection) {
    //       return {
    //         priority: 25
    //       }
    //     },
    //     restrictSourceVertices: [
    //       'question'
    //     ],
    //     restrictTargetVertices: [
    //       'suggestion'
    //     ],
    //     cytoscapeStyles: [{
    //       selector: '.isAnswerableBy',
    //       style: {
    //         'line-color': '#28A745',
    //         'target-arrow-color': '#28A745',
    //         'source-arrow-color': '#28A745',
    //         'width': 'data(priority)',
    //         'label': 'data(label)'
    //       }
    //     }],
    //     component: 'wanderer-is-answerable-by-editor'
    //   },
    //   toCytoscape: function(data){
    //
    //     var priority = data['priority'] / 5;
    //     if (priority < 1) {
    //       priority = 1
    //     }
    //
    //     return {
    //       // label: data._id,
    //       priority: priority
    //     }
    //   },
    // })

    // Listen for traversal event
    WandererSingleton.on('traversalStart', function() {

      // questionFoundUnansweredBefore = false;

      WandererStoreSingleton.store.commit('wanderer/chat/cleanInteractions')


    })

    // Listen for traversal event
    WandererSingleton.on('traversalFinished', function() {

      // questionFoundUnansweredBefore = false;

      // WandererStoreSingleton.store.commit('wanderer/chat/cleanInteractions')


    })

    WandererSingleton.on('truncate', function() {

      // questionFoundUnansweredBefore = false

      // Clear all timeouts
      // for (i in typingTimeouts) {
      //   if(typingTimeouts.hasOwnProperty(i)) {
      //     clearTimeout(typingTimeouts[i]);
      //     delete typingTimeouts[i]
      //   }
      // }

    })

  }

}
