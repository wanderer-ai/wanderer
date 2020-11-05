<template>

  <div class="btn-group" >
    <div class="btn btn-sm" v-bind:class="{'btn-primary': currentLanguage==enabledLanguage,'btn-secondary': currentLanguage!=enabledLanguage}" v-for="(enabledLanguage) in enabledLanguages" v-bind:key="enabledLanguage" v-on:click="localize(enabledLanguage)">{{languages[enabledLanguage]['name']}}</div>
  </div>

</template>

<script>

  export default {
    computed: {
      languages () {
        return WandererSingleton.getLanguages()
      },
      currentLanguage () {
        return this.$store.state.wanderer.currentLanguage;
      },
      enabledLanguages () {
        if (this.$store.state.wanderer.originVertexId) {
          return this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.originVertexId].languages;
        }
        return [];
      }
    },
    methods: {
      localize(language){

        WandererSingleton.setLanguage(language);

        this.$emit('localized')

      },
    }
  }

</script>

<style>



</style>
