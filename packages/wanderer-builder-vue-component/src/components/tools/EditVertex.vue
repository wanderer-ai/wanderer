
<template>

  <div>

    <portal to="toolbar" :order="1">
      <button class="btn btn-primary navbar-btn" title="Edit vertex" v-on:click="openVertexEditorModal()" v-if="selectedVertices==1">
        <icon name="edit"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal :title="editVertexCollection.label" :show="showVertexEditorModal" v-on:closeButton="closeVertexEditorModal()">

        <div v-if="isImmutable" class="alert alert-warning" role="alert">
          Warning! This vertex is not part of the current flow! Maybe it was dynamically imported. You can edit this node. But it will not be saved into your flow!
        </div>

        <component v-bind:is="editVertexCollection.component"></component>

        <language-switcher />

      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/edit'
import Icon from 'vue-awesome/components/Icon'
import WandererSingleton from 'wanderer-singleton'
import LanguageSwitcher from '../LanguageSwitcher.vue'
import WandererBuilder from 'wanderer-builder-singleton'

export default {
  components: {
    Modal, Icon, LanguageSwitcher
  },
  computed: {
    showVertexEditorModal () {
      if (this.$store.state.wanderer.builder.editVertex !== 0) {
        return true
      }
      return false
    },
    editVertexCollection () {
      if (this.$store.state.wanderer.builder.editVertex !== 0) {
        var collection = this.$wanderer.getVertexCollection(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.builder.editVertex]._collection).builder
        if (collection) {
          return collection
        }
      }
      return false
    },
    selectedVertices () {
      return this.$store.state.wanderer.builder.selectedVertexIds.length
    },
    isImmutable () {
      if (this.$store.state.wanderer.builder.editVertex !== 0) {
        return this.$wanderer.getVertexValue(this.$store.state.wanderer.builder.editVertex, '_immutable')
      }
    },
    currentLanguage () {
      return this.$store.state.wanderer.currentLanguage;
    }
  },
  methods: {
    closeVertexEditorModal () {
      this.$store.commit('wanderer/builder/setEditVertex', 0)

      // Rebuild cytoscape data
      for(let i in this.$store.state.wanderer.vertexDocumentIds){
        WandererSingleton.vertexToCytoscape(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.vertexDocumentIds[i]])
      }
      for(let i in this.$store.state.wanderer.edgeDocumentIds){
        WandererSingleton.edgeToCytoscape(this.$store.state.wanderer.edgeDocumentData[this.$store.state.wanderer.edgeDocumentIds[i]])
      }
    },
    openVertexEditorModal () {
      let selectedVertexIds = this.$wandererBuilder.getSelectedVertexIds()
      if (selectedVertexIds.length === 1) {
        this.$store.commit('wanderer/builder/setEditVertex', selectedVertexIds[0])
      }
    }

  }
}
</script>

<style>

</style>
