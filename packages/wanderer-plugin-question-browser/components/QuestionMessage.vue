<template>

  <div>

    <chat-message from="remote">
      <div class="question-message" v-html="question"></div>
    </chat-message>

    <chat-message from="local">
      <span>{{answers}}</span>
      <span v-if="repeatable" v-on:click="askAgain()">↺</span>
    </chat-message>

  </div>

</template>

<script>

export default {
  props: {
    vertexId: {
      type: String
    }
  },
  data: function () {
    return {
      computedMessage: '',
      computedAnswers: '',
      suggestionIds: undefined
    }
  },
  computed: {
    question: function () {
      var dynamicMode = false

      var message = this.computedMessage

      // Calculate the template only once
      // The only exception is the dynamic mode
      if(dynamicMode||this.computedMessage=='') {
        if(this.vertexId != undefined) {
          message = this.$chat.evaluateVertexDataValue(this.vertexId, 'question')
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
        if(this.vertexId != undefined) {

          message = ''

          // Get all suggestions
          if(this.suggestionIds == undefined) {
            if(this.$store.state.wandererQuestion.suggestions[this.vertexId] != undefined) {
              // Note: Clone this object because I want to sort it and I dont want to create an infinite Vue update loop
              // Also cache this data to the local state because the traverser will erase the suggestions with the nect tick
              this.suggestionIds = JSON.parse(JSON.stringify(this.$store.state.wandererQuestion.suggestions[this.vertexId]))
            }
          }

          if (this.suggestionIds != undefined) {

            console.log(this.suggestionIds)

            // Sort by priority
            this.suggestionIds = this.suggestionIds.sort((a, b) => {
              return this.$vueGraph.getVertexDataValue(a, 'priority')-this.$vueGraph.getVertexDataValue(b, 'priority')
            })

            // Find answered suggestions
            var answeredSuggestionIds = []
            for(let suggestionId in this.suggestionIds) {
              var answered = this.$vueGraph.getVertexLifecycleValue(this.suggestionIds[suggestionId], 'answered')
              if(answered) {
                answeredSuggestionIds.push(this.suggestionIds[suggestionId])
              }
            }

            // Foreach answered suggestion
            for(let suggestionId in answeredSuggestionIds) {

              var type = this.$vueGraph.getVertexDataValue(answeredSuggestionIds[suggestionId],'type')
              var suggestion = this.$chat.getTranslatableVertexDataValue(answeredSuggestionIds[suggestionId],'suggestion')
              var value = this.$vueGraph.getVertexLifecycleValue(answeredSuggestionIds[suggestionId],'value')

              if(type=='button' || type=='checkbox') {
                message = message+suggestion
              }

              if(type=='text' || type=='textarea') {
                message = message+value
              }

              if(suggestionId != Object.keys(answeredSuggestionIds).length - 1) {
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
      if(this.$store.state.wandererQuestion.traversedQuestions.indexOf(this.vertexId) !== -1) {
        return true
      }
      return false
    }
  },
  methods: {
    askAgain () {

      if(this.repeatable) {

        // Mark this question as not answered
        this.$vueGraph.setVertexLifecycleValue(this.vertexId, 'answered', false)

        // Reset all suggestions
        for(var i in this.suggestionIds) {
          this.$vueGraph.setVertexLifecycleValue(this.suggestionIds[i], 'answered', false)
        }

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
