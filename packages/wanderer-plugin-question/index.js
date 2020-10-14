import QuestionEditor from './components/QuestionEditor.vue'
import SuggestionEditor from './components/SuggestionEditor.vue'
import QuestionInteraction from './components/QuestionInteraction.vue'
import SuggestionMessage from './components/SuggestionMessage.vue'
import QuestionMessage from './components/QuestionMessage.vue'
import IsAnswerableByEditor from './components/IsAnswerableByEditor.vue'
import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-question-editor', QuestionEditor)
    Vue.component('wanderer-suggestion-editor', SuggestionEditor)
    Vue.component('wanderer-question-interaction', QuestionInteraction)
    Vue.component('wanderer-suggestion-message', SuggestionMessage)
    Vue.component('wanderer-question-message', QuestionMessage)
    Vue.component('wanderer-is-answerable-by-editor', IsAnswerableByEditor)

    // Add a separate store module
    WandererStoreSingleton.store.registerModule(['wanderer', 'question'], {
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

    var debug = false

    // Define some variables for collecting some data while traversing
    var foundQuestions = {}
    // var resetQuestions = []

    // Register the question vertex
    WandererSingleton.registerVertexCollection({
      name: 'question',
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
          drawAttention: true,
          smallButtons: false
        },
        cytoscapeStyles: [
          {
            selector: '.question',
            style: {
              'shape': 'round-rectangle',
              'height': '150px',
              'width': '150px',
              'font-size': '30px',
              'background-opacity': 0,
              'background-color': '#fff',
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
        notAnswered: {
          default: false,
          label: 'not answered',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData!=undefined && vertexLifecycleData.answered) {
              return false;
            }
            return true;
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
      // edgeMethods: {
      //   reset: {
      //     label: 'Reset question',
      //     method: (cytoscapeVertex, vertexData) => {
      //
      //
      //
      //     }
      //   }
      // },
      // lifecycleData: {
      //   value: {
      //     label: 'Values',
      //     exposeDefault: true
      //   }
      // },
      becomeReachable: function (cytoscapeVertex) {

        // console.log('become reachable')

        // Its not a good Idea to reset the question directly inside the flow
        // We should store this reset request for later and should execute it if the traversal has finished
        // The reason is, that the question will start to blink if it resets itself for example
        // This can happen, if other questions leads to this question
        // This is ok because the interactions will be pushed to the interface at traversal end too
        // resetQuestions.push(cytoscapeVertex)

        // Reset the lifecycle data
        // WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', false)
        WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'answered', false)

        // Reset all suggestions
        var children = cytoscapeVertex.children('.suggestion');
        children.forEach(function(child) {
          WandererSingleton.setLifecycleValue(child.id(), 'answered', false)
        })

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

                  // Add the query to the traversal result
                  foundQuestions[cytoscapeVertex.id()] = []

                  // Push the question to the chat
                  // WandererStoreSingleton.store.commit('wanderer/chat/addInteraction', {
                  //   component: 'wanderer-question-interaction',
                  //   vertexId: cytoscapeVertex.id()
                  // })

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

        let returnEdges = []

        // Iterate over the outbound cytoscape edges
        outboundCyEdges.forEach(function(outboundCyEdge) {

          // Get the data for each edge
          let outboundEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[outboundCyEdge.id()]

          if(outboundEdgeData._collection == 'isAnswerableBy') {

            // We want now merge the outgoing edges of each conneced suggestion to create a super vertex
            // So lets get the Id of the target node
            let suggestionNode = outboundCyEdge.target()

            // Get the suggestion data
            let suggestionVertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[suggestionNode.id()]

            if (WandererSingleton.isVertexTraversable(suggestionNode, suggestionVertexData)) {

              // Now for this target get all outbound edges
              var outgoingChildEdges = WandererSingleton.getOutboundCytoscapeEdges(suggestionNode)
              for(let i in outgoingChildEdges) {
                if(WandererSingleton.isEdgeTraversable(outgoingChildEdges[i], suggestionNode)) {
                  returnEdges.push(outgoingChildEdges[i])
                }
              }


              // returnEdges = returnEdges.concat(WandererSingleton.getOutboundCytoscapeEdges(suggestionNode))

              // Remember the suggestion Vertex as visited (Do not create infinite circles)
              // WandererStoreSingleton.store.commit('wanderer/rememberTraversedVertex', suggestionNode.id())

              // Add this suggestion to question result
              if(foundQuestions[cytoscapeVertex.id()]) {
                foundQuestions[cytoscapeVertex.id()].push(suggestionNode.id())
              }

              // Add the vertexId to the question/suggestions store
              // WandererStoreSingleton.store.commit('wanderer/question/addSuggestion', {
              //   questionId: cytoscapeVertex.id(),
              //   suggestionId: suggestionNode.id()
              // })
            }

          } else {
            returnEdges.push(outboundCyEdge)
          }

          // Push the edge only if the suggestion was answered
          // if(WandererStoreSingleton.store.state.wanderer['plugin-question'].answeredSuggestions.indexOf(cytoscapeVertex.id())!=-1){
            returnEdges.push(outboundCyEdge)
          // }

        })

        return returnEdges

        return outboundCyEdges
      },
      // childExpander: function (cytoscapeVertex, vertexData, children) {
      //   return children
      // },
      // sectionFinisher: function (vertexLifecycleData) {
      //   if(vertexLifecycleData!=undefined && vertexLifecycleData.answered) {
      //     return true;
      //   }
      //   return false;
      // }
    })

    // Register the suggestion vertex
    WandererSingleton.registerVertexCollection({
      name: 'suggestion',
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
      // edgeMethods: {
      //   reset: {
      //     label: 'Reset suggestion',
      //     method: (cytoscapeVertex, vertexData) => {
      //
      //       WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'answered', false)
      //
      //     }
      //   }
      // },
      becomeReachable: function (cytoscapeVertex, vertexData) {

        WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'answered', false)

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
        // Never expand your edges singe the question vertex will do this within its own expander
        return []
      }
    })

    // Register the isAnswerableBy edge
    WandererSingleton.registerEdgeCollection({
      name: 'isAnswerableBy',
      builder: {
        label: 'is answerable by',
        cytoscapeClasses: 'isAnswerableBy',
        creatable: true,
        defaultFields: function (fromVertexCollection, toVertexCollection) {
          return {
            // priority: 25
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
            'display': 'none',
            'line-color': '#28A745',
            'target-arrow-color': '#28A745',
            'source-arrow-color': '#28A745',
            // 'width': 'data(priority)',
            // 'label': 'data(label)'
          }
        }],
        component: 'wanderer-is-answerable-by-editor'
      },
      // isChildEdge: true,
      // toCytoscape: function(data){
      //
      //   return {
      //     // label: data._id,
      //     // priority: priority
      //   }
      // },
      afterCreate: (cytoscapeEdge, data) => {
        // Move the target to the source node
        cytoscapeEdge.target().move({
          parent: cytoscapeEdge.source().id()
        });
      },
      beforeRemove: (cytoscapeEdge) => {
        // Move the node out of its parent
        // console.log('unlink')
        cytoscapeEdge.target().move({
          parent: null
        });
      }
    })

    // Listen for traversal fineshed event
    WandererSingleton.on('traversalFinished', function() {

      // Clear the current interactions from the chat
      WandererStoreSingleton.store.commit('wanderer/chat/cleanInteractions')

      // Remove the suggestions
      // Because maybe some have been removed or blocked
      WandererStoreSingleton.store.commit('wanderer/question/truncate')

      // Add all found suggestions
      for (let q in foundQuestions) {
        if(foundQuestions.hasOwnProperty(q)) {

          // If suggestions was found for this interaction
          if(foundQuestions[q].length) {


            // Push the question to the chat
            WandererStoreSingleton.store.commit('wanderer/chat/addInteraction', {
              component: 'wanderer-question-interaction',
              vertexId: q
            })

            // Add the vertexId to the question/suggestions store
            WandererStoreSingleton.store.commit('wanderer/question/addSuggestions', {
              questionId: q,
              suggestionIds: foundQuestions[q]
            })

          }

        }
      }

      // Reset the result object
      foundQuestions = {}

      // // Reset questions
      // for(var cytoscapeVertex of resetQuestions) {
      //   // Reset the lifecycle data
      //   // WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', false)
      //   WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'answered', false)
      //
      //   // Reset all suggestions
      //   var children = cytoscapeVertex.children('.suggestion');
      //   children.forEach(function(child) {
      //     WandererSingleton.setLifecycleValue(child.id(), 'answered', false)
      //   })
      // }

      // Reset the reset questions
      // resetQuestions = []

    })

    // On truncate event
    WandererSingleton.on('truncate', function () {
      // Truncate the question store
      WandererStoreSingleton.store.commit('wanderer/question/truncate')
      // Reset the reset questions
      // resetQuestions = []
      // Reset the result object
      foundQuestions = {}
    })

  }

}
