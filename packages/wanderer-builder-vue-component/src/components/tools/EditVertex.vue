
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
          <language-switcher />

          <div class="form-group" v-if="showSections">
            <label for="parent">Section</label>
            <select id="parent" class="form-control" v-model="_parent">
              <option :value="false">none</option>
              <option
                v-for="section in sections"
                :value="section._id">{{section.title[currentLanguage]}}</option>
            </select>
          </div>

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
    sections () {
      let returnSections = [];
      for(let i in this.$store.state.wanderer.vertexDocumentData) {
        if(this.$store.state.wanderer.vertexDocumentData[i]._collection == 'section') {
          returnSections.push(this.$store.state.wanderer.vertexDocumentData[i]);
        }
      }
      return returnSections
    },
    showSections () {
      if (this.$store.state.wanderer.builder.editVertex !== 0) {
        let collectionName = this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.builder.editVertex]._collection
        if(collectionName == 'section' || collectionName == 'flow') {
          return false
        } else {
          return true
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
