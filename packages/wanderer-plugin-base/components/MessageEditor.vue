<template>
  <div>

    <builder-textarea-input label="Message" placeholder="Message" v-model="message" />

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
    }
  }
}
</script>

<style>

</style>
