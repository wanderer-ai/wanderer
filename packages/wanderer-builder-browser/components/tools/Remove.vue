
<template>

  <div>

    <portal to="toolbar" :order="2">
      <builder-button color="red" title="Delete" v-on:click="showModal=true" v-if="selectedVertexIds.length||selectedEdgeIds.length">
        <icon name="trash"></icon>
      </builder-button>
    </portal>

    <portal to="modals" :order="2">
      <builder-modal title="Delete" :show="showModal" v-on:closeButton="showModal=false">

        <p>
          Warning! Removing edges or nodes is permanent. It can not be undone!
          If you want to keep your vertices simply disconnect them and drag them away.
        </p>

        <p>
          <builder-button v-if="selectedVertexIds.length" class="btn btn-danger" v-on:click="removeVertices()">
            Remove {{selectedVertexIds.length}} selected vertices and all connected edges
          </builder-button>
        </p>

        <p>
          <builder-button v-if="selectedVertexIds.length" class="btn btn-danger" v-on:click="unlinkVertices()">
            Unlink {{selectedVertexIds.length}} selected vertices from all the connected edges
          </builder-button>
        </p>

        <p>
          <builder-button v-if="selectedEdgeIds.length" class="btn btn-danger" v-on:click="removeEdges()" >
            Remove {{selectedEdgeIds.length}} selected edges
          </builder-button>
        </p>

      </builder-modal>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/trash'
import Icon from 'vue-awesome/components/Icon'

// import Brain from 'wanderer-brain'

export default {
  components: {
    Icon
  },
  data: function () {
    return {
      showModal: false
    }
  },
  mounted: function () {
    var that = this

    // Add event for delete key
    document.addEventListener("keydown", event => {
      if (event.isComposing || event.keyCode === 46) {

        // Make sure no edit vertex was set
        // So we can make sure we are not in an edit field
        // Additionally this should only work if one ore more vertices are selected
        if(!that.isEditVertexSet&&that.selectedVertexIds.length) {
          that.showModal = true
        }

        return;
      }
    });

    // Add enter key event
    // Add event for delete key
    document.addEventListener("keydown", event => {

      if (event.isComposing || event.keyCode === 13) {

        if(that.showModal) {
          that.removeVertices()
          that.showModal = false
        }

        return;
      }
    });

  },
  computed: {
    selectedVertexIds () {
      return this.$store.state.wandererBuilder.selectedVertexIds
    },
    selectedEdgeIds () {
      return this.$store.state.wandererBuilder.selectedEdgeIds
    },
    isEditVertexSet () {
      if (this.$store.state.wandererBuilder.editVertex !== 0) {
        return true
      }
      return false
    },
  },
  methods: {
    removeVertices () {
      this.showModal = false
      var component = this
      let vertexIds = this.$builder.getSelectedCytoscapeVertexIds()

      for (let i in vertexIds) {

        var isOrigin = this.$vueGraph.getVertexDataValue(vertexIds[i], '_origin')

        if(isOrigin) {
          this.$store.dispatch('wandererBuilder/addAlert',{message:'You cannot remove the origin node',type:'warning'})
        } else {

          // Remove the connected edges
          this.$builder.cytoscape.getElementById(vertexIds[i]).connectedEdges().forEach((edge) => {
            this.$wanderer.subscriber.emit('removeEdgeById', edge.id)
          })

          // Remove the vertex
          this.$wanderer.subscriber.emit('removeVertexById', vertexIds[i])

        }

      }
    },
    removeEdges () {
      this.showModal = false
      let edgeIds = this.$builder.getSelectedCytoscapeEdgeIds()
      for (let i in edgeIds) {
        this.$wanderer.subscriber.emit('removeEdgeById', edgeIds[i])
      }
    },
    unlinkVertices () {

      this.showModal = false
      var component = this
      let vertexIds = this.$builder.getSelectedCytoscapeVertexIds()

      for (let i in vertexIds) {

        // Remove the connected edges
        this.$builder.cytoscape.getElementById(vertexIds[i]).connectedEdges().forEach((edge) => {
          this.$wanderer.subscriber.emit('removeEdgeById', edge.id())
        })

      }
    }
  }
}
</script>

<style>

</style>
