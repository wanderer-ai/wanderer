<template>
  <div v-if="!answered">

    {{question}}

    <div v-for="suggestion in suggestions" :key="suggestion._id">

      <div class="form-check" v-if="suggestion.type=='checkbox'">
        <input class="form-check-input" type="checkbox" :value="suggestion._id" v-model="values[suggestion._id]" :id="suggestion._id">
        <label class="form-check-label" :for="suggestion._id" v-if="suggestion.suggestion">
          {{suggestion.suggestion}}
        </label>
      </div>

      <div class="form-group" v-if="suggestion.type=='text'">
        <label :for="suggestion._id" v-if="suggestion.suggestion">{{suggestion.suggestion}}</label>
        <input type="text" class="form-control" :id="suggestion._id" v-model="values[suggestion._id]" @keyup.enter="answer()">
      </div>

      <div class="form-group" v-if="suggestion.type=='textarea'">
        <label  v-if="suggestion.suggestion" :for="suggestion._id">{{suggestion.suggestion}}</label>
        <textarea class="form-control" :id="suggestion._id" v-model="values[suggestion._id]"></textarea>
      </div>

    </div>

    <div class="btn-group has-wrap shake">

      <button v-for="suggestion in suggestions" :key="suggestion._id+'_button'" v-if="suggestion.type=='button'" class="btn btn-secondary" v-on:click="answer(suggestion._id)">{{suggestion.suggestion}}</button>

    </div>

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {
  props: {
    vertexId: {
      type: String
    },
    last: {
      type: Boolean
    },
    lastOfType: {
      type: Boolean
    }
  },
  data: function() {
    return {
      values: {},
      // answered: false
    }
  },
  computed: {
    // values: function () {
    //   return WandererStoreSingleton.store.state.wanderer.collectedValues
    // },
    question: function () {
      if(this.vertexId != undefined){
        return WandererSingleton.getTranslatableVertexValue(this.vertexId,'question')
      }
    },
    // button: function () {
    //   if(this.vertexId != undefined){
    //     return WandererSingleton.getTranslatableVertexValue(this.vertexId,'button')
    //   }
    // },
    suggestions: function () {

      let returnData = []
      if(this.vertexId != undefined) {

        if(WandererStoreSingleton.store.state.wanderer.question.suggestions[this.vertexId] != undefined) {
          var suggestionIds = WandererStoreSingleton.store.state.wanderer.question.suggestions[this.vertexId]

          if (suggestionIds != undefined) {

            suggestionIds = suggestionIds.sort(function(a, b) {
                return WandererStoreSingleton.store.state.wanderer.vertexDocumentData[b]['priority']-WandererStoreSingleton.store.state.wanderer.vertexDocumentData[a]['priority']
            })

            for(let suggestionId in suggestionIds) {

              returnData.push({
                _id: suggestionIds[suggestionId],
                suggestion: WandererSingleton.getTranslatableVertexValue(suggestionIds[suggestionId],'suggestion'),
                type: WandererSingleton.getEvaluatedVertexValue(suggestionIds[suggestionId],'type'),
                priority: WandererSingleton.getEvaluatedVertexValue(suggestionIds[suggestionId],'priority')
              })

            }
          }

        }
      }
      return returnData
    },

    answered: function () {
      return WandererSingleton.getLifecycleValue(this.vertexId, 'answered')
    },

  },
  methods: {

    answer (suggestionVertexId) {

      // Mark component (this question) as answered
      // this.answered = true

      // Mark question as answered in store
      // WandererStoreSingleton.store.commit('wanderer/plugin-question/answerQuestion', this.vertexId)
      WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
        id: this.vertexId,
        key: 'answered',
        value: true
      })

      // console.log('setting lifecycle value for '+this.vertexId);

      // Store the answered suggestions inside this object
      // var answerObject = {}

      // For each suggestion
      for(var s in this.suggestions) {
        if (this.suggestions.hasOwnProperty(s)) {

          // Answere the direct button suggestion
          // Was the button itself a suggestion?
          if(suggestionVertexId != undefined && suggestionVertexId==this.suggestions[s]._id) {

            // Mark also this suggestion as answered in the store
            // WandererStoreSingleton.store.commit('wanderer/plugin-question/answerSuggestion', suggestionVertexId)
            WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
              id: suggestionVertexId,
              key: 'answered',
              value: true
            })
            // answerObject[suggestionVertexId] = true;

          } else {

            // console.log(this.suggestions[s]._id)

            // Answer the other suggestions
            // Check the values
            // There must be a value. Values like "" or false(bool) will not answere the suggestion
            if (this.values[this.suggestions[s]._id] != undefined && this.values[this.suggestions[s]._id]) {

              // Answer the suggestion
              // WandererStoreSingleton.store.commit('wanderer/plugin-question/answerSuggestion', suggestionId)
              WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
                id: this.suggestions[s]._id,
                key: 'answered',
                value: true
              })

              // Store the input value inside the lifecycle data of this node
              WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
                id: this.suggestions[s]._id,
                key: 'value',
                value: this.values[this.suggestions[s]._id]
              })

              // Add to answer object
              // answerObject[this.suggestions[s]._id] = this.values[this.suggestions[s]._id]

            } else {

              // Mark other suggestions as not answered
              WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
                id: this.suggestions[s]._id,
                key: 'answered',
                value: false
              })

            }

          }

        }
      }


      // Create suggestion message
      WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
        // id: this.vertexId+'_suggestion',
        component: 'wanderer-suggestion-message',
        from: 'local',
        backgroundColor: '#28A745',
        delay: 0,
        vertexId: this.vertexId,
        // data: {
        //   answers: answerObject
        // }
      })

      // Start next traversal tick
      // WandererSingleton.traverse()

    },

  }
}
</script>

<style>
/* .button-again {
  cursor:pointer;
} */

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
