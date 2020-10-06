// import LinkEditor from './components/LinkEditor.vue'
// import LinkMessage from './components/LinkMessage.vue'

import JumpEditor from './components/JumpEditor.vue'
import ImportEditor from './components/ImportEditor.vue'
import ResetEditor from './components/ResetEditor.vue'

import LanguageEditor from './components/LanguageEditor.vue'

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    // Vue.component('wanderer-link-message', LinkMessage)
    // Vue.component('wanderer-link-editor', LinkEditor)

    // Vue.component('wanderer-jump-message', JumpMessage)
    Vue.component('wanderer-jump-editor', JumpEditor)
    Vue.component('wanderer-import-editor', ImportEditor)
    Vue.component('wanderer-reset-editor', ResetEditor)
    Vue.component('wanderer-language-editor', LanguageEditor)

    var debug = false

    // Register the vertex
    WandererSingleton.registerVertexCollection({
      name: 'jump',
      builder: {
        label: 'Jump',
        color: '#DC3545',
        cytoscapeClasses: 'jump',
        cytoscapeCxtMenuSelector: '.jump',
        creatable: true,
        canBeChild: true,
        defaultFields: {
          url: '',
          label: '',
        },
        cytoscapeStyles: [{
          selector: '.jump',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#DC3545',
            'border-color': '#DC3545',
            'border-width': '5px',
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

      }
    })

    // Register the vertex
    WandererSingleton.registerVertexCollection({
      name: 'import',
      builder: {
        label: 'Import',
        color: '#DC3545',
        cytoscapeClasses: 'import',
        cytoscapeCxtMenuSelector: '.import',
        creatable: true,
        canBeChild: true,
        defaultFields: {
          url: '',
          label: '',
        },
        cytoscapeStyles: [
          {
            selector: '.import',
            style: {
              'height': '100px',
              'width': '100px',
              'font-size': '20px',
              'background-color': '#DC3545',
              'border-color': '#DC3545',
              'border-width': '5px',
              'label': 'data(label)'
            }
          },
          {
            selector: '.import:parent',
            style:{
              'background-opacity': 0,
              'background-color': '#fff',
              // 'shape': 'roundrectangle',
              'border-color': '#DC3545',
              'padding': '100px'
            },
          }
        ],
        component: 'wanderer-import-editor'
      },
      toCytoscape: function(data, language){

        var label = 'Import';

        if(data.label && data.label[language]) {
          label = label+' ('+data.label[language]+')'
        }

        return {
          label: label
        }

      },
      lifecycleData: {
        imported: {
          label: 'imported',
          exposeDefault: false
        },
      },
      edgeConditions: {
        finished: {
          default: true,
          label: 'imported',
          condition: (vertexLifecycleData) => {
            if(vertexLifecycleData != undefined) {
              if(vertexLifecycleData.imported) {
                return true
              }
            }
            return false
          }
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        // If this data was not imported before...
        if(!WandererSingleton.getLifecycleValue(cytoscapeVertex.id(), 'imported')) {

          if(vertexData.url) {

            WandererSingleton.importJsonRemote(vertexData.url, cytoscapeVertex.id())

            // Remember this data as imported
            WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'imported', true)

          }

        }

      },
      childExpander: function (cytoscapeVertex, vertexData, children) {

        let returnChildren = []

        children.forEach(function(child) {

          let childData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[child.id()]

          // Push only the flows back to the traversal
          if(childData._collection == 'flow') {
            returnChildren.push(child)
          }

        })

        return returnChildren
      },
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
        canBeChild: true,
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
            'background-color': '#DC3545',
            'border-color': '#DC3545',
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
      lifecycleData: {
        imported: {
          label: 'switched',
          exposeDefault: false
        },
      },
      edgeMethods: {
        reset: {
          label: 'Reset language',
          method: (cytoscapeVertex, vertexData) => {

            WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'switched', false)

          }
        }
      },
      edgeConditions: {
        switched: {
          default: true,
          label: 'switched',
          condition: (vertexLifecycleData) => {
            if(vertexLifecycleData != undefined) {
              if(vertexLifecycleData.switched) {
                return true
              }
            }
            return false
          }
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        // Switch the language
        if(!WandererSingleton.getLifecycleValue(cytoscapeVertex.id(), 'switched')) {

          WandererSingleton.setLanguage(vertexData.switchToLanguage);

          // Remember this data as imported
          WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'switched', true)
        }

      }
    })

    // Register the vertex
    WandererSingleton.registerVertexCollection({
      name: 'reset',
      builder: {
        label: 'Reset',
        color: '#DC3545',
        cytoscapeClasses: 'reset',
        cytoscapeCxtMenuSelector: '.reset',
        creatable: true,
        defaultFields: {},
        cytoscapeStyles: [{
          selector: '.reset',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#DC3545',
            'border-color': '#DC3545',
            'border-width': '5px',
            'label': 'Reset'
          }
        }],
        component: 'wanderer-reset-editor'
      },
      toCytoscape: function(data, language){

        return {
          label: 'Reset'
        }

      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        WandererStoreSingleton.store.commit('wanderer/cleanVertexLifecycleData')
        WandererSingleton.trigger('truncate')
        WandererSingleton.removeImmutableData()

      }

    })


  }

}
