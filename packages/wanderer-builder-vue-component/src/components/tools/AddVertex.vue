
<template>

  <div>

    <portal to="toolbar" :order="3">
      <button class="btn btn-secondary navbar-btn" title="Add vertex" v-on:click="showModal=true" v-if="selectedVertexIds.length==0||selectedVertexIds.length==1">
        <icon name="plus"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal title="Add vertex" :show="showModal"  v-on:closeButton="showModal=false">

        <div v-if="selectedVertexIds.length==0">

            <button class="btn btn-secondary mr-4 mb-4" v-for="(collection, name) in possibleVertexCollections" v-bind:key="name" :style="'background-color:'+collection.builder.color+';border-color:'+collection.builder.color+';'" v-on:click="add(name)">
              <icon name="plus"></icon> add {{collection.builder.label}}
            </button>

        </div>

        <div v-if="selectedVertexIds.length==1">

          <span v-for="(possibleOutgoing) in possibleOutgoingCollections" v-bind:key="possibleOutgoing.to.name">

            <button class="btn btn-secondary mr-4 mb-4" v-for="(through) in possibleOutgoing.through" v-bind:key="possibleOutgoing.to.name" :style="'background-color:'+possibleOutgoing.to.builder.color+';border-color:'+possibleOutgoing.to.builder.color+';'" v-on:click="append(possibleOutgoing.to.name, through.name)">
              <icon name="plus"></icon> {{through.builder.label}} {{possibleOutgoing.to.builder.label}}
            </button>

          </span>

        </div>

      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/plus'
import Icon from 'vue-awesome/components/Icon'
import WandererSingleton from 'wanderer-singleton'
import WandererBuilderSingleton from 'wanderer-builder-singleton'
import WandererCytoscapeSingleton from 'wanderer-cytoscape-singleton'

// import Brain from 'wanderer-brain'

export default {
  data: function () {
    return {
      showModal: false
    }
  },
  components: {
    Modal, Icon
  },
  computed: {
    selectedVertexIds () {
      return this.$store.state.wanderer.builder.selectedVertexIds
    },
    // oneSelected () {
    //   if (this.selectedVertexIds.length == 1){
    //     return true
    //   }
    //   return false
    // },
    possibleOutgoingCollections () {
      if(this.selectedVertexIds.length == 1) {
        var returnCollections = {};

        // Get the collection name from the selected vertex
        var fromCollectionName = this.$store.state.wanderer.vertexDocumentData[this.selectedVertexIds[0]]._collection

        // Get the possible outgoing collection and its possible edge
        var possibleOutgoingCollections = WandererBuilderSingleton.getPossibleOutgoingCollections(fromCollectionName)

        return possibleOutgoingCollections
      }
    },
    // possibleChildCollections () {
    //   if(this.selectedVertexIds.length == 1) {
    //     // Get the collection name from the selected vertex
    //     var fromCollectionName = this.$store.state.wanderer.vertexDocumentData[this.selectedVertexIds[0]]._collection
    //
    //     // Get the possible child collections
    //     return WandererBuilderSingleton.getPossibleChildCollections(fromCollectionName)
    //   }
    // },
    possibleVertexCollections () {
      // No source vertex is selected

      var returnCollections = {}

      var vertexCollections = WandererSingleton.getVertexCollections()

      if(vertexCollections){

        // Only return creatable collections
        for (var collectionName in vertexCollections) {
          if(vertexCollections[collectionName].builder && vertexCollections[collectionName].builder.creatable){
            returnCollections[collectionName] = vertexCollections[collectionName]
          }
        }

      }

      return returnCollections

    }
  },
  methods: {
    append(vertexCollectionName, edgeCollectionName) {

      WandererBuilderSingleton.appendVertex(this.selectedVertexIds[0], vertexCollectionName, edgeCollectionName)

      this.showModal = false
    },
    // inject(vertexCollectionName) {
    //
    //   WandererBuilderSingleton.injectVertex(this.selectedVertexIds[0], vertexCollectionName)
    //
    //   this.showModal = false
    // },
    add (vertexCollectionName) {

      var x = (Math.floor(Math.random() * (200 - 100 + 1) + 100))
      var y = (Math.floor(Math.random() * (200 - 100 + 1) + 100))

      WandererBuilderSingleton.addVertex(vertexCollectionName, x, y)

      this.showModal = false
    }
  }
}
</script>

<style>

</style>
