<template>
  <div>
    <builder-text-input label="Import URL" placeholder="https://" v-model="url" />
    <builder-text-input label="Vertex ID" placeholder="ea900e19-cf32-4ee0-bf05-b54314367aca" v-model="vertexId" />
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
    vertexId: {
      get: function () {
        return this.$builder.getVertexDataValue('vertexId')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('vertexId', value)
      }
    }
  }
}
</script>

<style>

</style>
