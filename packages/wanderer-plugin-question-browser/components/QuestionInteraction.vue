<template>

  <div v-if="hide">

    <component from="remote" v-bind:is="(showInNavigation?'div':'chat-message')" :class="(showInNavigation? 'mb-2':'')">
      <chat-content>
        <span class="question-interaction" v-html="question"></span>
      </chat-content>
    </component>

    <component from="local" v-bind:is="(showInNavigation?'div':'chat-message')">
      <div v-for="suggestion in suggestions" :key="suggestion._id">

        <div class="mb-2" v-if="suggestion.type=='checkbox'">
          <label class="form-check-label" v-if="suggestion.suggestion">
            <input class="form-check-input" type="checkbox" :value="suggestion._id" v-model="values[suggestion._id]">
            {{suggestion.suggestion}}
          </label>
        </div>

        <div class="mb-2" v-if="suggestion.type=='text'">
          <label :for="suggestion._id" v-if="suggestion.suggestion">{{suggestion.suggestion}}</label>
          <input type="text" class="w-full text-black p-2" :id="suggestion._id" v-model="values[suggestion._id]" @keyup.enter="answer()">
        </div>

        <div class="mb-2" v-if="suggestion.type=='textarea'">
          <label  v-if="suggestion.suggestion" :for="suggestion._id">{{suggestion.suggestion}}</label>
          <textarea class="w-full text-black p-2" :id="suggestion._id" v-model="values[suggestion._id]"></textarea>
        </div>

      </div>

      <chat-button-group :class="(showInNavigation? '':'shake')">
        <template v-for="suggestion in suggestions" >
          <chat-button v-if="suggestion.type=='button'" :key="suggestion._id+'_button'" :disabled="answered" :theme="(showInNavigation?'secondary':'primary')" :size="(showInNavigation?'small':'normal')" v-on:click="answer(suggestion._id)">{{suggestion.suggestion}}</chat-button>
        </template>
      </chat-button-group>
    </component>

  </div>

</template>

<script>

export default {
  props: {
    vertexId: {
      type: String
    }
  },
  data: function() {
    return {
      values: {}
    }
  },
  computed: {
    question: function () {
      if(this.vertexId != undefined) {
        return this.$chat.evaluateVertexDataValue(this.vertexId,'question')
      }
      return false
    },
    showInNavigation: function () {
      if(this.vertexId != undefined) {
        return this.$vueGraph.getVertexDataValue(this.vertexId, 'showInNavigation')
      }
      return false
    },
    hideMessages: function () {
      if(this.vertexId != undefined) {
        return this.$vueGraph.getVertexDataValue(this.vertexId, 'hideMessages')
      }
      return false
    },
    answered: function () {
      if(this.vertexId != undefined) {
        return this.$vueGraph.getVertexLifecycleValue(this.vertexId, 'answered')
      }
      return false
    },
    hide: function () {
      // Wenn die Frage beantwortet ist ...
      if(this.answered) {
        // Wenn die Frage keine eigenen Messages generiert ...
        if(this.hideMessages) {
          return true
        // Wenn die Frage eigene Messages generiert ...
        } else {
          // Hide the question immediatelly
          // Die Messages sollen dann optisch den Platz der Interaction einnehmen
          return false
        }
      // Wenn die Frage noch nicht beantwortet ist ...
      }

      return true

    },
    suggestions: function () {

      let returnData = []
      if(this.vertexId != undefined) {

        if(this.$store.state.wandererQuestion.suggestions[this.vertexId] != undefined) {
          var suggestionIds = this.$store.state.wandererQuestion.suggestions[this.vertexId]

          if (suggestionIds != undefined) {

            suggestionIds = suggestionIds.sort((a, b) => {
              return this.$vueGraph.getVertexDataValue(b, 'priority')-this.$vueGraph.getVertexDataValue(a, 'priority')
            })

            for(let i in suggestionIds) {

              returnData.push({
                _id: suggestionIds[i],
                suggestion: this.$chat.evaluateVertexDataValue(suggestionIds[i], 'suggestion', true),
                type: this.$vueGraph.getVertexDataValue(suggestionIds[i],'type'),
                priority: this.$vueGraph.getVertexDataValue(suggestionIds[i],'priority')
              })

            }
          }

        }
      }
      return returnData
    }

  },
  methods: {

    answer (suggestionVertexId) {

      // Mark question as answered in store
      this.$vueGraph.setVertexLifecycleValue(this.vertexId, 'answered', true)

      // Remember the answered suggestions
      var answeredSuggestionVertexIds = []

      // For each suggestion
      for(var s in this.suggestions) {

        // Answere the direct button suggestion
        // Was the button itself a suggestion?
        if(suggestionVertexId != undefined && suggestionVertexId==this.suggestions[s]._id) {

          // Mark also this suggestion as answered in the store
          this.$vueGraph.setVertexLifecycleValue(suggestionVertexId, 'answered', true)

          answeredSuggestionVertexIds.push(suggestionVertexId)

        } else {

          // Answer the other suggestions
          // Check the values
          // There must be a value. Values like "" or false(bool) will not answere the suggestion
          if (this.values[this.suggestions[s]._id] != undefined && this.values[this.suggestions[s]._id]) {

            // Answer the suggestion
            this.$vueGraph.setVertexLifecycleValue(this.suggestions[s]._id, 'answered', true)

            // Store the input value inside the lifecycle data of this node
            this.$vueGraph.setVertexLifecycleValue(this.suggestions[s]._id, 'value', this.values[this.suggestions[s]._id])

            answeredSuggestionVertexIds.push(this.suggestions[s]._id)

          } else {

            // Mark other suggestions as not answered
            this.$vueGraph.setVertexLifecycleValue(this.suggestions[s]._id, 'answered', false)

          }

        }

      }

      // Sort answered suggestions by priority
      // We want to persist them in the history of the chat
      answeredSuggestionVertexIds = answeredSuggestionVertexIds.sort((a, b) => {
        return this.$vueGraph.getVertexDataValue(a, 'priority')-this.$vueGraph.getVertexDataValue(b, 'priority')
      })

      // Create question and suggestion messages
      if(!this.hideMessages) {
        this.$store.commit('wandererChat/addMessage', {
          vertexId: this.vertexId,
          payload: {
            answeredSuggestionVertexIds: answeredSuggestionVertexIds
          },
        })
      }

    }

  }
}
</script>

<style>

.question-interaction p:last-of-type {
  margin: 0;
}

.question-interaction a {
  color:white;
}

.btn-group.has-wrap {
  flex-wrap: wrap;
}

.shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 5s;

  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% { transform: translate(0px, 0px) rotate(0deg); }
  1% { transform: translate(-1px, -2px) rotate(-1deg); }
  2% { transform: translate(-3px, 0px) rotate(1deg); }
  3% { transform: translate(3px, 2px) rotate(0deg); }
  4% { transform: translate(1px, -1px) rotate(1deg); }
  5% { transform: translate(-1px, 2px) rotate(-1deg); }
  6% { transform: translate(-3px, 1px) rotate(0deg); }
  7% { transform: translate(3px, 1px) rotate(-1deg); }
  8% { transform: translate(-1px, -1px) rotate(1deg); }
  9% { transform: translate(1px, 2px) rotate(0deg); }
  10% { transform: translate(0px, 0px) rotate(0deg); }
}

</style>
