<template>
  <chat-message from="remote">
    <div class="message" v-html="message"></div>
  </chat-message>
</template>

<script>

export default {
  data: function () {
    return {

    }
  },
  props: {
    messageId: {
      type: String
    }
  },
  computed: {
    messageData: function () {
      return this.$chat.getMessageDataById(this.messageId)
    },
    message: function () {

      var message = ''

      if(this.messageData.vertexId != undefined) {
        message = this.$chat.evaluateVertexDataValue(this.messageData.vertexId,'message')
      }

      return message

    }
  }
}
</script>

<style>

</style>
