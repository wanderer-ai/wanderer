import ConclusionEditor from './components/ConclusionEditor.vue'
import ExpressionEditor from './components/ExpressionEditor.vue'

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-conclusion-editor', ConclusionEditor)
    Vue.component('wanderer-expression-editor', ExpressionEditor)

    var debug = false

    // Register the conclusion vertex
    WandererSingleton.registerVertexCollection({
      name: 'conclusion',
      builder: {
        label: 'Conclusion',
        color: '#FEC106',
        cytoscapeClasses: 'conclusion',
        cytoscapeCxtMenuSelector: '.conclusion',
        creatable: true,
        appendableViaCxtMenu: true,
        ctxMenuAllowedEdge: 'leadsTo',
        defaultFields: {
          label: "New conclusion"
        },
        cytoscapeStyles: [{
          selector: '.conclusion',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#FEC106',
            'border-color': '#FEC106',
            'border-width': '5px',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-conclusion-editor'
      },
      toCytoscape: function(data, language){
        if(data.label){
          return {
            label: data.label
          }
        }
        return {
          label: 'Conclusion'
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {



      }
    })

    WandererSingleton.registerVertexCollection({
      name: 'expression',
      builder: {
        label: 'Expression',
        color: '#FEC106',
        cytoscapeClasses: 'expression',
        cytoscapeCxtMenuSelector: '.expression',
        creatable: true,
        canBeChild: true,
        defaultFields: {
          expression: ''
        },
        cytoscapeStyles: [{
          selector: '.expression',
          style: {
            'height': '100px',
            'width': '100px',
            'font-size': '20px',
            'background-color': '#FEC106',
            'background-color': '#FEC106',
            'border-color': '#FEC106',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-expression-editor'
      },
      toCytoscape: function(data, language){

        var label = 'Expression'

        if(data.expression) {
          label = data.expression
        }

        return {
          label: label+(debug? ' ('+data._id+')':''),
        }

      },
      lifecycleData: {
        result: {
          label: 'result',
          exposeDefault: true
        }
      },
      edgeConditions: {
        true: {
          default: true,
          label: 'is true',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData!=undefined && vertexLifecycleData.result) {
              return true;
            }
            return false;
          }
        },
        false: {
          default: false,
          label: 'is false',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData!=undefined && vertexLifecycleData.result) {
              return false;
            }
            return true;
          }
        },
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        // Get the evaluated expression
        var result = WandererSingleton.evaluateVertexExpression(WandererSingleton.getVertexValue(cytoscapeVertex.id(), 'expression'), cytoscapeVertex.id())

        // Set the evaluated expression as a lifecycle value
        WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'result', result)

      }
    })

  }

}
