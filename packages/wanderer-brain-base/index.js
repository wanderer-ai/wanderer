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
      creatable: false,
      toCytoscape: function(data){
        return {
          label: 'Flow'
        }
      },
      editorComponent: Editor
      // chatComponent:
    })

    Brain.registerEdgeCollection('leadsTo',{
      cytoscapeClasses: 'default',
      creatable: true,
      defaultFields: {
        
      },
      toCytoscape: function(data){
        return {
          label: 'leadsTo'
        }
      }
      // editorComponent: Editor
    })

    Brain.addCytoscapeStylesheet([

      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'text-wrap': 'wrap',
          'text-max-width': '200px'
        }
      },

      {
        selector: 'edge',
        style: {
          'curve-style': 'unbundled-bezier',
          'target-arrow-shape': 'triangle',
          'source-arrow-shape': 'circle'
        }
      },

      {
        selector: '.flow',
        style: {
          'height': '200px',
          'width': '200px',
          'font-size': '20px',
          'background-color': '#DC3545',
          'label': 'data(label)'
        }
      },

      {
        selector: '.unknown-vertex',
        style: {
          'height': '50px',
          'width': '50px',
          'font-size': '20px',
          'background-color': '#6C757D',
          'label': 'data(label)'
        }
      },

      {
        selector: 'node:selected',
        style: {
          'background-color': '#17a2b8'
        }
      },

      {
        selector: '.unknown-edge',
        style: {
          'line-color': '#17a2b8',
          'target-arrow-color': '#17a2b8',
          'source-arrow-color': '#17a2b8',
          'label': 'data(label)'
        }
      },

      {
        selector: 'edge:selected',
        style: {
          'line-color': '#17a2b8',
          'target-arrow-color': '#17a2b8',
          'source-arrow-color': '#17a2b8'
        }
      }
    ])

  },

}
