
<template>

  <div>

    <portal to="toolbar" :order="2">
      <builder-button color="yellow" title="Connect" v-on:click="connectCheck()" v-if="possibleEdgeCollections.length&&selectedEdgeIds.length==0">
        <icon name="link"></icon>
      </builder-button>
    </portal>

    <portal to="modals" :order="1">
      <builder-modal title="Connect" :show="showModal" v-on:closeButton="showModal=false">

        <builder-button-group>
          <template v-for="edgeCollection in possibleEdgeCollections">
            <builder-button v-on:click="connect(edgeCollection)">{{edgeCollection}}</builder-button>
          </template>
        </builder-button-group>

      </builder-modal>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/link'
import Icon from 'vue-awesome/components/Icon'

export default {
  components: {
    Icon
  },
  data: function () {
    return {
      showModal: false
    }
  },
  computed: {
    selectedVertexIds () {
      return this.$store.state.wandererBuilder.selectedVertexIds
    },
    selectedEdgeIds () {
      return this.$store.state.wandererBuilder.selectedEdgeIds
    },
    possibleEdgeCollections () {
      if (this.selectedVertexIds.length == 2) {
        var fromCollection = this.$vueGraph.getVertexDataValue(this.selectedVertexIds[0], '_collection')
        var toCollection = this.$vueGraph.getVertexDataValue(this.selectedVertexIds[1], '_collection')

        if (fromCollection !== undefined && toCollection !== undefined ) {
          return this.$builder.getPossibleEdgeCollectionNames(fromCollection, toCollection)
        }
      }
      return false
    }
  },

  methods: {
    connectCheck () {
      if (this.possibleEdgeCollections.length == 1) {
        this.connect(this.possibleEdgeCollections[0])
      }
      if (this.possibleEdgeCollections.length > 1) {
        this.showModal = true
      }
    },
    connect (edgeCollectionName) {
      this.showModal = false
      this.$builder.addEdge (edgeCollectionName, this.selectedVertexIds[0], this.selectedVertexIds[1])
    }
  }
}
</script>

<style>

</style>
