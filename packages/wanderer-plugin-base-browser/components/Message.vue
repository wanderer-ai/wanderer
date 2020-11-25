<template>
  <chat-message from="remote" background-color="#ccc">
    <div class="message" v-html="vertexId"></div>
  </chat-message>
</template>

<script>

export default {
  props: {
    vertexId: {
      type: String
    }
  },
  // computed: {
  //   message: function () {
  //
  //     var dynamicMode = false
  //
  //     // By default this is the message string
  //     var message = this.text
  //
  //     // Override with reactive value if we have enabled the dynamic mode
  //     if(dynamicMode) {
  //       if(this.vertexId != undefined) {
  //         message = WandererSingleton.markdown2html(WandererSingleton.evaluateVertexTemplate(WandererSingleton.getTranslatableVertexValue(this.vertexId,'message'), this.vertexId))
  //       }
  //     }
  //
  //     return message
  //
  //   }
  // }
}
</script>

<style>

</style>
