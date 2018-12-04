import Editor from './components/Editor.vue'
import WandererSingleton from 'wanderer-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-editor-question', Editor)

    WandererSingleton.registerVertexCollection('question',{
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
      toCytoscape: function(data, language){
        if(data.question[language]){
          return {
            label: data.question[language]
          }
        }
        return {
          label: 'Question'
        }
      }
    })

    WandererSingleton.registerVertexCollection('suggestion',{
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
