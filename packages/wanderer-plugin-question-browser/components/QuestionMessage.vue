<template>

  <div>

    <chat-message from="remote">
      <div v-html="question"></div>
    </chat-message>

    <chat-message from="local">
      <span>{{answers}}</span>
      <span class="cursor-pointer" v-if="repeatable" v-on:click="askAgain()">↺</span>
    </chat-message>

  </div>

</template>

<script>

export default {
  props: {
    messageId: {
      type: String
    }
  },
  data: function () {
    return {
      computedMessage: '',
      computedAnswers: ''
    }
  },
  computed: {
    messageData: function () {
      return this.$chat.getMessageDataById(this.messageId)
    },
    answeredSuggestionVertexIds: function () {
      return this.messageData.payload.answeredSuggestionVertexIds
    },
    question: function () {
      var dynamicMode = false

      var message = this.computedMessage

      // Calculate the template only once
      // The only exception is the dynamic mode
      if(dynamicMode||this.computedMessage=='') {
        if(this.messageData.vertexId != undefined) {
          message = this.$chat.evaluateVertexDataValue(this.messageData.vertexId, 'question')
          // this.computedMessage = message
        }
      }

      return message
    },
    answers: function () {

      var dynamicMode = false

      var message = this.computedAnswers

      // Calculate the template only once
      // The only exception is the dynamic mode
      if(dynamicMode||this.computedAnswers=='') {
        if(this.messageData.vertexId != undefined) {

          message = ''

          if (this.answeredSuggestionVertexIds != undefined) {

            // Foreach answered suggestion
            for(let suggestionId in this.answeredSuggestionVertexIds) {

              var type = this.$vueGraph.getVertexDataValue(this.answeredSuggestionVertexIds[suggestionId],'type')
              var suggestion = this.$chat.getTranslatableVertexDataValue(this.answeredSuggestionVertexIds[suggestionId],'suggestion')
              var value = this.$vueGraph.getVertexLifecycleValue(this.answeredSuggestionVertexIds[suggestionId],'value')

              if(type=='button' || type=='checkbox') {
                message = message+suggestion
              }

              if(type=='text' || type=='textarea') {
                message = message+value
              }

              if(suggestionId != Object.keys(this.answeredSuggestionVertexIds).length - 1) {
                message = message + ', '
              }

            }
          }

        }
      }

      return message
    },
    repeatable: function () {
      // Check if this question is still part of the current traversal
      if(this.$store.state.wandererQuestion.traversedQuestions.indexOf(this.messageData.vertexId) !== -1) {
        return true
      }
      return false
    }
  },
  methods: {
    askAgain () {

      if(this.repeatable) {

        // Mark this question as not answered
        this.$vueGraph.setVertexLifecycleValue(this.messageData.vertexId, 'answered', false)

        // Reset all answered suggestions
        for(var i in this.answeredSuggestionVertexIds) {
          this.$vueGraph.setVertexLifecycleValue(this.answeredSuggestionVertexIds[i], 'answered', false)
        }

      }

    }
  }

}
</script>

<style>



</style>
