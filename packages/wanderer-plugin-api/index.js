// import Editor from './components/Editor.vue'

export default {

  install (Vue, {store, cytoscape, wanderer, wandererPlugins}) {

    wanderer.registerVertexCollection('request',{
      builder: {
        label: 'Request',
        color: '#DC3545',
        cytoscapeClasses: 'request',
        cytoscapeCxtMenuSelector: '.request',
        creatable: true,
        restrictOutgoingConnections: [
          {
            through: 'leadsTo',
            to: 'response'
          }
        ],
        defaultFields: {

        },
        cytoscapeStyle: {
          selector: '.request',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#DC3545',
            'label': 'data(label)'
          }
        }
      },
      toCytoscape: function(data){
        return {
          label: 'Request'
        }
      }
    })

    wanderer.registerVertexCollection('response',{
      builder: {
        label: 'Response',
        color: '#28A745',
        cytoscapeClasses: 'response',
        cytoscapeCxtMenuSelector: '.response',
        creatable: true,
        restrictIncommingConnections: [
          {
            from: 'request',
            through: 'leadsTo'
          }
        ],
        defaultFields: {

        },
        cytoscapeStyle: {
          selector: '.response',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#28A745',
            'label': 'data(label)'
          }
        }
      },
      toCytoscape: function(data){
        return {
          label: 'Response'
        }
      },

    })

  },

}
