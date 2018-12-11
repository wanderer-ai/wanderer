
<template>

  <div>

    <portal to="toolbar" :order="1">
      <button class="btn btn-primary navbar-btn" title="Edit" v-on:click="openVertexEditorModal()" v-if="selectedVertices==1">
        <icon name="edit"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal :title="editVertexCollection.label" :show="showVertexEditorModal" v-on:closeButton="closeVertexEditorModal()">
          <component v-bind:is="editVertexCollection.component"></component>
      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/edit'
import Icon from 'vue-awesome/components/Icon'
import WandererSingleton from 'wanderer-singleton'

// import Brain from 'wanderer-brain'

export default {
  components: {
    Modal, Icon
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
        console.log(collection)
        if (collection) {
          return collection
        }
      }
      return false
    },
    selectedVertices () {
      return this.$store.state.wanderer.builder.selectedVertexIds.length
    }
  },
  methods: {
    closeVertexEditorModal () {
      this.$store.commit('wanderer/builder/setEditVertex', 0)

      // Rebuild cytoscape data
      for(let i in this.$store.state.wanderer.vertexDocumentIds){
        WandererSingleton.toCytoscape(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.vertexDocumentIds[i]])
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
