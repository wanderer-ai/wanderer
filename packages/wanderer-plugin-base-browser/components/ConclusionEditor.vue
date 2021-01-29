<template>
  <div>

    <builder-text-input label="Conclusion" placeholder="Conclusion" v-model="conclusion" />

    <builder-textarea-input label="Expression" placeholder="Expression" v-model="expression" />

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
    },
    expression: {
      get: function () {
        return this.$builder.getVertexDataValue('expression')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('expression', value)
      }
    }
  }
}
</script>

<style>

</style>
