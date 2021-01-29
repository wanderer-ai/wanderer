<template>

  <div>

    <chat-message from="remote" :spawn="false">
      <div v-html="question"></div>
    </chat-message>

    <chat-message from="local" :spawn="false">
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

    }
  },
  computed: {
    messageData: function () {
      return this.$chat.getMessageDataById(this.messageId)
    },
    answeredSuggestionVertexIds: function () {
      var answeredSuggestionVertexIds = this.messageData.payload.answeredSuggestionVertexIds

      answeredSuggestionVertexIds = answeredSuggestionVertexIds.sort((a, b) => {
        return this.$vueGraph.getVertexDataValue(b, 'priority')-this.$vueGraph.getVertexDataValue(a, 'priority')
      })

      return answeredSuggestionVertexIds

    },
    answeredSuggestionsLifecycleData: function () {
      return this.messageData.payload.answeredSuggestionsLifecycleData
    },
    question: function () {

      var message = ''

      if(this.messageData.vertexId != undefined) {

        var template = this.$chat.getTranslatableVertexDataValue(this.messageData.vertexId, 'question')
        message = this.$chat.evaluateMustache(template, this.messageData.payload.lifecycleData, false)

      }

      return message
    },
    answers: function () {

      var message = ''

      if(this.messageData.vertexId != undefined) {

        message = ''

        if (this.answeredSuggestionVertexIds != undefined) {

          // Foreach answered suggestion
          for(let suggestionId in this.answeredSuggestionVertexIds) {

            var type = this.$vueGraph.getVertexDataValue(this.answeredSuggestionVertexIds[suggestionId],'type')
            var template = this.$chat.getTranslatableVertexDataValue(this.answeredSuggestionVertexIds[suggestionId], 'suggestion')

            // Get immutable version of lifecycle data
            var lifecacleData = this.answeredSuggestionsLifecycleData[this.answeredSuggestionVertexIds[suggestionId]]

            // Get immutable version of the value
            var value = lifecacleData['value']

            // Render the suggestion template
            if(type=='button' || type=='checkbox') {
              message = message+this.$chat.evaluateMustache(template, lifecacleData, true)
            }

            // Just output the value
            if(type=='text' || type=='textarea') {
              message = message+value
            }

            // Add comma
            if(suggestionId != Object.keys(this.answeredSuggestionVertexIds).length - 1) {
              message = message + ', '
            }

          }
        }

      }


      return message
    },
    repeatable: function () {
      if(
        // Check if this question is still part of the current traversal
        this.$store.state.wandererQuestion.traversedQuestions.indexOf(this.messageData.vertexId) !== -1 &&
        // Check if its repeatable in general
        this.$vueGraph.getVertexDataValue(this.messageData.vertexId, 'repeatable')
      ) {
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
