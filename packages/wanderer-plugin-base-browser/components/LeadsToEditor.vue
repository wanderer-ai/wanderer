<template>
  <div>

    <builder-select-input label="Type" v-model="type" :options="types"/>

    <builder-range-input label="Priority" type="range" v-model="priority" min="0" max="100" />

    <builder-select-input label="Condition" v-model="condition" :options="edgeConditions"/>

    <div v-if="type!='not' && condition!='inactive'">
      <builder-select-input label="Expose" v-model="expose" :options="lifecycleData"/>

      <div v-if="expose!='none'">
        <builder-text-input label="Expose Alias" v-model="name" />
      </div>

    </div>

  </div>
</template>

<script>

export default {
  computed: {
    type: {
      get: function () {
        return this.$builder.getEdgeDataValue('type')
      },
      set: function (value) {
        this.$builder.setEdgeDataValue('type', value)
      }
    },
    priority: {
      get: function () {
        return this.$builder.getEdgeDataValue('priority')
      },
      set: function (value) {
        this.$builder.setEdgeDataValue('priority', value)
      }
    },
    name: {
      get: function () {
        return this.$builder.getEdgeDataValue('name')
      },
      set: function (value) {
        this.$builder.setEdgeDataValue('name', value)
      }
    },
    expose: {
      get: function () {
        return this.$builder.getEdgeDataValue('expose')
      },
      set: function (value) {
        this.$builder.setEdgeDataValue('expose', value)
      }
    },
    condition: {
      get: function () {
        return this.$builder.getEdgeDataValue('condition')
      },
      set: function (value) {
        this.$builder.setEdgeDataValue('condition', value)
      }
    },
    types: function () {
      return {
        'or': 'default (Try to activate the target)',
        'and': 'require (Required for target activation)',
        'not': 'forbid (Forbid activation of the target)'
      }
    },
    lifecycleData: function () {
      var returnLifecycleData = {
        'none': 'none'
      }
      if (this.$store.state.wandererBuilder.editEdge !== 0) {
        let cytoscapeEdge = this.$builder.cytoscape.getElementById(this.$store.state.wandererBuilder.editEdge)
        let cytoscapeSourceNode = cytoscapeEdge.source()
        let cytoscapeSourceNodeId = cytoscapeSourceNode.id()
        let sourceNodeCollectionProps = this.$builder.getVertexCollectionPropsById(cytoscapeSourceNodeId)
        sourceNodeCollectionProps.with('lifecycleData', (lifecycleData) => {
          lifecycleData.each((lifecycleDataItem, key) => {
            returnLifecycleData[key] = lifecycleDataItem.get('label')+(lifecycleDataItem.is('exposeDefault')?' (default)':'')
          })
        })
      }
      return returnLifecycleData
    },
    edgeConditions: function () {
      var returnEdgeConditions = {
        'inactive': 'The node is inactive',
        'active': 'The node is activated'
      }
      if (this.$store.state.wandererBuilder.editEdge !== 0) {
        let cytoscapeEdge = this.$builder.cytoscape.getElementById(this.$store.state.wandererBuilder.editEdge)
        let cytoscapeSourceNode = cytoscapeEdge.source()
        let cytoscapeSourceNodeId = cytoscapeSourceNode.id()
        let sourceNodeCollectionProps = this.$builder.getVertexCollectionPropsById(cytoscapeSourceNodeId)
        sourceNodeCollectionProps.with('edgeConditions', (edgeConditions) => {
          edgeConditions.each((edgeCondition, key) => {
            returnEdgeConditions[key] = edgeCondition.get('label')+(edgeCondition.is('default')?' (default)':'')
          })
        })
      }
      return returnEdgeConditions
    }
  }
  // computed: {

  //   method: WandererBuilder.getEdgeModel('method'),
  //   condition: WandererBuilder.getEdgeModel('condition'),
  //

  //   edgeConditions () {
  //     if (this.$store.state.wanderer.builder.editEdge !== 0) {
  //       let cytoscapeEdge = WandererCytoscapeSingleton.cy.getElementById(this.$store.state.wanderer.builder.editEdge)
  //       let cytoscapeSourceNode = cytoscapeEdge.source()
  //       let cytoscapeSourceNodeId = cytoscapeSourceNode.id()
  //       let cytoscapeSourceNodeData = this.$store.state.wanderer.vertexDocumentData[cytoscapeSourceNodeId]
  //       let sourceNodeCollection = WandererSingleton.getVertexCollection(cytoscapeSourceNodeData._collection)
  //       if(sourceNodeCollection.edgeConditions != undefined) {
  //         return sourceNodeCollection.edgeConditions
  //       }
  //     }
  //   },
  //   edgeMethods () {
  //     if (this.$store.state.wanderer.builder.editEdge !== 0) {
  //       let cytoscapeEdge = WandererCytoscapeSingleton.cy.getElementById(this.$store.state.wanderer.builder.editEdge)
  //       let cytoscapeTargetNode = cytoscapeEdge.target()
  //       let cytoscapeTargetNodeId = cytoscapeTargetNode.id()
  //       let cytoscapeTargetNodeData = this.$store.state.wanderer.vertexDocumentData[cytoscapeTargetNodeId]
  //       let targetNodeCollection = WandererSingleton.getVertexCollection(cytoscapeTargetNodeData._collection)
  //       if(targetNodeCollection.edgeMethods != undefined) {
  //         return targetNodeCollection.edgeMethods
  //       }
  //     }
  //   }
  // }
}
</script>

<style>

</style>
