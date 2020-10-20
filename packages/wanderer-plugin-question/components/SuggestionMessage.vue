<template>
  <div>

    <span>{{answers}}</span>

    <span :class="(repeatable?'button--pointer':'button--disabled')" v-on:click="askAgain()">↺</span>

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
    text: {
      type: String
    }
  },
  computed: {
    answers: function () {

      var dynamicMode = false

      // By default this is the message string
      var message = this.text

      // Override with reactive value if we have enabled the dynamic mode
      if(dynamicMode) {
        if(this.vertexId != undefined) {
          message = this.$getChatSuggestionMessage(this.vertexId)
        }
      }

      return message
    },
    repeatable: function () {
      return WandererSingleton.isVertexInTraversal(this.vertexId)
    }
  },
  methods: {
    askAgain () {

      if(this.repeatable) {
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
}
</script>

<style>
.button--pointer {
  cursor:pointer;
}

.button--disabled {
  color:#ccc;
}
</style>
