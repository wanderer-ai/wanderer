<template>
  <div class="question-message" v-html="question"></div>
</template>

<script>

export default {
  props: {
    vertexId: {
      type: String
    },
    text: {
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
      // var dynamicMode = false
      //
      // // By default this is the message string
      // var message = this.text
      //
      // // Override with reactive value if we have enabled the dynamic mode
      // if(dynamicMode) {
      //   if(this.vertexId != undefined) {
      //     message = WandererSingleton.markdown2html(WandererSingleton.evaluateVertexTemplate(WandererSingleton.getTranslatableVertexValue(this.vertexId,'question'), this.vertexId))
      //   }
      // }
      //
      // return message
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
