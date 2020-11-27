<template>
  <div>

    <span>{{answers}}</span>

    <span :class="(repeatable?'button--pointer':'button--disabled')" v-on:click="askAgain()">↺</span>

  </div>
</template>

<script>

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

      // var dynamicMode = false
      //
      // // By default this is the message string
      // var message = this.text
      //
      // // Override with reactive value if we have enabled the dynamic mode
      // if(dynamicMode) {
      //   if(this.vertexId != undefined) {
      //     message = this.$getChatSuggestionMessage(this.vertexId)
      //   }
      // }
      //
      // return message
    },
    repeatable: function () {
      // return WandererSingleton.isVertexInTraversal(this.vertexId)
    },
    suggestionIds: function () {
      // if(this.vertexId != undefined) {
      //   if(WandererStoreSingleton.store.state.wanderer.question.suggestions[this.vertexId] != undefined) {
      //     return WandererStoreSingleton.store.state.wanderer.question.suggestions[this.vertexId]
      //   }
      // }
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
.button--pointer {
  cursor:pointer;
}

.button--disabled {
  color:#ccc;
}
</style>
