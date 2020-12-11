import ImportEditor from './components/ImportEditor.vue'
import JumpEditor from './components/JumpEditor.vue'
import LanguageEditor from './components/LanguageEditor.vue'

export default {
  install (wanderer) {

    // Require some dependencys from wanderer
    var Vue = wanderer.require('vue')

    // Register vue components
    Vue.component('wanderer-import-editor', ImportEditor)
    Vue.component('wanderer-jump-editor', JumpEditor)
    Vue.component('wanderer-language-editor', LanguageEditor)

    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'jump',
      props: {
        builder: {
          label: 'Jump',
          color: '#DC3545',
          cytoscapeClasses: 'jump',
          cytoscapeCxtMenuSelector: '.jump',
          creatable: true,
          defaultFields: {
            url: ''
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
          component: 'wanderer-jump-editor',
          toCytoscape: function(vertexData) {

            var label = 'Jump'
            var base = ''

            if(!vertexData.isEmpty('url')) {
              base = new String(vertexData.get('url')).substring(vertexData.get('url').lastIndexOf('/') + 1)
              if(base.lastIndexOf(".") != -1)
              label = label+' ('+base.substring(0, base.lastIndexOf("."))+')'
            }

            return {
              label: label
            }

          }
        }
      }
    })

    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'import',
      props: {
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
              }
            }
          ],
          component: 'wanderer-import-editor',
          toCytoscape: function(vertexData) {

            var label = 'Import'
            var base = ''

            if(!vertexData.isEmpty('url')) {
              base = new String(vertexData.get('url')).substring(vertexData.get('url').lastIndexOf('/') + 1)
              if(base.lastIndexOf(".") != -1)
              label = label+' ('+base.substring(0, base.lastIndexOf("."))+')'
            }

            return {
              label: label
            }

          },
          lifecycleData: {
            imported: {
              label: 'imported',
              exposeDefault: false
            }
          },
          edgeConditions: {
            imported: {
              default: true,
              label: 'imported'
            }
          }
        }
      }
    })

    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'language',
      props: {
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
              'border-color': '#DC3545',
              'label': 'data(label)'
            }
          }],
          component: 'wanderer-language-editor',
          toCytoscape: function(vertexData) {

            var label = 'Language ('+vertexData.get('switchToLanguage')+')'

            return {
              label: label
            }

          },
          lifecycleData: {
            imported: {
              label: 'switched',
              exposeDefault: false
            }
          },
          edgeConditions: {
            switched: {
              default: true,
              label: 'switched'
            }
          },
        }
      }
    })

    wanderer.subscriber.emit('addVertexCollectionProps', {
      name: 'reset',
      props: {
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
          component: 'wanderer-reset-editor',
          toCytoscape: function() {
            return {
              label: 'Reset'
            }
          }
        }
      }
    })

  }
}
