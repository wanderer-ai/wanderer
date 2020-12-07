<template>
  <div>

    <builder-select-input label="Language" v-model="type" :options="languages"/>

  </div>
</template>

<script>

export default {
  computed: {
    languages () {
      var returnLanguages = {}
      var allLanguages = this.$wanderer.getLanguages()
      var enabledLanguages = this.$vueGraph.getOriginDataValue('languages')
      // Build an object for the select field
      for(var i in enabledLanguages) {
        returnLanguages[enabledLanguages[i]] = allLanguages[enabledLanguages[i]]['name']
      }
      return returnLanguages
    },
    language: {
      get: function () {
        return this.$builder.getVertexDataValue('switchToLanguage')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('switchToLanguage', value)
      }
    },
  }
}
</script>

<style>

</style>
