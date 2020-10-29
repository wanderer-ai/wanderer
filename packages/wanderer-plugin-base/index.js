// import Editor from './components/Editor.vue'
import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'
import WandererCsytoscapeSingleton from 'wanderer-cytoscape-singleton'

// import SectionEditor from './components/SectionEditor.vue'
import FlowEditor from './components/FlowEditor.vue'
import MessageEditor from './components/MessageEditor.vue'
import LeadsToEditor from './components/LeadsToEditor.vue'
import Message from './components/Message.vue'

export default {

  install (Vue) {

    // Vue.component('wanderer-section-editor', SectionEditor)
    Vue.component('wanderer-flow-editor', FlowEditor)
    Vue.component('wanderer-leads-to-editor', LeadsToEditor)
    Vue.component('wanderer-message-editor', MessageEditor)
    Vue.component('wanderer-message', Message)

    var debug = false

    // Define a few traversal variables
    var traversedRequiredEdgeIds = []
    var traversedForbiddenEdgeIds = []
    var lastTraversedForbiddenEdgeIds = []
    var typingTimeouts = {}
    // var resetMessages = []
    // var resetSections = []

    WandererSingleton.registerVertexCollection({
      name: 'flow',
      builder: {
        label: 'Flow',
        color: '#FEC106',
        cytoscapeClasses: 'flow',
        cytoscapeCxtMenuSelector: '.flow',
        creatable: false,
        defaultFields: {
          name: 'flow'
        },
        cytoscapeStyles: [{
          selector: '.flow',
          style: {
            'height': '200px',
            'width': '200px',
            'font-size': '30px',
            'background-color': '#FEC106',
            'border-color': '#FEC106',
            'border-width': '5px',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-flow-editor'
      },
      toCytoscape: function(data, language) {
        if(data.topic[language]){
          return {
            label: data.topic[language]+(debug?' '+data._id:'')
          }
        }
        return {
          label: 'Flow'+(debug?' '+data._id:'')
        }
      },
      // edgeMethods: {
      //   // reset: {
      //   //   label: 'Reset flow',
      //   //   method: (cytoscapeVertex, vertexData) => {
      //   //
      //   //     WandererStoreSingleton.store.commit('wanderer/cleanVertexLifecycleData')
      //   //     WandererSingleton.trigger('truncate')
      //   //
      //   //   }
      //   // }
      // },
      visitor: function (cytoscapeVertex, vertexData, language) {
        // flowVertexId = cytoscapeVertex.id()
      }

    })


    // // Register the section vertex
    // WandererSingleton.registerVertexCollection({
    //   name: 'section',
    //   builder: {
    //     label: 'Section',
    //     color: '#cccccc',
    //     cytoscapeClasses: 'section',
    //     cytoscapeCxtMenuSelector: '.section',
    //     appendableViaCxtMenu: true,
    //     injectableViaCxtMenu: false,
    //     creatable: true,
    //     defaultFields: {
    //       title: {
    //         en: 'New section',
    //         de: 'Neue Section'
    //       }
    //     },
    //     cytoscapeStyles: [
    //       {
    //         selector: '.section',
    //         style: {
    //           'shape': 'round-rectangle',
    //           'height': '150px',
    //           'width': '150px',
    //           'font-size': '30px',
    //           'background-color': '#cccccc',
    //           'border-color': '#cccccc',
    //           'border-width': '5px',
    //           'label': 'data(label)'
    //         }
    //       },
    //       {
    //         selector: '.section:parent',
    //         style:{
    //           'background-opacity': 0,
    //           'background-color': '#fff',
    //           // 'shape': 'roundrectangle',
    //           'border-color': '#cccccc',
    //           'padding': '100px'
    //         },
    //       }
    //     ],
    //     component: 'wanderer-section-editor',
    //     canBeParent: true,
    //     canBeChild: false,
    //     parentLabel: (data, language) => {
    //       if(data.title[language]) {
    //         return data.title[language]+(debug? ' ('+data._id+')':'')
    //       }
    //       return 'Section'
    //     },
    //   },
    //   lifecycleData: {
    //     finished: {
    //       label: 'Section finished',
    //       exposeDefault: false
    //     }
    //   },
    //   toCytoscape: (data, language) => {
    //     if(data.title[language]) {
    //       return {
    //         label: data.title[language]+(debug? ' ('+data._id+')':'')
    //       }
    //     }
    //     return {
    //       label: 'Section'
    //     }
    //   },
    //   edgeConditions: {
    //     finished: {
    //       default: true,
    //       label: 'finished',
    //       condition: (vertexLifecycleData) => {
    //         if(vertexLifecycleData != undefined) {
    //           if(vertexLifecycleData.finished) {
    //             return true;
    //           }
    //         }
    //         return false;
    //       }
    //     }
    //   },
    //   edgeMethods: {
    //     reset: {
    //       label: 'Reset section',
    //       method: (cytoscapeVertex, vertexData) => {
    //
    //         // Its not a good Idea to reset the node directly inside the flow
    //         // We should store this reset request for later and should execute it if the traversal has finished
    //         // The reason is, that the node will start to blink if it resets itself for example
    //         // This can happen, if other nodes leads to this node
    //         resetSections.push(cytoscapeVertex)
    //
    //       }
    //     }
    //   },
    //   testVisitor: (cytoscapeVertex, vertexData, language) => {
    //
    //     let conditionsFullfilled = true;
    //
    //     // Find all child elements
    //     // Now for this target get all outbound edges
    //     let outboundCyEdges = WandererSingleton.getOutboundCytoscapeEdges(cytoscapeVertex)
    //     outboundCyEdges.forEach((outboundCyEdge) => {
    //
    //       // Get the data for each edge
    //       let outboundEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[outboundCyEdge.id()]
    //
    //       // If the child is connected via a watch edge...
    //       if(outboundEdgeData._collection == 'watch') {
    //
    //         // Get the child node
    //         let child = outboundCyEdge.target()
    //
    //         // Find the default edgeCondition for this vertex
    //         // Todo: Move this into the Wanderer core
    //         // Also this function is similar to the one defined in wanderer-plugin-base (checking the edges)
    //         let collection = WandererSingleton.getVertexCollectionById(child.id())
    //         if(collection.sectionFinisher !== undefined) {
    //           let vertexLifecycleData = WandererSingleton.getLifecycleData(child.id())
    //           if(!collection.sectionFinisher(vertexLifecycleData)) {
    //             conditionsFullfilled = false;
    //           }
    //         }
    //
    //       }
    //
    //     })
    //
    //     // Mark this section as finished
    //     if(conditionsFullfilled) {
    //       WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'finished', true)
    //     }
    //
    //   },
    //   expander: (cytoscapeVertex, currentVertexData, outboundCyEdges) => {
    //     let returnEdges = []
    //
    //     // For each outgoing edges
    //     outboundCyEdges.forEach((outboundCyEdge) => {
    //
    //       // Get the data for each edge
    //       let outboundEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[outboundCyEdge.id()]
    //
    //       // If this is not a watch edge...
    //       if(outboundEdgeData._collection != 'watch') {
    //         returnEdges.push(outboundCyEdge)
    //       }
    //
    //     })
    //
    //     return returnEdges
    //   }
    //
    // })

    WandererSingleton.registerVertexCollection({
      name: 'message',
      builder: {
        label: 'Message',
        color: '#007BFF',
        cytoscapeClasses: 'message',
        cytoscapeCxtMenuSelector: '.message',
        creatable: true,
        appendableViaCxtMenu: true,
        injectableViaCxtMenu: true,
        ctxMenuAllowedEdge: 'leadsTo',
        defaultFields: {
          message: {
            en: 'New message',
            de: 'Neue Nachricht'
          }
        },
        cytoscapeStyles: [{
          selector: '.message',
          style: {
            // 'shape': 'round-rectangle',
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#007BFF',
            'border-color': '#007BFF',
            'border-width': '5px',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-message-editor',
        canBeChild: true
      },
      lifecycleData: {
        sent: {
          label: 'sent',
          exposeDefault: false
        }
      },
      edgeConditions: {
        sent: {
          default: true,
          label: 'sent',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData!=undefined && vertexLifecycleData.sent) {
              return true;
            }
            return false;
          }
        }
      },
      // edgeMethods: {
      //   reset: {
      //     label: 'Reset message',
      //     method: (cytoscapeVertex, vertexData) => {
      //
      //       // Its not a good Idea to reset the node directly inside the flow
      //       // We should store this reset request for later and should execute it if the traversal has finished
      //       // The reason is, that the node will start to blink if it resets itself for example
      //       // This can happen, if other nodes leads to this node
      //       resetMessages.push(cytoscapeVertex)
      //
      //     }
      //   }
      // },
      becomeReachable: function (cytoscapeVertex, vertexData) {

        WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', false)

      },
      toCytoscape: function(data, language){
        if(data.message[language]){
          return {
            label: data.message[language]+(debug?' '+data._id:'')
          }
        }
        return {
          label: 'Message'+(debug?' '+data._id:'')
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        // If this message was not send before
        if(!WandererSingleton.getLifecycleValue(cytoscapeVertex.id(), 'sent')) {

          // if this message is currently not typing
          if(typingTimeouts[cytoscapeVertex.id()] === undefined) {

            // Send a typing signal to the chat
            WandererStoreSingleton.store.dispatch('wanderer/chat/setTyping', 1000)

            // Now send the message after a while
            // And set the timeout
            typingTimeouts[cytoscapeVertex.id()] = setTimeout(()=>{

              // Get the message text
              var text = WandererSingleton.markdown2html(WandererSingleton.evaluateVertexTemplate(WandererSingleton.getTranslatableVertexValue(cytoscapeVertex.id(), 'message'), cytoscapeVertex.id()))

              // Push the message to the chat
              WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
                component: 'wanderer-message',
                backgroundColor: '#6C757D',
                vertexId: cytoscapeVertex.id(),
                text: text
              })

              // Remember the message now as sent
              WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', true)

              // Remove the message from the typing object
              delete typingTimeouts[cytoscapeVertex.id()]

            }, 1000)

          }

        }

      },
      // sectionFinisher: function (vertexLifecycleData) {
      //   if(vertexLifecycleData!=undefined && vertexLifecycleData.sent) {
      //     return true;
      //   }
      //   return false;
      // }
    })

    WandererSingleton.registerEdgeCollection({
      name: 'leadsTo',
      builder: {
        label: 'leads to',
        cytoscapeClasses: 'leadsTo',
        creatable: true,
        defaultFields: function (fromVertexCollection, toVertexCollection) {

          var defaultData = {
            type: 'or',
            priority: 10,
            name: '',
            expose: '',
            method: false,
            condition: false,
            // compareVariable: false,
            // compareCondition: '==',
            // compareValue: ''
          }

          // Check the source node collection for default edge conditions
          var defaultCondition = WandererSingleton.getVertexCollectionDefaultEdgeCondition(fromVertexCollection.name)
          if(defaultCondition) {
            defaultData.condition = defaultCondition
          }

          // Check the source node for default expose data fields
          var defaultExposeData = WandererSingleton.getVertexCollectionDefaultExposeField(fromVertexCollection.name)
          if(defaultExposeData) {
            defaultData.expose = defaultExposeData
          }

          return defaultData
        },
        cytoscapeStyles: [{
          selector: '.leadsTo',
          style: {
            'line-color': '#6C757D',
            'target-arrow-color': '#6C757D',
            'source-arrow-color': '#6C757D',
            'width': 'data(priority)',
            'label': 'data(label)',
            'line-style': 'data(line)'
          }
        },{
          selector: '.leadsTo[type = "and"]',
          style: {
            'line-color': '#FEC106',
            'target-arrow-color': '#FEC106',
            'source-arrow-color': '#FEC106',
            // 'label': 'data(label)'
          }
        },{
          selector: '.leadsTo[type = "not"]',
          style: {
            'line-color': '#DC3545',
            'target-arrow-color': '#DC3545',
            'source-arrow-color': '#DC3545',
            // 'label': 'data(label)'
          }
        }],
        component: 'wanderer-leads-to-editor'
      },
      toCytoscape: function(data) {

        // Get the source vertex collection
        var cytoscapeSourceNode = WandererCsytoscapeSingleton.cy.getElementById(data._from)
        var cytoscapeTargetNode = WandererCsytoscapeSingleton.cy.getElementById(data._to)
        var sourceNodeCollection = WandererSingleton.getVertexCollectionById(cytoscapeSourceNode.id())
        var targetNodeCollection = WandererSingleton.getVertexCollectionById(cytoscapeTargetNode.id())

        // Find default data
        var defaultCondition = WandererSingleton.getVertexCollectionDefaultEdgeCondition(sourceNodeCollection.name)

        var priority = data['priority'] / 5
        if (priority < 1) {
          priority = 1
        }

        var line = 'solid'
        var label = ''

        if (data.name) {
          label = label+'{{'+data.name+'}}'
        }

        if (data.condition) {
          // if(data.condition=='custom') {
          //   if(data.compareVariable) {
          //     label = label+' ['+data.compareVariable + data.compareCondition + data.compareValue+']'
          //     line = 'dashed'
          //   }
          // } else {

              // Only draw condition if not default
              if(defaultCondition!=data.condition) {
                if(sourceNodeCollection.edgeConditions!=undefined) {
                  label = label+' ['+sourceNodeCollection.edgeConditions[data.condition].label+']'
                }
              }

              line = 'dashed'

          // }
        }

        if (data.method) {
          if(targetNodeCollection.edgeMethods && targetNodeCollection.edgeMethods[data.method]) {
            label = label+' ('+targetNodeCollection.edgeMethods[data.method].label+')'
          }
        }

        return {
          line: line,
          label: label,
          type: data['type'],
          priority: priority
        }
      },
      // testVisitor: function (cytoscapeEdge, edgeData, language) {
      //   // Just remember this edges
      //   if (edgeData.type == 'and') {
      //     traversedRequiredEdgeIds.push(cytoscapeEdge.id())
      //   }
      //   // Use the testVisitor to get a List of all the NOT edges
      //   if (edgeData.type == 'not') {
      //     traversedForbiddenEdgeIds.push(cytoscapeEdge.id())
      //   }
      // },
      visitor: function (cytoscapeEdge, edgeData, language) {
        // Just remember this edges
        if (edgeData.type == 'and') {
          traversedRequiredEdgeIds.push(cytoscapeEdge.id())
        }
        // Use the visitor to get a List of all the NOT edges
        if (edgeData.type == 'not') {
          traversedForbiddenEdgeIds.push(cytoscapeEdge.id())
        }
      },
      allowTraversal: function (cytoscapeVertex, vertexData, cytoscapeEdge, edgeData, language) {
        // Is there a compareVariable available in this data?
        if (edgeData.condition) {

          let vertexLifecycleData = WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()]

          // if(edgeData.condition=='custom') {
          //
          //   // Check custom conditions
          //
          //   if (edgeData.compareVariable) {
          //     // Get the lifecycle data of the source node
          //     if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[cytoscapeVertex.id()] != undefined){
          //
          //       var variable = vertexLifecycleData[edgeData.compareVariable]
          //       var value = edgeData.compareValue
          //
          //       // Convert strings to int if necessary
          //       // So the end user has not to deal with types like strings and int
          //       if(parseInt(variable)){
          //         variable = parseInt(variable)
          //       }
          //       if(parseInt(value)){
          //         value = parseInt(value)
          //       }
          //
          //       if(edgeData.compareCondition == '==') {
          //         if(variable == value) {
          //           return true
          //         }
          //       }
          //       if(edgeData.compareCondition == '!=') {
          //         if(variable != value) {
          //           return true
          //         }
          //       }
          //       if(edgeData.compareCondition == '<=') {
          //         if(variable <= value) {
          //           return true
          //         }
          //       }
          //       if(edgeData.compareCondition == '>=') {
          //         if(variable >= value) {
          //           return true
          //         }
          //       }
          //       if(edgeData.compareCondition == '<') {
          //         if(variable < value) {
          //           return true
          //         }
          //       }
          //       if(edgeData.compareCondition == '>') {
          //         if(variable > value) {
          //           return true
          //         }
          //       }
          //     }
          //     return false
          //   }
          // } else {

            // Check predefined condition
            // Todo: Move this to the Wanderer core
            // This method is similar to the one specified in wanderer-plugin-question
            let sourceNodeCollection = WandererSingleton.getVertexCollection(vertexData._collection)
            if(sourceNodeCollection.edgeConditions !== undefined) {
              if(sourceNodeCollection.edgeConditions[edgeData.condition] !== undefined) {
                return sourceNodeCollection.edgeConditions[edgeData.condition].condition(vertexLifecycleData)
              }
            }
          // }
        }

        return true
      },
      allowTargetTraversal: function (cytoscapeVertex, vertexData, cytoscapeEdge, edgeData, language) {
        if (edgeData.type == 'and') {
          // Have I already visited this required edge?
          if (traversedRequiredEdgeIds.indexOf(cytoscapeEdge.id()) === -1) {
            return false
          }
        }
        if (edgeData.type == 'not') {
          // Have I not visited this forbidden edge before?
          if (traversedForbiddenEdgeIds.indexOf(cytoscapeEdge.id()) !== -1) {
            return false
          }
          // Have I not visited this forbidden edges one cycle before?
          // So I can check if there was an forbidden edge to a node after I have visited this node
          if (lastTraversedForbiddenEdgeIds.indexOf(cytoscapeEdge.id()) !== -1) {
            return false
          }
        }
        return true
      }
    })

    // // Register the isAnswerableBy edge
    // WandererSingleton.registerEdgeCollection({
    //   name: 'watch',
    //   builder: {
    //     label: 'watch',
    //     cytoscapeClasses: 'watch',
    //     creatable: true,
    //     defaultFields: function (fromVertexCollection, toVertexCollection) {
    //       return {
    //         // priority: 25
    //       }
    //     },
    //     // restrictSourceVertices: [
    //     //   'section'
    //     // ],
    //     cytoscapeStyles: [{
    //       selector: '.watch',
    //       style: {
    //         'display': 'none',
    //         'line-color': '#6C757D',
    //         'target-arrow-color': '#6C757D',
    //         'source-arrow-color': '#6C757D',
    //         // 'width': 'data(priority)',
    //         // 'label': 'data(label)'
    //       }
    //     }],
    //     // component: 'wanderer-is-answerable-by-editor'
    //   },
    //   // isChildEdge: true,
    //   // toCytoscape: function(data){
    //   //
    //   //   return {
    //   //     // label: data._id,
    //   //     // priority: priority
    //   //   }
    //   // },
    //   afterCreate: (cytoscapeEdge, data) => {
    //     // Move the target to the source node
    //     cytoscapeEdge.target().move({
    //       parent: cytoscapeEdge.source().id()
    //     });
    //   },
    //   beforeRemove: (cytoscapeEdge) => {
    //     // Move the node out of its parent
    //     // console.log('unlink')
    //     cytoscapeEdge.target().move({
    //       parent: null
    //     });
    //   }
    // })

    // WandererSingleton.registerEdgeCollection({
    //   name: 'contains',
    //   builder: {
    //     label: 'contains',
    //     cytoscapeClasses: 'contains',
    //     creatable: true,
    //     defaultFields: function (fromVertexCollection, toVertexCollection) {
    //
    //       var defaultData = {
    //
    //       }
    //
    //       return defaultData
    //     },
    //     cytoscapeStyles: [{
    //       selector: '.contains',
    //       style: {
    //         'line-color': '#6C757D',
    //         'target-arrow-color': '#6C757D',
    //         'source-arrow-color': '#6C757D',
    //         'width': 'data(priority)',
    //         'label': 'data(label)',
    //         'line-style': 'data(line)'
    //       }
    //     }],
    //     // component: 'wanderer-leads-to-editor'
    //   },
    //   toCytoscape: function(data) {
    //
    //     return {
    //       // line: line,
    //       label: 'contains',
    //       // type: data['type'],
    //       // priority: priority
    //     }
    //   },
    //   testVisitor: function (cytoscapeEdge, edgeData, language) {
    //   },
    //   visitor: function (cytoscapeEdge, edgeData, language) {
    //   },
    //   allowTraversal: function (cytoscapeVertex, vertexData, cytoscapeEdge, edgeData, language) {
    //     return true
    //   },
    //   allowTargetTraversal: function (cytoscapeVertex, vertexData, cytoscapeEdge, edgeData, language) {
    //
    //   }
    // })

    WandererSingleton.on('traversalStart', function() {
      // Reset the edge information
      traversedRequiredEdgeIds = []
      traversedForbiddenEdgeIds = []
    })

    WandererSingleton.on('traversalFinished', function() {

      // Remember the forbidden Edges for one more cycle
      lastTraversedForbiddenEdgeIds = [...traversedForbiddenEdgeIds]

      // // Reset sections
      // for(var cytoscapeVertex of resetSections) {
      //   // Reset section lifecycle data
      //   WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'finished', false)
      //
      //   // Find all child elements
      //   // Now for this target get all outbound edges
      //   let outboundCyEdges = WandererSingleton.getOutboundCytoscapeEdges(cytoscapeVertex)
      //   outboundCyEdges.forEach((outboundCyEdge) => {
      //
      //     // Get the data for each edge
      //     let outboundEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[outboundCyEdge.id()]
      //
      //     // If the child is connected via a watch edge...
      //     if(outboundEdgeData._collection == 'watch') {
      //       // Invoke the reset method for all child elements
      //       WandererSingleton.invokeVertexMethod(outboundCyEdge.target().id(), 'reset');
      //     }
      //
      //   })
      // }
      //
      // // Reset the reset object
      // resetSections = []

      // // Reset messages
      // for(var cytoscapeVertex of resetMessages) {
      //
      //   // Do not clear the timeout here! Because the message was already sent!
      //   // Do not clear already sent messages!
      //   // Clear the typing timeout
      //   // if(typingTimeouts[cytoscapeVertex.id()] !== undefined) {
      //   //   clearTimeout(typingTimeouts[cytoscapeVertex.id()]);
      //   //   delete typingTimeouts[cytoscapeVertex.id()];
      //   // }
      //
      //   // Reset the lifecycle data
      //   WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'sent', false)
      // }

      // Reset the reset object
      // resetMessages = []

    })

    WandererSingleton.on('truncate', function() {

      // Reset the edge information
      traversedRequiredEdgeIds = []
      traversedForbiddenEdgeIds = []
      lastTraversedForbiddenEdgeIds = []

      // Clear all timeouts
      for (let i in typingTimeouts) {
        if(typingTimeouts.hasOwnProperty(i)) {
          clearTimeout(typingTimeouts[i]);
          delete typingTimeouts[i]
        }
      }

      // resetMessages = []
      // resetSections = []
    })

  },

}
