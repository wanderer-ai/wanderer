<template>
  <div>

    <div v-for="answer in answers" :key="answer._id">

      <div v-if="answer.type=='button' || answer.type=='checkbox'">
        {{answer.suggestion}}
      </div>

      <div v-if="answer.type=='text' || answer.type=='textarea'">
        <span v-if="answer.suggestion">{{answer.suggestion}}:</span> {{answer.answer}}
      </div>

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
    answers: function () {
      if(this.data.answers != undefined){
        let returnData = []
        for(let i in this.data.answers){
          returnData.push({
            _id: i,
            suggestion: WandererSingleton.getTranslatableVertexValue(i,'suggestion'),
            type: WandererSingleton.getVertexValue(i,'type'),
            answer: this.data.answers[i]
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
