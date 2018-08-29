import Editor from './components/Editor.vue'

export default {

  install (Brain) {

    /*let store = Brain.storeFactory({
      state: {
        data: {}
      },
      mutations: {
        increment (state) {
          // state.count++
        }
      }
    })*/

    Brain.registerVertexCollection('question',{
      //store: store,
      label: 'Question',
      color: '#007BFF',
      cytoscapeClasses: 'question',
      cytoscapeCtxMenuSelector: '.question',
      createable: true,
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
      // chatComponent:
    })

    Brain.registerVertexCollection('suggestion',{
      //store: store,
      label: 'Suggestion',
      color: '#28A745',
      cytoscapeClasses: 'suggestion',
      cytoscapeCtxMenuSelector: '.suggestion',
      createable: true,
      restrictIncommingConnections: [
        {
          from: 'question',
          through: 'leadsTo'
        }
      ],
      defaultFields: {
        
      },
      toCytoscape: function(data){
        return {
          label: 'Suggestion'
        }
      },
      editorComponent: Editor
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
