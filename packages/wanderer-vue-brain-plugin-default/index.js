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

    Brain.registerVertexCollection('flow',{
      //store: store,
      label: 'Flow',
      color: '#DC3545',
      cytoscapeClasses: 'flow',
      cytoscapeCtxMenuSelector: '.flow',
      createable: false,
      toCytoscape: function(data){
        return {
          label: 'Flow'
        }
      },
      editorComponent: Editor
      // chatComponent:
    })

    Brain.registerVertexCollection('default',{
      //store: store,
      label: 'Default',
      color: '#6C757D',
      cytoscapeClasses: 'default',
      cytoscapeCtxMenuSelector: '.default',
      createable: false,
      toCytoscape: function(data){
        return {
          label: 'Default'
        }
      },
      editorComponent: Editor
      // chatComponent:
    })

    Brain.registerVertexCollection('question',{
      //store: store,
      label: 'Question',
      color: '#007BFF',
      cytoscapeClasses: 'question',
      cytoscapeCtxMenuSelector: '.question',
      createable: true,
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
      toCytoscape: function(data){
        return {
          label: 'Suggestion'
        }
      },
      editorComponent: Editor
      // chatComponent:
    })

    Brain.registerEdgeCollection('leadsTo',{
      cytoscapeClasses: 'default',
      toCytoscape: function(data){
        return {
          label: 'leadsTo'
        }
      }
      // editorComponent: Editor
    })

    Brain.addCytoscapeStylesheet([
      {
        selector: '.flow',
        style: {
          'height': '100px',
          'width': '100px',
          'font-size': '20px',
          'background-color': '#DC3545',
          'label': 'data(label)'
        }
      },

      {
        selector: '.default',
        style: {
          'height': '100px',
          'width': '100px',
          'font-size': '20px',
          'background-color': '#6C757D',
          'label': 'data(label)'
        }
      },

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
