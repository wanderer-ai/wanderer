
<template>

  <div>

    <portal to="toolbar" :order="1">
      <button class="btn btn-primary navbar-btn" title="Edit" v-on:click="openVertexEditorModal()" v-if="selectedVertices==1">
        <icon name="edit"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal :title="editVertexCollection.label" :show="showVertexEditorModal" v-on:closeButton="closeVertexEditorModal()">
          <component v-bind:is="editVertexCollection.editorComponent"></component>
      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/edit'
import Icon from 'vue-awesome/components/Icon'

import Brain from 'wanderer-brain'

export default {
  components: {
    Modal, Icon
  },
  computed: {
    showVertexEditorModal () {
      if (this.$store.state.brain.editVertex !== 0) {
        return true
      }
      return false
    },
    editVertexCollection () {
      if (this.$store.state.brain.editVertex !== 0) {
        var collection = Brain.getVertexCollectionById(this.$store.state.brain.editVertex)
        if (collection) {
          return collection
        }
      }
      return false
    },
    selectedVertices () {
      return this.$store.state.brain.selectedVertexIds.length
    }
  },
  methods: {
    closeVertexEditorModal () {
      this.$store.commit('brain/setEditVertex', 0)
    },
    openVertexEditorModal () {
      let selectedVertexIds = Brain.getSelectedVertexIds()
      if (selectedVertexIds.length === 1) {
        this.$store.commit('brain/setEditVertex', selectedVertexIds[0])
      }
    }

  }
}
</script>

<style>

</style>
