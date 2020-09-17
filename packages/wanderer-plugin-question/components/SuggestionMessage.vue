<template>
  <div>

    <div v-for="answer in answers" :key="answer._id">

      <div v-if="answer.type=='button' || answer.type=='checkbox'">
        {{answer.suggestion}}
      </div>

      <div v-if="answer.type=='text' || answer.type=='textarea'">
        <span v-if="answer.suggestion">{{answer.suggestion}}:</span> {{answer.value}}
      </div>

    </div>

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {
  props: {
    vertexId: {
      type: String
    }
  },
  data: function () {
    return {
      answers: []
    }
  },
  mounted: function () {

    // Do not use answers as a computed property in here because we dont want to update it.
    // It would be a bad idea to change the chat message history if a user changes the answer.

    this.$nextTick(function () {

      if(WandererStoreSingleton.store.state.wanderer.vertexRelations[this.vertexId] != undefined) {
        var outgoingVertices = WandererStoreSingleton.store.state.wanderer.vertexRelations[this.vertexId]
        for(let outgoingVerticesId in outgoingVertices) {
          let collectionName = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[outgoingVertices[outgoingVerticesId]]._collection
          if(collectionName=='suggestion') {
            var data = WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[outgoingVertices[outgoingVerticesId]]
            if(data.answered != undefined && data.answered) {
              this.answers.push({
                _id: outgoingVertices[outgoingVerticesId],
                suggestion: WandererSingleton.getTranslatableVertexValue(outgoingVertices[outgoingVerticesId],'suggestion'),
                type: WandererSingleton.getVertexValue(outgoingVertices[outgoingVerticesId],'type'),
                priority: WandererSingleton.getVertexValue(outgoingVertices[outgoingVerticesId],'priority'),
                value: data.value
              })
            }
          }
        }
      }

    })
  },
  // computed: {
  //   answers: function () {
  //     let returnData = []
  //     if(this.vertexId != undefined) {
  //
  //     }
  //     return returnData
  //   }
  // }
}
</script>

<style>

</style>
