
<template>

  <div>

    <portal to="toolbar" :order="1">
      <button class="btn btn-primary navbar-btn" title="Edit edge" v-on:click="openEdgeEditorModal()" v-if="selectedEdges==1">
        <icon name="edit"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal :title="editEdgeCollection.label" :show="showEdgeEditorModal" v-on:closeButton="closeEdgeEditorModal()">
        <component v-bind:is="editEdgeCollection.component"></component>
        <!-- <language-switcher /> -->
      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/edit'
import Icon from 'vue-awesome/components/Icon'
import WandererSingleton from 'wanderer-singleton'
// import LanguageSwitcher from '../LanguageSwitcher.vue'

export default {
  components: {
    Modal, Icon
  },
  computed: {
    showEdgeEditorModal () {
      if (this.$store.state.wanderer.builder.editEdge !== 0) {
        return true
      }
      return false
    },
    editEdgeCollection () {
      if (this.$store.state.wanderer.builder.editEdge !== 0) {
        var collection = this.$wanderer.getEdgeCollection(this.$store.state.wanderer.edgeDocumentData[this.$store.state.wanderer.builder.editEdge]._collection).builder
        if (collection) {
          return collection
        }
      }
      return false
    },
    selectedEdges () {
      return this.$store.state.wanderer.builder.selectedEdgeIds.length
    }
  },
  methods: {
    closeEdgeEditorModal () {
      this.$store.commit('wanderer/builder/setEditEdge', 0)

      // Rebuild cytoscape data
      for(let i in this.$store.state.wanderer.edgeDocumentIds){
        WandererSingleton.edgeToCytoscape(this.$store.state.wanderer.edgeDocumentData[this.$store.state.wanderer.edgeDocumentIds[i]])
      }
    },
    openEdgeEditorModal () {
      let selectedEdgeIds = this.$wandererBuilder.getSelectedEdgeIds()
      if (selectedEdgeIds.length === 1) {
        this.$store.commit('wanderer/builder/setEditEdge', selectedEdgeIds[0])
      }
    }

  }
}
</script>

<style>

</style>
