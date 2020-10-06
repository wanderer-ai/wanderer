
<template>

  <div>

    <portal to="toolbar" :order="2">
      <button class="btn btn-danger navbar-btn" title="Unlink" v-on:click="unlinkVertex()" v-if="selectedVertexIds.length">
        <icon name="unlink"></icon>
      </button>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/unlink'
import Icon from 'vue-awesome/components/Icon'

import WandererSingleton from 'wanderer-singleton'
import WandererBuilderSingleton from 'wanderer-builder-singleton'
import WandererCytoscapeSingleton from 'wanderer-cytoscape-singleton'

// import Brain from 'wanderer-brain'

export default {
  components: {
    Modal, Icon
  },
  data: function () {
    return {

    }
  },
  computed: {
    selectedVertexIds () {
      return this.$store.state.wanderer.builder.selectedVertexIds
    }
  },
  methods: {
    unlinkVertex () {

      var component = this

      let selectedVertexIds = WandererBuilderSingleton.getSelectedVertexIds()

      for (let i in selectedVertexIds) {

        // Get the cytoscape vertex
        let cyVertex = WandererCytoscapeSingleton.cy.getElementById(selectedVertexIds[i])

        let outboundEdges = WandererSingleton.getOutboundCytoscapeEdges(cyVertex)
        for(var e in outboundEdges) {
          WandererSingleton.removeEdge(outboundEdges[e].id())
        }

        let inboundEdges = this.$wanderer.getInboundCytoscapeEdges(cyVertex)
        for(var e in inboundEdges) {
          WandererSingleton.removeEdge(inboundEdges[e].id())
        }

      }
    }
  }
}
</script>

<style>

</style>
