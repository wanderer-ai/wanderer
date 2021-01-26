<template>
  <div>

    <builder-text-input label="Conclusion" placeholder="Conclusion" v-model="conclusion" />

  </div>
</template>

<script>

export default {
  computed: {
    conclusion: {
      get: function () {
        return this.$builder.getTranslatableVertexDataValue('conclusion')
      },
      set: function (value) {
        this.$builder.setTranslatableVertexDataValue('conclusion', value)
      }
    }
  }
}
</script>

<style>

</style>
