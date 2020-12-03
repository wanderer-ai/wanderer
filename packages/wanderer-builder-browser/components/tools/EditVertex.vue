
<template>

  <div>

    <portal to="toolbar" :order="1">
      <builder-button title="Edit vertex" v-on:click="openVertexEditorModal()" v-if="selectedVertices==1">
        <icon name="edit"></icon>
      </builder-button>
    </portal>

    <portal to="modals" :order="1">
      <builder-modal :title="(editVertexCollection?editVertexCollection.label:'Unknown collection')" :show="showVertexEditorModal" v-on:closeButton="closeVertexEditorModal()">

        <div v-if="isImmutable" class="alert alert-warning" role="alert">
          Warning! This vertex is not part of the current flow! Maybe it was dynamically imported. You can edit this node. But it will not be saved into your flow!
        </div>

        <div v-if="!editVertexCollection" class="alert alert-warning" role="alert">
          You cannot edit this vertex. This vertex is part of a unknown collection.
        </div>

        <builder-text-input v-if="debug" label="ID" :disabled="true" v-model="$store.state.wandererBuilder.editVertex" />

        <component v-if="editVertexCollection" v-bind:is="editVertexCollection.component"></component>

        <template v-slot:buttons>
          <language-switcher size="small" v-if="editVertexCollection" />
        </template>

      </builder-modal>
    </portal>



  </div>

</template>

<script>

import 'vue-awesome/icons/edit'
import Icon from 'vue-awesome/components/Icon'
import LanguageSwitcher from '../LanguageSwitcher.vue'

export default {
  components: {
    Icon, LanguageSwitcher
  },
  computed: {
    debug () {
      return this.$store.state.wandererBuilder.debug
    },
    showVertexEditorModal () {
      if (this.$store.state.wandererBuilder.editVertex !== 0) {
        return true
      }
      return false
    },
    editVertexCollection () {
      if (this.$store.state.wandererBuilder.editVertex !== 0) {
        var vertexCollectionProps = this.$builder.getVertexCollectionPropsById(this.$store.state.wandererBuilder.editVertex)
        if(vertexCollectionProps) {
          return vertexCollectionProps.plain()
        }
      }
      return false
    },
    selectedVertices () {
      return this.$store.state.wandererBuilder.selectedVertexIds.length
    },
    isImmutable () {
      if (this.$store.state.wandererBuilder.editVertex !== 0) {
        return this.$vueGraph.getVertexDataValue(this.$store.state.wandererBuilder.editVertex, '_immutable')
      }
    },
    currentLanguage () {
      return this.$store.state.wandererBuilder.currentLanguage;
    }
  },
  methods: {
    closeVertexEditorModal () {
      this.$builder.rebuildCytoscapeVertexById(this.$store.state.wandererBuilder.editVertex)
      this.$store.commit('wandererBuilder/setEditVertex', 0)
    },
    openVertexEditorModal () {
      let selectedVertexIds = this.$builder.getSelectedCytoscapeVertexIds()
      if (selectedVertexIds.length === 1) {
        this.$store.commit('wandererBuilder/setEditVertex', selectedVertexIds[0])
      }
    }

  }
}
</script>

<style>

</style>
