import Editor from './components/Editor.vue'

export default {

  install (Vue, {store, cytoscape, wanderer, wandererPlugins}) {

    Vue.component('wanderer-editor-question', Editor)

    wanderer.registerVertexCollection('question',{
      builder: {
        label: 'Question',
        color: '#007BFF',
        cytoscapeClasses: 'question',
        cytoscapeCxtMenuSelector: '.question',
        creatable: true,
        restrictOutgoingConnections: [
          {
            through: 'leadsTo',
            to: 'suggestion'
          }
        ],
        defaultFields: {
          question: {
            en: 'New question',
            de: 'Neue Frage'
          }
        },
        cytoscapeStyle: {
          selector: '.question',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#007BFF',
            'label': 'data(label)'
          }
        },
        editorComponent: 'wanderer-editor-question'
      },
      toCytoscape: function(data){
        return {
          label: 'Question'
        }
      }
    })

    wanderer.registerVertexCollection('suggestion',{
      builder: {
        label: 'Suggestion',
        color: '#28A745',
        cytoscapeClasses: 'suggestion',
        cytoscapeCxtMenuSelector: '.suggestion',
        creatable: true,
        restrictIncommingConnections: [
          {
            from: 'question',
            through: 'leadsTo'
          }
        ],
        defaultFields: {
          'suggestion': {
            'de': 'Antwort',
            'en': 'Answer'
          }
        },
        cytoscapeStyle: {
          selector: '.suggestion',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#28A745',
            'label': 'data(label)'
          }
        },
        // editorComponent: Editor
      },
      toCytoscape: function(data){
        return {
          label: 'Suggestion'
        }
      }
    })

  }

}
