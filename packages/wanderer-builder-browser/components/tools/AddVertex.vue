
<template>

  <div>

    <portal to="toolbar" :order="3">
      <builder-button color="yellow" title="Add vertex" v-on:click="showModal=true" v-if="selectedVertexIds.length==0||(selectedVertexIds.length==1&&selectedEdgeIds.length==0)">
        <icon name="plus"></icon>
      </builder-button>
    </portal>

    <portal to="modals" :order="1">
      <builder-modal title="Add new node" :show="showModal"  v-on:closeButton="showModal=false">

        <div class="flex flex-wrap -m-4" v-if="selectedVertexIds.length==0">
          <builder-vertex-card
            v-for="(collection, name) in possibleVertexCollections"
            v-if="collection.creatable"
            v-bind:key="name"
            :info-url="collection.infoUrl"
            :color="collection.color"
            :title="collection.label"
            :proprietary="collection.proprietary"
            v-on:click="add(name)">
            {{collection.description}}
          </builder-vertex-card>
        </div>

        <div class="flex flex-wrap -m-4">
          <template v-if="selectedVertexIds.length==1" v-for="(possibleOutgoing) in possibleOutgoingCollections">
            <builder-vertex-card
              v-for="(through, throughName) in possibleOutgoing.through"
              v-bind:key="throughName+'-'+possibleOutgoing.to.name"
              :info-url="possibleOutgoing.to.collection.infoUrl"
              :color="possibleOutgoing.to.collection.color"
              :title="possibleOutgoing.to.collection.label"
              :proprietary="possibleOutgoing.to.collection.proprietary"
              :through="through.label"
              v-on:click="append(possibleOutgoing.to.name, throughName)">
              {{possibleOutgoing.to.collection.description}}
            </builder-vertex-card>
          </template>
        </div>

      </builder-modal>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/plus'
import Icon from 'vue-awesome/components/Icon'

export default {
  data: function () {
    return {
      showModal: false
    }
  },
  components: {
    Icon
  },
  computed: {
    selectedVertexIds () {
      return this.$store.state.wandererBuilder.selectedVertexIds
    },
    selectedEdgeIds () {
      return this.$store.state.wandererBuilder.selectedEdgeIds
    },
    possibleOutgoingCollections () {
      if(this.selectedVertexIds.length == 1) {
        var returnCollections = {};

        var fromCollectionName = this.$vueGraph.getVertexDataValue(this.selectedVertexIds[0], '_collection')

        // Get the possible outgoing collection and its possible edge
        var possibleOutgoingCollections = this.$builder.getPossibleOutgoingCollections(fromCollectionName)

        if(possibleOutgoingCollections) {
          possibleOutgoingCollections = possibleOutgoingCollections.plain()

          return possibleOutgoingCollections
        }

      }
    },
    possibleVertexCollections () {
      var vertexCollections = this.$builder.getAllVertexCollectionProps()

      if(vertexCollections) {
        vertexCollections = vertexCollections.plain()
        return vertexCollections
      }

    }
  },
  methods: {
    append(vertexCollectionName, edgeCollectionName) {

      this.$builder.appendVertex(this.selectedVertexIds[0], vertexCollectionName, edgeCollectionName)

      this.showModal = false
    },
    add (vertexCollectionName) {

      // Randomize new vertex position
      var x = (Math.floor(Math.random() * (200 - 100 + 1) + 100))
      var y = (Math.floor(Math.random() * (200 - 100 + 1) + 100))

      this.$builder.addVertex(vertexCollectionName, x, y)

      this.showModal = false
    }
  }
}
</script>

<style>

</style>
