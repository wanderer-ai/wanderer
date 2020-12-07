<template>
  <div>
    <builder-text-input label="Import URL" placeholder="https://" v-model="url" />
  </div>
</template>

<script>

export default {
  computed: {
    url: {
      get: function () {
        return this.$builder.getVertexDataValue('url')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('url', value)
      }
    },
  }
}
</script>

<style>

</style>
