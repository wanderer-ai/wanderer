
<template>

  <div>

    <portal to="toolbar" :order="3">
      <builder-button color="yellow" title="Add vertex" v-on:click="showModal=true" v-if="selectedVertexIds.length==0||selectedVertexIds.length==1">
        <icon name="plus"></icon>
      </builder-button>
    </portal>

    <portal to="modals" :order="1">
      <builder-modal title="Add vertex" :show="showModal"  v-on:closeButton="showModal=false">

        <div v-if="selectedVertexIds.length==0">

            <builder-button class="" v-for="(collection, name) in possibleVertexCollections" v-if="collection.creatable" v-bind:key="name" :style="'background-color:'+collection.color+';'" v-on:click="add(name)">
              <icon name="plus"></icon> add {{collection.label}}
            </builder-button>

        </div>

        <div v-if="selectedVertexIds.length==1">

          <span class="mr-2" v-for="(possibleOutgoing) in possibleOutgoingCollections" v-bind:key="possibleOutgoing.to.name">

            <builder-button class="" v-for="(through, throughName) in possibleOutgoing.through" v-bind:key="throughName" :style="'background-color:'+possibleOutgoing.to.color+';'" v-on:click="append(possibleOutgoing.to.name, throughName)">
              <icon name="plus"></icon> {{through.label}} {{possibleOutgoing.to.collection.label}}
            </builder-button>

          </span>

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
