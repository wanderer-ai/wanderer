
<template>

  <div>

    <portal to="toolbar" :order="1">
      <button class="btn btn-primary navbar-btn" title="Edit vertex" v-on:click="openVertexEditorModal()" v-if="selectedVertices==1">
        <icon name="edit"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal :title="editVertexCollection.label" :show="showVertexEditorModal" v-on:closeButton="closeVertexEditorModal()">
          <component v-bind:is="editVertexCollection.component"></component>

          <div class="form-group" v-if="showParents">
            <label for="parent">Parent</label>
            <select id="parent" class="form-control" v-model="_parent">
              <option :value="false">none</option>
              <option
                v-for="(parentLabel, parentId) in availableParents"
                :value="parentId">{{parentLabel}}</option>
            </select>
          </div>

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
    _parent: WandererBuilder.getVertexModel('_parent'),
    availableParents () {
      let returnParents = {};
      for(let i in this.$store.state.wanderer.vertexDocumentData) {
        var collection = this.$wanderer.getVertexCollection(this.$store.state.wanderer.vertexDocumentData[i]._collection)
        if(collection.builder.canBeParent != undefined && collection.builder.canBeParent) {
          returnParents[this.$store.state.wanderer.vertexDocumentData[i]._id] = collection.builder.parentLabel(this.$store.state.wanderer.vertexDocumentData[i], this.currentLanguage);
        }
      }
      return returnParents
    },
    showParents () {
      if (this.$store.state.wanderer.builder.editVertex !== 0) {
        var collection = this.$wanderer.getVertexCollection(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.builder.editVertex]._collection)
        if(collection.builder.canBeChild != undefined && collection.builder.canBeChild) {
          return true
        } else {
          return false
        }
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
