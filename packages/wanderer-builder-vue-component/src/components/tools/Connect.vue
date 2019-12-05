
<template>

  <div>

    <portal to="toolbar" :order="2">
      <button class="btn btn-warning navbar-btn" title="Connect" v-on:click="connectCheck()" v-if="possibleEdgeCollections.length">
        <icon name="link"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal title="Connect" :show="showModal" v-on:closeButton="showModal=false">
        Select edge type

        <div v-for="edgeCollection in possibleEdgeCollections" :key="edgeCollection">
          <div class="btn btn-secondary" v-on:click="connect(edgeCollection)">{{edgeCollection}}</div>
        </div>

      </modal>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/link'
import Icon from 'vue-awesome/components/Icon'

import Modal from '../Modal.vue'

import WandererBuilderSingleton from 'wanderer-builder-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {
  components: {
    Icon, Modal
  },
  data: function () {
    return {
      showModal: false
    }
  },
  computed: {
    selectedVertexIds () {
      return this.$store.state.wanderer.builder.selectedVertexIds
    },
    possibleEdgeCollections () {
      if (this.selectedVertexIds.length == 2){
        if (WandererStoreSingleton.store.state.wanderer.vertexDocumentData[this.selectedVertexIds[0]] !== undefined &&
           WandererStoreSingleton.store.state.wanderer.vertexDocumentData[this.selectedVertexIds[1]] !== undefined ){
          let fromCollection = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[this.selectedVertexIds[0]]._collection
          let toCollection = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[this.selectedVertexIds[1]]._collection
          return WandererBuilderSingleton.getPossibleEdgeCollections(fromCollection, toCollection)
        }
      }
      return false
    }
  },

  methods: {
    connectCheck () {
      if (this.possibleEdgeCollections.length == 1) {
        this.connect(this.possibleEdgeCollections[0])
      }
      if (this.possibleEdgeCollections.length > 1) {
        this.showModal = true
      }
    },
    connect (edgeCollectionName) {
      this.showModal = false
      WandererBuilderSingleton.addEdge (edgeCollectionName, this.selectedVertexIds[0], this.selectedVertexIds[1])
    }
  }
}
</script>

<style>

</style>
