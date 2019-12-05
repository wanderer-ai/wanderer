// import Editor from './components/Editor.vue'
import WandererSingleton from 'wanderer-singleton'

export default {

  install (Vue) {

    WandererSingleton.registerVertexCollection({
      name: 'request',
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
        cytoscapeStyles: [{
          selector: '.request',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#DC3545',
            'label': 'data(label)'
          }
        }]
      },
      toCytoscape: function(data){
        return {
          label: 'Request'
        }
      }
    })

    WandererSingleton.registerVertexCollection({
      name: 'response',
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
        cytoscapeStyles: [{
          selector: '.response',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#28A745',
            'label': 'data(label)'
          }
        }]
      },
      toCytoscape: function(data){
        return {
          label: 'Response'
        }
      },

    })

  },

}
