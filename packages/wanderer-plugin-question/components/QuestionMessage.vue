<template>
  <div class="question-message" v-html="question"></div>
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
  computed: {
    question: function () {
      if(this.vertexId != undefined) {
        return WandererSingleton.markdown2html(WandererSingleton.evaluateVertexTemplate(WandererSingleton.getTranslatableVertexValue(this.vertexId,'question'), this.vertexId))
      }
    }
  }

}
</script>

<style>

.question-message p:last-of-type {
  margin: 0;
}

.question-message a {
  color:white;
}

</style>
