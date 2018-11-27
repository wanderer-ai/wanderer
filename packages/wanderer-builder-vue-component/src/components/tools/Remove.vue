
<template>

  <div>

    <portal to="toolbar" :order="2">
      <button class="btn btn-danger navbar-btn" title="Delete" v-on:click="showModal=true" v-if="selectedVertexIds.length||selectedEdgeIds.length">
        <icon name="trash"></icon>
      </button>
    </portal>

    <portal to="modals" :order="2">
      <modal title="Delete" :show="showModal" v-on:closeButton="showModal=false">

        <p>
          Warning! Removing edges or nodes is permanent. It can not be undone!
          If you want to keep your vertices simply disconnect them and drag them away.
        </p>

        <p>
          <button v-if="selectedVertexIds.length" class="btn btn-danger" v-on:click="removeVertices()" >
            Remove {{selectedVertexIds.length}} selected vertices and all connected edges forever
          </button>
        </p>
        <p>
          <button v-if="selectedEdgeIds.length" class="btn btn-danger" v-on:click="removeEdges()" >
            Remove {{selectedEdgeIds.length}} selected edges forever
          </button>
        </p>

      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/trash'
import Icon from 'vue-awesome/components/Icon'

// import Brain from 'wanderer-brain'

export default {
  components: {
    Modal, Icon
  },
  data: function () {
    return {
      showModal: false
    }
  },
  computed: {
    selectedVertexIds () {
      return this.$store.state.wanderer.builder.selectedVertexIds
    },
    selectedEdgeIds () {
      return this.$store.state.wanderer.builder.selectedEdgeIds
    }
  },
  methods: {
    removeVertices () {
      this.showModal = false
      var component = this
      let vertexIds = this.$wandererBuilder.getSelectedVertexIds()

      for (let i in vertexIds) {
        // Remove the connected edges
        this.$cytoscape.cy.getElementById(vertexIds[i]).connectedEdges().forEach(function (edge) {
          component.$wanderer.removeEdge(edge.id())
        })
        // Remove the vertex
        this.$wanderer.removeVertex(vertexIds[i])
      }
    },
    removeEdges () {
      this.showModal = false

      let edgeIds = this.$wandererBuilder.getSelectedEdgeIds()

      for (let i in edgeIds) {
        // Remove the edge
        this.$wanderer.removeEdge(edgeIds[i])
      }
    }
  }
}
</script>

<style>

</style>
