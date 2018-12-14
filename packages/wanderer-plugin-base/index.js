// import Editor from './components/Editor.vue'
import WandererSingleton from 'wanderer-singleton'

export default {

  install (Vue) {

    WandererSingleton.registerVertexCollection('flow',{
      builder: {
        label: 'Flow',
        color: '#DC3545',
        cytoscapeClasses: 'flow',
        cytoscapeCxtMenuSelector: '.flow',
        creatable: false,
        cytoscapeStyle: {
          selector: '.flow',
          style: {
            'height': '200px',
            'width': '200px',
            'font-size': '20px',
            'background-color': '#6C757D',
            'label': 'data(label)'
          }
        }
      },
      toCytoscape: function(data){
        return {
          label: 'Flow'
        }
      },
    })

    WandererSingleton.registerEdgeCollection('leadsTo',{
      builder: {
        label: 'leadsTo',
        cytoscapeClasses: 'leadsTo',
        creatable: true,
        defaultFields: {},
        cytoscapeStyle: {
          selector: '.leadsTo',
          style: {
            'line-color': '#6C757D',
            'target-arrow-color': '#6C757D',
            'source-arrow-color': '#6C757D',
            'label': 'data(label)'
          }
        }
      },
      toCytoscape: function(data){
        return {
          label: 'leadsTo'
        }
      }
    })

    WandererSingleton.registerVertexCollection('default',{
      builder: {
        label: 'Default',
        color: '#6C757D',
        cytoscapeClasses: 'default-vertex',
        cytoscapeCxtMenuSelector: '.default',
        creatable: false,
        defaultFields: {},
        cytoscapeStyle: {
          selector: '.default-vertex',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#6C757D',
            'label': 'data(label)'
          }
        }
      },
      toCytoscape: function(data){
        return {
          label: 'Default'
        }
      },
    })

    WandererSingleton.registerEdgeCollection('default',{
      builder: {
        label: 'Default',
        color: '#6C757D',
        cytoscapeClasses: 'default-edge',
        creatable: false,
        defaultFields: {},
        cytoscapeStyle: {
          selector: '.default-edge',
          style: {
            'line-color': '#6C757D',
            'target-arrow-color': '#6C757D',
            'source-arrow-color': '#6C757D',
            'label': 'data(label)'
          }
        }
      },
      toCytoscape: function(data){
        return {
          label: 'Default'
        }
      }
    })

  },

}
