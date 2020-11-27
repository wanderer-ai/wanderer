<template>
  <chat-message from="remote" background-color="#ccc">
    <div class="message" v-html="message"></div>
  </chat-message>
</template>

<script>

export default {
  data: function () {
    return {
      computedMessage: ''
    }
  },
  props: {
    vertexId: {
      type: String
    }
  },
  computed: {
    message: function () {

      var dynamicMode = false

      var message = this.computedMessage

      // Calculate the template only once
      // The only exception is the dynamic mode
      if(dynamicMode||this.computedMessage=='') {
        if(this.vertexId != undefined) {
          message = this.$chat.evaluateVertexDataValue(this.vertexId,'message')
          // this.computedMessage = message
        }
      }

      return message

    }
  }
}
</script>

<style>

</style>
