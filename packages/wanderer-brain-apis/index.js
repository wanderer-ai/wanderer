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

    Brain.registerVertexCollection('request',{
      //store: store,
      label: 'Request',
      color: '#DC3545',
      cytoscapeClasses: 'request',
      cytoscapeCtxMenuSelector: '.request',
      createable: true,
      restrictOutgoingConnections: [
        {
          through: 'leadsTo',
          to: 'response'
        }
      ],
      defaultFields: {

      },
      toCytoscape: function(data){
        return {
          label: 'Request'
        }
      },
      editorComponent: Editor
      // chatComponent:
    })

    Brain.registerVertexCollection('response',{
      //store: store,
      label: 'Response',
      color: '#28A745',
      cytoscapeClasses: 'response',
      cytoscapeCtxMenuSelector: '.response',
      createable: true,
      restrictIncommingConnections: [
        {
          from: 'request',
          through: 'leadsTo'
        }
      ],
      defaultFields: {

      },
      toCytoscape: function(data){
        return {
          label: 'Response'
        }
      },
      editorComponent: Editor
      // chatComponent:
    })

    Brain.addCytoscapeStylesheet([

      {
        selector: '.request',
        style: {
          'height': '100px',
          'width': '100px',
          'font-size': '20px',
          'background-color': '#DC3545',
          'label': 'data(label)'
        }
      },

      {
        selector: '.response',
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
