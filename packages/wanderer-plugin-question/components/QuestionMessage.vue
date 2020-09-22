<template>
  <div>

    {{question}}

    <span v-if="answered" class="button-again" v-on:click="askAgain()">↺</span>

    <portal to="chat-controls" :order="1">

      <div v-if="!answered && lastOfType">

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

        <div class="btn-group has-wrap">

          <button v-for="suggestion in suggestions" :key="suggestion._id+'_button'" v-if="suggestion.type=='button'" class="btn btn-secondary" v-on:click="answer(suggestion._id)">{{suggestion.suggestion}}</button>

          <button v-if="requireAnswerButton" class="btn btn-secondary" v-on:click="answer()">Answer</button>

        </div>

      </div>

    </portal>

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
      answered: false
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
    suggestions: function () {

      let returnData = []
      if(this.vertexId != undefined) {

        if(WandererStoreSingleton.store.state.wanderer.vertexRelations[this.vertexId] != undefined) {
          var outgoingVertices = WandererStoreSingleton.store.state.wanderer.vertexRelations[this.vertexId]

          for(let outgoingVerticesId in outgoingVertices) {
            let collectionName = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[outgoingVertices[outgoingVerticesId]]._collection
            if(collectionName=='suggestion') {
              returnData.push({
                _id: outgoingVertices[outgoingVerticesId],
                suggestion: WandererSingleton.getTranslatableVertexValue(outgoingVertices[outgoingVerticesId],'suggestion'),
                type: WandererSingleton.getVertexValue(outgoingVertices[outgoingVerticesId],'type'),
                priority: WandererSingleton.getVertexValue(outgoingVertices[outgoingVerticesId],'priority')
              })
            }
          }
        }
      }
      return returnData
    },
    // suggestions: function () {
    //   // We have got a list of ids. Now we fill it with data
    //   if(this.data.suggestionVertexIds != undefined){
    //     let returnData = []
    //     for(let i in this.data.suggestionVertexIds){
    //       returnData.push({
    //         _id: this.data.suggestionVertexIds[i],
    //         suggestion: WandererSingleton.getTranslatableVertexValue(this.data.suggestionVertexIds[i],'suggestion'),
    //         type: WandererSingleton.getVertexValue(this.data.suggestionVertexIds[i],'type'),
    //         priority: WandererSingleton.getVertexValue(this.data.suggestionVertexIds[i],'priority')
    //       })
    //     }
    //     // console.log(returnData)
    //     returnData = returnData.sort((a, b) => (a.priority < b.priority) ? 1 : -1)
    //
    //     return returnData
    //   }
    // },
    // answered: function () {
    //   if(WandererStoreSingleton.store.state.wanderer['plugin-question'].answeredQuestions.indexOf(this.vertexId)===-1){
    //     return false
    //   }
    //   return true
    // },
    requireAnswerButton: function () {
      var require = false
      for (var i in this.suggestions) {
        if (this.suggestions[i].type !== 'button') {
          require = true
        }
      }
      return require
    }
  },
  methods: {
    // answerButton (suggestionVertexId) {
    //   // Mark component as answered
    //   this.answered = true
    //   // Mark question as answered in store
    //   WandererStoreSingleton.store.commit('wanderer/plugin-question/answerQuestion', this.vertexId)
    //   // Mark suggestion as answered in store
    //   WandererStoreSingleton.store.commit('wanderer/plugin-question/answerSuggestion', suggestionVertexId)
    //   // Add answer message
    //   var answerObject = {}
    //   answerObject[suggestionVertexId] = true;
    //   WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
    //     // id: this.vertexId+'_suggestion',
    //     component: 'wanderer-suggestion-message',
    //     from: 'local',
    //     backgroundColor: '#28A745',
    //     delay: 0,
    //     data: {
    //       answers: answerObject
    //     }
    //   })
    //   // Start next traversal tick
    //   WandererSingleton.traverse()
    // },
    answer (suggestionVertexId) {

      // Mark component (this question) as answered
      this.answered = true

      // Mark question as answered in store
      // WandererStoreSingleton.store.commit('wanderer/plugin-question/answerQuestion', this.vertexId)
      WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
        id: this.vertexId,
        key: 'answered',
        value: true
      })

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
    askAgain () {

      // this.answered = false;

      // Mark this question as not answered
      WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
        id: this.vertexId,
        key: 'answered',
        value: false
      })

      for(var s in this.suggestions) {
        if (this.suggestions.hasOwnProperty(s)) {
          WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
            id: this.suggestions[s]._id,
            key: 'answered',
            value: false
          })
        }
      }

      // Wenn die Frage die letzte im Message-Stack ist...
      if(this.lastOfType) {

        // Ask the question again
        WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
          // id: traversalResult.lastFoundQuestionId,
          component: 'wanderer-question-message',
          vertexId: this.vertexId,
          backgroundColor: '#007BFF',
          delay: 2000
        })

      }

    }
  }
}
</script>

<style>
.button-again {
  cursor:pointer;
}

.btn-group.has-wrap {
  flex-wrap: wrap;
}
</style>
