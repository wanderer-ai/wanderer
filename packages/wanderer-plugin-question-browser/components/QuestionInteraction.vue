<template>

  <div v-if="hide">

    <component from="remote" v-bind:is="(showInNavigation?'div':'chat-message')" :class="(showInNavigation? 'mb-2':'')">
      <chat-content>
        <span class="" v-html="question"></span>
      </chat-content>
    </component>

    <component from="local" v-bind:is="(showInNavigation?'div':'chat-message')">
      <div v-for="suggestion in suggestions" :key="suggestion._id">

        <div class="mb-2" v-if="suggestion.type=='checkbox'">
          <label class="wanderer-chat__checkinput">
            <div :class="'wanderer-chat__checkinput-box'+(suggestion.invalid?' wanderer-chat__input--invalid':'')">
              <icon name="check" class="wanderer-chat__checkinput-icon" v-if="values[suggestion._id]"></icon>
              <input class="wanderer-chat__checkinput-checkbox" type="checkbox" :value="suggestion._id" v-model="values[suggestion._id]">
            </div>
            <div>{{suggestion.suggestion}}</div>
          </label>
        </div>

        <div class="mb-2" v-if="['text', 'password', 'number', 'email'].includes(suggestion.type)">
          <label :for="suggestion._id" v-if="suggestion.suggestion">{{suggestion.suggestion}}</label>
          <input :type="suggestion.type" :class="'wanderer-chat__input'+(suggestion.invalid?' wanderer-chat__input--invalid':'')" :id="suggestion._id" v-model="values[suggestion._id]" @keyup.enter="answer()">
        </div>

        <div class="mb-2" v-if="suggestion.type=='textarea'">
          <label v-if="suggestion.suggestion" :for="suggestion._id">{{suggestion.suggestion}}</label>
          <textarea :class="'wanderer-chat__input'+(suggestion.invalid?' wanderer-chat__input--invalid':'')" :id="suggestion._id" v-model="values[suggestion._id]"></textarea>
        </div>

      </div>

      <chat-button-group :class="(showInNavigation? '':'wanderer-chat__button-shake')">
        <template v-for="suggestion in suggestions" >
          <chat-button v-if="suggestion.type=='button'" :key="suggestion._id+'_button'" :disabled="answered" :theme="(showInNavigation?'secondary':'primary')" :size="(showInNavigation?'small':'normal')" v-on:click="answer(suggestion._id)">{{suggestion.suggestion}}</chat-button>
        </template>
      </chat-button-group>
    </component>

  </div>

</template>

<script>

import 'vue-awesome/icons/check'
import Icon from 'vue-awesome/components/Icon'

