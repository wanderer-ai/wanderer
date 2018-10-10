import Editor from './components/Editor.vue'

export default {

  install (Brain) {

    Brain.registerVertexCollection('question',{
      models:[
        {
          name: 'question',
          isMultiLanguage: true
        },
        {
          name: 'simpleProp',
          isMultiLanguage: false
        },
        {
          name: 'complexProp',
          isMultiLanguage: true
        }
      ],
      label: 'Question',
      color: '#007BFF',
      cytoscapeClasses: 'question',
      cytoscapeCtxMenuSelector: '.question',
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
      toCytoscape: function(data){
        return {
          label: 'Question'
        }
      },
      editorComponent: Editor
    })

    Brain.registerVertexCollection('suggestion',{
      store: {
        state: {
          suggestions: {}
        },
        mutations: {
          add (state, documentData){
            state.suggestions[documentData._id] = documentData.suggestion
          }
        }
      },
      label: 'Suggestion',
      color: '#28A745',
      cytoscapeClasses: 'suggestion',
      cytoscapeCtxMenuSelector: '.suggestion',
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
      toCytoscape: function(data){
        return {
          label: 'Suggestion'
        }
      },
      //editorComponent: Editor
      // chatComponent:
    })

    Brain.addCytoscapeStylesheet([

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
        selector: '.suggestion',
        style: {
          'height': '50px',
          'width': '50px',
          'font-size': '20px',
          'background-color': '#28A745',
          'label': 'data(label)'
        }
      }

    ])

  },

}
