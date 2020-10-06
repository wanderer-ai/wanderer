<template>
  <div>

    <span v-for="answer in answers" :key="answer._id">

      <span v-if="answer.type=='button' || answer.type=='checkbox'">
        {{answer.suggestion}}
      </span>

      <span v-if="answer.type=='text' || answer.type=='textarea'">
        <span v-if="answer.suggestion">{{answer.suggestion}}:</span> {{answer.value}}
      </span>

    </span>

    <span class="button--repeat" v-if="repeatable" v-on:click="askAgain()">↺</span>

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {
  props: {
    vertexId: {
      type: String
    }
  },
  data: function () {
    return {
      answers: []
    }
  },
  mounted: function () {

    // Do not use answers as a computed property in here because we dont want to update it.
    // It would be a bad idea to change the chat message history if a user changes the answer.

    this.$nextTick(function () {

      if(this.vertexId != undefined) {

        if(WandererStoreSingleton.store.state.wanderer.question.suggestions[this.vertexId] != undefined) {
          var suggestionIds = WandererStoreSingleton.store.state.wanderer.question.suggestions[this.vertexId]
          if (suggestionIds != undefined) {

            suggestionIds = suggestionIds.sort(function(a, b) {
                return WandererStoreSingleton.store.state.wanderer.vertexDocumentData[b]['priority']-WandererStoreSingleton.store.state.wanderer.vertexDocumentData[a]['priority']
            })

            for(let suggestionId in suggestionIds) {

              var data = WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[suggestionIds[suggestionId]]
              if(data.answered != undefined && data.answered) {

                this.answers.push({
                  _id: suggestionIds[suggestionId],
                  suggestion: WandererSingleton.getTranslatableVertexValue(suggestionIds[suggestionId],'suggestion'),
                  type: WandererSingleton.getEvaluatedVertexValue(suggestionIds[suggestionId],'type'),
                  priority: WandererSingleton.getEvaluatedVertexValue(suggestionIds[suggestionId],'priority')
                })

              }

            }
          }

        }
      }

    })
  },
  computed: {
    answered: function () {
      return WandererSingleton.getLifecycleValue(this.vertexId, 'answered')
    },
    repeatable: function () {
      return WandererSingleton.isVertexInTraversal(this.vertexId)
    }
  },
  methods: {
    askAgain () {

      // this.answered = false;

      // Mark this question as not answered
      WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
        id: this.vertexId,
        key: 'answered',
        value: false
      })

      WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
        id: this.vertexId,
        key: 'sent',
        value: false
      })

      // Mark the suggestions as not answered
      for(var s in this.suggestions) {
        if (this.suggestions.hasOwnProperty(s)) {
          WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
            id: this.suggestions[s]._id,
            key: 'answered',
            value: false
          })
        }
      }

    }
  }
}
</script>

<style>
.button--repeat {
  cursor:pointer;
}
</style>
