<template>
  <div class="message" v-html="message"></div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'

export default {
  props: {
    vertexId: {
      type: String
    },
    text: {
      type: String
    }
  },
  computed: {
    message: function () {

      var dynamicMode = false

      // By default this is the message string
      var message = this.text

      // Override with reactive value if we have enabled the dynamic mode
      if(dynamicMode) {
        if(this.vertexId != undefined) {
          message = WandererSingleton.markdown2html(WandererSingleton.evaluateVertexTemplate(WandererSingleton.getTranslatableVertexValue(this.vertexId,'message'), this.vertexId))
        }
      }

      return message

    }
  }
}
</script>

<style>

.message p:last-of-type {
  margin: 0;
}

.message a {
  color:white;
}

</style>
