<template>
  <div>

    <div class="form-group">
      <label for="language">Language</label>
      <select id="language" class="form-control" v-model="language">
        <option
          v-for="language in enabledLanguages"
          :value="language">{{languages[language]['name']}}</option>
      </select>
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'
import WandererSingleton from 'wanderer-singleton'

export default {
  computed: {
    languages () {
      return WandererSingleton.getLanguages()
    },
    enabledLanguages () {
      if (this.$store.state.wanderer.originVertexId) {
        return this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.originVertexId].languages;
      }
      return [];
    },
    language: WandererBuilder.getVertexModel('switchToLanguage')
  }
}
</script>

<style>

</style>
