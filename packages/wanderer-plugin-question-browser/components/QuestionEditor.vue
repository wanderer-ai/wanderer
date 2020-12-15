<template>
  <div>

    <builder-textarea-input label="Question" placeholder="Question" v-model="question" />

    <builder-checkbox-input label="Hide suggestion messages in chat" v-model="hideMessages" />

    <builder-checkbox-input label="Show in navigation" v-model="showInNavigation" />
    
    <builder-checkbox-input label="Forget on inactive" v-model="forgetful" />

  </div>
</template>

<script>

export default {
  computed: {
    question: {
      get: function () {
        return this.$builder.getTranslatableVertexDataValue('question')
      },
      set: function (value) {
        this.$builder.setTranslatableVertexDataValue('question', value)
      }
    },
    hideMessages: {
      get: function () {
        return this.$builder.getVertexDataValue('hideMessages')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('hideMessages', value)
      }
    },
    showInNavigation: {
      get: function () {
        return this.$builder.getVertexDataValue('showInNavigation')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('showInNavigation', value)
      }
    },
    forgetful: {
      get: function () {
        return this.$builder.getVertexDataValue('forgetful')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('forgetful', value)
      }
    }
  }
}
</script>

<style>

</style>
