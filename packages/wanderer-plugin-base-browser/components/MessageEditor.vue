<template>
  <div>

    <builder-textarea-input label="Message" placeholder="Message" v-model="message" />

    <builder-checkbox-input label="Forget on inactive" v-model="forgetful" />

  </div>
</template>

<script>

export default {
  computed: {
    message: {
      get: function () {
        return this.$builder.getTranslatableVertexDataValue('message')
      },
      set: function (value) {
        this.$builder.setTranslatableVertexDataValue('message', value)
      }
    },
    forgetful: {
      get: function () {
        return this.$builder.getVertexDataValue('forgetful')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('forgetful', value)
      }
    },
  }
}
</script>

<style>

</style>
