<template>
  <div>

    {{question}}

    <div v-for="suggestion in suggestions" :key="suggestion._id">
      <button class="btn" v-on:click="answerSingle(suggestion._id)">{{suggestion.suggestion}}</button>
    </div>

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    question: function () {
      if(this.data.vertexId != undefined){
        return WandererSingleton.getTranslatableVertexValue(this.data.vertexId,'question')
      }
    },
    suggestions: function () {
      if(this.data.suggestionVertexIds != undefined){
        let returnData = []
        for(let i in this.data.suggestionVertexIds){
          returnData.push({
            _id: this.data.suggestionVertexIds[i],
            suggestion: WandererSingleton.getTranslatableVertexValue(this.data.suggestionVertexIds[i],'suggestion')
          })
        }
        return returnData
      }
    }
  },
  methods: {
    answerSingle(suggestionVertexId){
      // Answer question
      WandererStoreSingleton.store.commit('wanderer/plugin-question/answerQuestion', this.data.vertexId)
      // Answer suggestion
      WandererStoreSingleton.store.commit('wanderer/plugin-question/answerSuggestion', suggestionVertexId)
      // Add answer message
      WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
        id: suggestionVertexId,
        component: 'wanderer-suggestion-message',
        from: 'local',
        delay: 0,
        data: {
          vertexId: suggestionVertexId
        }
      })
      // Start next traversal tick
      WandererSingleton.traverse()
    }
  }
}
</script>

<style>

</style>