export default {
  components: {
    Icon
  },
  props: {
    vertexId: {
      type: String
    }
  },
  data: function() {
    return {
      values: {},
      validationAttempts: {}
    }
  },
  computed: {
    question: function () {
      if(this.vertexId != undefined) {
        var template = this.$chat.getTranslatableVertexDataValue(this.vertexId, 'question')
        var message = this.$chat.evaluateMustache(template, this.$vueGraph.getPlainVertexLifecycleValuesById(this.vertexId), false)
        return message
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

              var template = this.$chat.getTranslatableVertexDataValue(suggestionIds[i], 'suggestion')

              returnData.push({
                _id: suggestionIds[i],
                suggestion: this.$chat.evaluateMustache(template, this.$vueGraph.getPlainVertexLifecycleValuesById(suggestionIds[i]), true),
                type: this.$vueGraph.getVertexDataValue(suggestionIds[i],'type'),
                priority: this.$vueGraph.getVertexDataValue(suggestionIds[i],'priority'),
                required: this.$vueGraph.getVertexDataValue(suggestionIds[i],'required'),
                invalid: this.$vueGraph.getVertexLifecycleValue(suggestionIds[i],'invalid')
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

      // Validate all suggestions
      let valid = true

      // Count up validation attempts for the entire question
      if(this.validationAttempts[this.vertexId] == undefined) {
        this.validationAttempts[this.vertexId] = 1
      } else {
        this.validationAttempts[this.vertexId]++
      }

      this.$vueGraph.setVertexLifecycleValue(this.vertexId, 'validationAttempts', this.validationAttempts[this.vertexId])

      // For each suggestion
      for(var s in this.suggestions) {

        // If this is not a button
        if(this.suggestions[s].type != 'button') {

          // Count up validation attempts for the suggestion
          if(this.validationAttempts[this.suggestions[s]._id] == undefined) {
            this.validationAttempts[this.suggestions[s]._id] = 1
          } else {
            this.validationAttempts[this.suggestions[s]._id]++
          }

          this.$vueGraph.setVertexLifecycleValue(this.suggestions[s]._id, 'validationAttempts', this.validationAttempts[this.suggestions[s]._id])

          // If this field is required
          if(this.suggestions[s].required) {

            if (this.values[this.suggestions[s]._id] != undefined && this.values[this.suggestions[s]._id]) {
              this.$vueGraph.setVertexLifecycleValue(this.suggestions[s]._id, 'invalid', false)
            } else {
              // Mark the suggestion as invalid
              this.$vueGraph.setVertexLifecycleValue(this.suggestions[s]._id, 'invalid', true)
              valid = false
            }

          }

        }
      }

      if(valid) {

        // Mark question as answered in store
        this.$vueGraph.setVertexLifecycleValue(this.vertexId, 'answered', true)
        this.$vueGraph.setVertexLifecycleValue(this.vertexId, 'invalid', false)

        // Remember the answered suggestions
        var answeredSuggestionVertexIds = []

        // Copy the answered suggestions lifecycle data
        var answeredSuggestionsLifecycleData = {}

        // For each suggestion
        for(var s in this.suggestions) {

          // Answere the direct button suggestion
          // Was the button itself a suggestion?
          if(suggestionVertexId != undefined && suggestionVertexId==this.suggestions[s]._id) {

            // Mark also this suggestion as answered in the store
            this.$vueGraph.setVertexLifecycleValue(suggestionVertexId, 'answered', true)

            answeredSuggestionVertexIds.push(suggestionVertexId)
            answeredSuggestionsLifecycleData[suggestionVertexId] = this.$vueGraph.getPlainVertexLifecycleValuesById(suggestionVertexId)

          } else {

            // Answer the other suggestions
            // Check the values
            // There must be a value. Values like "" or false(bool) will not answere the suggestion
            if (this.values[this.suggestions[s]._id] != undefined && this.values[this.suggestions[s]._id]) {

              // Answer the suggestion
              this.$vueGraph.setVertexLifecycleValue(this.suggestions[s]._id, 'answered', true)

              // Store the input value inside the lifecycle data of this node
              this.$vueGraph.setVertexLifecycleValue(this.suggestions[s]._id, 'answer', this.values[this.suggestions[s]._id])

              answeredSuggestionVertexIds.push(this.suggestions[s]._id)
              answeredSuggestionsLifecycleData[this.suggestions[s]._id] = this.$vueGraph.getPlainVertexLifecycleValuesById(this.suggestions[s]._id)

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
              lifecycleData: this.$vueGraph.getPlainVertexLifecycleValuesById(this.vertexId),
              answeredSuggestionVertexIds: answeredSuggestionVertexIds,
              answeredSuggestionsLifecycleData: answeredSuggestionsLifecycleData
            },
          })
        }

      } else {

        // Mark the entire question as invalid
        this.$vueGraph.setVertexLifecycleValue(this.vertexId, 'invalid', true)

      }

    }

  }
}
</script>

<style>

.wanderer-chat__input {
  @apply w-full text-black p-2;
}

.wanderer-chat__input--invalid {
  @apply border-2 border-red;
}

.wanderer-chat__checkinput {
  @apply flex items-center;
}

.wanderer-chat__checkinput-box {
  @apply bg-white flex flex-shrink-0 flex-grow-0 items-center justify-center cursor-pointer mr-2;
  height: 1rem;
  width: 1rem;
  padding: 0.05rem;
}

.wanderer-chat__checkinput-icon {
  @apply text-black;
}

.wanderer-chat__checkinput-checkbox {
  display: none;
}

.wanderer-chat__button-shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: wanderer-chat__button-shake 5s;

  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes wanderer-chat__button-shake {
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
