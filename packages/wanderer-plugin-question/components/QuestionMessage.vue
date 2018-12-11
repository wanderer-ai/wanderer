<template>
  <div>

    {{question}}

    <div v-for="suggestion in suggestions" :key="suggestion._id">
      <button class="btn">{{suggestion.suggestion}}</button>
    </div>

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'

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
  }
}
</script>

<style>

</style>
