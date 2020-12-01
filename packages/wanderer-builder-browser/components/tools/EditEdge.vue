
<template>

  <div>

    <portal to="toolbar" :order="1">
      <builder-button class="btn btn-primary navbar-btn" title="Edit edge" v-on:click="openEdgeEditorModal()" v-if="selectedEdges==1">
        <icon name="edit"></icon>
      </builder-button>
    </portal>

    <portal to="modals" :order="1">
      <builder-modal :title="editEdgeCollection.label" :show="showEdgeEditorModal" v-on:closeButton="closeEdgeEditorModal()">

        <div v-if="isImmutable" class="alert alert-warning" role="alert">
          Warning! This edge is not part of the current flow! Maybe it was dynamically imported. You can edit this edge. But it will not be saved into your flow!
        </div>

        <component v-bind:is="editEdgeCollection.component"></component>

      </builder-modal>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/edit'
import Icon from 'vue-awesome/components/Icon'

export default {
  components: {
    Icon
  },
  computed: {
    showEdgeEditorModal () {
      if (this.$store.state.wandererBuilder.editEdge !== 0) {
        return true
      }
      return false
    },
    editEdgeCollection () {
      if (this.$store.state.wandererBuilder.editEdge !== 0) {
        return this.$builder.getEdgeCollectionPropsById(this.$store.state.wandererBuilder.editEdge).plain()
      }
      return false
    },
    selectedEdges () {
      return this.$store.state.wandererBuilder.selectedEdgeIds.length
    },
    isImmutable () {
      if (this.$store.state.wandererBuilder.editEdge !== 0) {
        return this.$vueGraph.getEdgeDataValue(this.$store.state.wandererBuilder.editEdge, '_immutable')
      }
    }
  },
  methods: {
    closeEdgeEditorModal () {
      this.$builder.rebuildCytoscapeEdgeById(this.$store.state.wandererBuilder.editEdge)
      this.$store.commit('wandererBuilder/setEditEdge', 0)
    },
    openEdgeEditorModal () {
      let selectedEdgeIds = this.$builder.getSelectedCytoscapeEdgeIds()
      if (selectedEdgeIds.length === 1) {
        this.$store.commit('wandererBuilder/setEditEdge', selectedEdgeIds[0])
      }
    }

  }
}
</script>

<style>

</style>
