import ReportEditor from './components/ReportEditor.vue'
import SnippetEditor from './components/SnippetEditor.vue'

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-report-editor', ReportEditor)
    Vue.component('wanderer-snippet-editor', SnippetEditor)

    var debug = false

    // Language switcher node
    // Register the vertex
    WandererSingleton.registerVertexCollection({
      name: 'report',
      builder: {
        label: 'Report',
        color: '#007BFF',
        cytoscapeClasses: 'report',
        cytoscapeCxtMenuSelector: '.report',
        creatable: true,
        canBeChild: true,
        defaultFields: {
          title: {
            'en': '',
            'de': ''
          },
          text: {
            'en': '',
            'de': ''
          }
        },
        cytoscapeStyles: [{
          selector: '.report',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#007BFF',
            'background-color': '#007BFF',
            'border-color': '#007BFF',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-report-editor'
      },
      toCytoscape: function(data, language){

        var label = 'Report'

        if(data.title[language]) {
          label = data.title[language]
        }

        return {
          label: label+(debug? ' ('+data._id+')':''),
        }

      },
      lifecycleData: {
        generated: {
          label: 'generated',
          exposeDefault: false
        },
      },
      // edgeMethods: {
      //   reset: {
      //     label: 'Reset language switch',
      //     method: (cytoscapeVertex, vertexData) => {
      //
      //       WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'switched', false)
      //
      //     }
      //   }
      // },
      becomeReachable: function (cytoscapeVertex, vertexData) {
        WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'generated', false)
      },
      edgeConditions: {
        generated: {
          default: true,
          label: 'generated',
          condition: (vertexLifecycleData) => {
            if(vertexLifecycleData != undefined) {
              if(vertexLifecycleData.generated) {
                return true
              }
            }
            return false
          }
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        // Switch the language
        if(!WandererSingleton.getLifecycleValue(cytoscapeVertex.id(), 'generated')) {

            // Get the report text
            var text = WandererSingleton.markdown2html(WandererSingleton.evaluateVertexTemplate(WandererSingleton.getTranslatableVertexValue(cytoscapeVertex.id(), 'text'), cytoscapeVertex.id()))

            // Print all the stuff
            var newWindow = window.open();
            newWindow.document.write(text);
            newWindow.print();
            // newWindow.close();

            WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'generated', true)

        }

      }
    })

    WandererSingleton.registerVertexCollection({
      name: 'snippet',
      builder: {
        label: 'Snippet',
        color: '#007BFF',
        cytoscapeClasses: 'snippet',
        cytoscapeCxtMenuSelector: '.snippet',
        creatable: true,
        canBeChild: true,
        defaultFields: {
          text: {
            'en': '',
            'de': ''
          }
        },
        cytoscapeStyles: [{
          selector: '.snippet',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#007BFF',
            'background-color': '#007BFF',
            'border-color': '#007BFF',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-snippet-editor'
      },
      toCytoscape: function(data, language){

        var label = 'Snippet'

        if(data.text[language]) {
          label = data.text[language]
        }

        return {
          label: label+(debug? ' ('+data._id+')':''),
        }

      },
      lifecycleData: {
        text: {
          label: 'text',
          exposeDefault: true
        },
      },
      // edgeMethods: {
      //   reset: {
      //     label: 'Reset language switch',
      //     method: (cytoscapeVertex, vertexData) => {
      //
      //       WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'switched', false)
      //
      //     }
      //   }
      // },
      // becomeReachable: function (cytoscapeVertex, vertexData) {
      //   WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'generated', false)
      // },
      // edgeConditions: {
      //   generated: {
      //     default: true,
      //     label: 'generated',
      //     condition: (vertexLifecycleData) => {
      //       if(vertexLifecycleData != undefined) {
      //         if(vertexLifecycleData.generated) {
      //           return true
      //         }
      //       }
      //       return false
      //     }
      //   }
      // },
      visitor: function (cytoscapeVertex, vertexData, language) {

        // Get the text
        var text = WandererSingleton.evaluateVertexTemplate(WandererSingleton.getTranslatableVertexValue(cytoscapeVertex.id(), 'text'), cytoscapeVertex.id())

        // Set the evaluated text as a lifecycle value
        WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'text', text)

      }
    })


  }

}
