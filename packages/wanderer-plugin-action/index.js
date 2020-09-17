import LinkEditor from './components/LinkEditor.vue'
import LinkMessage from './components/LinkMessage.vue'

import JumpEditor from './components/JumpEditor.vue'
// import JumpMessage from './components/JumpMessage.vue'

import LanguageEditor from './components/LanguageEditor.vue'

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-link-message', LinkMessage)
    Vue.component('wanderer-link-editor', LinkEditor)

    // Vue.component('wanderer-jump-message', JumpMessage)
    Vue.component('wanderer-jump-editor', JumpEditor)

    Vue.component('wanderer-language-editor', LanguageEditor)

    var debug = false

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
      name: 'link',
      builder: {
        label: 'Link',
        color: '#DC3545',
        cytoscapeClasses: 'link',
        cytoscapeCxtMenuSelector: '.link',
        creatable: true,
        defaultFields: {
          link: {
            de: '',
            en: ''
          },
          label: {
            de: 'anzeigen',
            en: 'show'
          },
        },
        cytoscapeStyles: [{
          selector: '.link',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#DC3545',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-link-editor'
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

        var label = 'Link';

        if(data.label && data.label[language]) {
          label = label+' ('+data.label[language]+')'
        }

        return {
          label: label
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        if(doneActions.indexOf(cytoscapeVertex.id())==-1) {

          doneActions.push(cytoscapeVertex.id())

          if(vertexData.link[language]){

            // Add the action message
            WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
              // id: traversalResult.lastFoundConclusionIds[i],
              component: 'wanderer-link-message',
              backgroundColor: '#DC3545',
              vertexId: cytoscapeVertex.id(),
              delay: 1000
            })

          }

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

    // Register the vertex
    WandererSingleton.registerVertexCollection({
      name: 'jump',
      builder: {
        label: 'Jump',
        color: '#DC3545',
        cytoscapeClasses: 'jump',
        cytoscapeCxtMenuSelector: '.jump',
        creatable: true,
        defaultFields: {
          url: '',
          label: {
            de: 'anzeigen',
            en: 'show'
          },
        },
        cytoscapeStyles: [{
          selector: '.jump',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#DC3545',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-jump-editor'
      },
      toCytoscape: function(data, language){

        var label = 'Jump';

        if(data.label && data.label[language]) {
          label = label+' ('+data.label[language]+')'
        }

        return {
          label: label
        }

      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        if(vertexData.url){

          WandererSingleton.loadJsonRemote(vertexData.url)

        }

      },
      expander: function (cytoscapeVertex, vertexData, outboundCyEdges) {
        return outboundCyEdges
      },
      // finisher: function () {
      //   return true
      // }
    })

    // Language switcher node
    // Register the vertex
    WandererSingleton.registerVertexCollection({
      name: 'language',
      builder: {
        label: 'Language',
        color: '#DC3545',
        cytoscapeClasses: 'language',
        cytoscapeCxtMenuSelector: '.language',
        creatable: true,
        defaultFields: {
          switchToLanguage: 'en'
        },
        cytoscapeStyles: [{
          selector: '.language',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#DC3545',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-language-editor'
      },
      toCytoscape: function(data, language){

        var label = 'Switch language ('+data.switchToLanguage+')';

        return {
          label: label+(debug? ' ('+data._id+')':''),
        }

      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        // Switch the language
        WandererSingleton.setLanguage(vertexData.switchToLanguage);

      },
      expander: function (cytoscapeVertex, vertexData, outboundCyEdges) {
        return outboundCyEdges
      },
      // finisher: function () {
      //   return true
      // }
    })

    WandererSingleton.on('truncate', function() {
      doneActions = []

      // WandererStoreSingleton.store.commit('wanderer/plugin-action/clean')

    })

  }

}
