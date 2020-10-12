import WaitEditor from './components/WaitEditor.vue'

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-wait-editor', WaitEditor)

    var waitTimeouts = {}

    // Register the conclusion vertex
    WandererSingleton.registerVertexCollection({
      name: 'wait',
      builder: {
        label: 'Wait',
        color: '#563D7C',
        cytoscapeClasses: 'wait',
        cytoscapeCxtMenuSelector: '.wait',
        creatable: true,
        defaultFields: {
          seconds: 10
        },
        cytoscapeStyles: [{
          selector: '.wait',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#563D7C',
            'border-color': '#563D7C',
            'border-width': '5px',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-wait-editor'
      },
      lifecycleData: {
        up: {
          label: 'up',
          exposeDefault: false
        }
      },
      edgeConditions: {
        up: {
          default: true,
          label: 'up',
          condition: function (vertexLifecycleData) {
            if(vertexLifecycleData!=undefined && vertexLifecycleData.up) {
              return true;
            }
            return false;
          }
        }
      },
      edgeMethods: {
        reset: {
          label: 'Reset wait',
          method: (cytoscapeVertex, vertexData) => {

            WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'up', false)

          }
        }
      },
      toCytoscape: function(data, language){
        if(data.seconds){
          return {
            label: 'Wait '+data.seconds
          }
        }
        return {
          label: 'Wait'
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {

        // The time is not up for this vertex
        if(!WandererSingleton.getLifecycleValue(cytoscapeVertex.id(), 'up')) {

          // So if this node is currently not waiting
          if(waitTimeouts[cytoscapeVertex.id()] === undefined) {

            // Set the timeout defined inside the vertex data in seconds
            waitTimeouts[cytoscapeVertex.id()] = setTimeout(()=>{

              // Remember the wait time as up
              WandererSingleton.setLifecycleValue(cytoscapeVertex.id(), 'up', true)

              // Remove the message from the typing object
              delete waitTimeouts[cytoscapeVertex.id()]

            }, WandererSingleton.getVertexValue(cytoscapeVertex.id(), 'seconds')*1000)

          }
        }

      }
    })


    WandererSingleton.on('truncate', function() {

      // Clear all wait timeouts
      for (let i in waitTimeouts) {
        if(waitTimeouts.hasOwnProperty(i)) {
          clearTimeout(waitTimeouts[i]);
          delete waitTimeouts[i]
        }
      }

    })

  }

}
