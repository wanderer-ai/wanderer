<template>
  <chat-message from="remote">
    <chat-content>
      <div class="message" v-html="message"></div>
    </chat-content>
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
        var template = this.$chat.getTranslatableVertexDataValue(this.messageData.vertexId, 'message')
        message = this.$chat.evaluateMustache(template, this.messageData.payload.lifecycleData, false)
      }

      return message

    }
  }
}
</script>

<style>

</style>
