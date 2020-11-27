<template>
  <div>

    <builder-text-input label="Topic" placeholder="Topic" v-model="topic" />

    <builder-text-input label="Author" placeholder="Author" v-model="author" />

    <builder-text-input label="License" placeholder="License" v-model="license" />

  </div>
</template>

<script>

export default {
  data: function () {
    return {
      
    }
  },
  computed: {
    topic: {
      get: function () {
        return this.$builder.getTranslatableVertexDataValue('topic')
      },
      set: function (value) {
        this.$builder.setTranslatableVertexDataValue('topic', value)
      }
    },
    author: {
      get: function () {
        return this.$builder.getVertexDataValue('author')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('author', value)
      }
    },
    license: {
      get: function () {
        return this.$builder.getVertexDataValue('license')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('license', value)
      }
    },

  }
}
</script>

<style>

</style>
