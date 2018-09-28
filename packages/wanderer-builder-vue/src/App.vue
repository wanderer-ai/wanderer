
<template>
  <div>

    <toolbar />
    <cytoscape />

    <modal :title="editVertexCollection.label" :show="showVertexEditorModal" >
        <component v-bind:is="editVertexCollection.editorComponent"></component>
        <!--<QuestionEditorComponent />-->
    </modal>

  </div>
</template>

<script>

import Toolbar from './components/Toolbar.vue'
import Cytoscape from './components/Cytoscape.vue'
import Modal from './components/Modal.vue'
import Brain from 'wanderer-brain'

export default {
  name: 'App',
  components: {
    Toolbar,
    Cytoscape,
    Modal
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
    }
  }
}
</script>

<style>

</style>
