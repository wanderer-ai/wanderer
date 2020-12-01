<template>

  <div>

    <chat-message from="remote" background-color="#ccc">
      <div class="question-message" v-html="question"></div>
    </chat-message>

    <chat-message from="local" background-color="#ccc">
      <span>{{answers}}</span>
      <span :class="(repeatable?'button--pointer':'button--disabled')" v-on:click="askAgain()">↺</span>
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
      computedAnswers: ''
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
          if(this.$store.state.wandererQuestion.suggestions[this.vertexId] != undefined) {

            // Note: Clone this object because I want to sort it and I dont want to create an infinite Vue update loop
            var suggestionIds = JSON.parse(JSON.stringify(this.$store.state.wandererQuestion.suggestions[this.vertexId]))
            if (suggestionIds != undefined) {

              // Sort by priority
              suggestionIds = suggestionIds.sort((a, b) => {
                return this.$vueGraph.getVertexDataValue(a, 'priority')-this.$vueGraph.getVertexDataValue(b, 'priority')
              })

              // Find answered suggestions
              var answeredSuggestionIds = []
              for(let suggestionId in suggestionIds) {
                var answered = this.$vueGraph.getVertexLifecycleValue(suggestionIds[suggestionId], 'answered')
                if(answered) {
                  answeredSuggestionIds.push(suggestionIds[suggestionId])
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
      }

      return message
    },
    repeatable: function () {
      return true
      // return WandererSingleton.isVertexInTraversal(this.vertexId)
    }
  },
  methods: {
    askAgain () {

      // if(this.repeatable) {
      //
      //   // Mark this question as not answered
      //   WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
      //     id: this.vertexId,
      //     key: 'answered',
      //     value: false
      //   })
      //
      //   // Reset all suggestions
      //   var cytoscapeVertex = CytoscapeSingleton.cy.getElementById(this.vertexId);
      //   var children = cytoscapeVertex.children('.suggestion');
      //   children.forEach(function(child) {
      //     WandererSingleton.setLifecycleValue(child.id(), 'answered', false)
      //   })
      //
      // }

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
