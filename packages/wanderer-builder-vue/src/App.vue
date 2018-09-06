
<template>
  <div>

    <toolbar />
    <cytoscape />

    <modal :title="editVertexCollection.label" :show="showVertexEditorModal" >
        <component v-bind:is="editVertexCollection.editorComponent"></component>
    </modal>

  </div>
</template>

<script>

import Toolbar from './components/Toolbar.vue'
import Cytoscape from './components/Cytoscape.vue'
import Modal from './components/Modal.vue'

export default {
  name: 'App',
  components: {
    Toolbar,
    Cytoscape,
    Modal
  },
  computed: {
    showVertexEditorModal () {
      if (this.$brain.store.state.editVertex !== 0) {
        return true
      }
      return false
    },
    editVertexCollection () {
      if (this.$brain.store.state.editVertex !== 0) {
        var collection = this.$brain.getVertexCollectionById(this.$brain.store.state.editVertex)
        if (collection) {
          return collection
        }
      }
      return false
    }
  }
}
</script>

<style>

</style>
