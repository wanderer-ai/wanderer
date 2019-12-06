<template>

  <div class="btn-group" >
    <div class="btn btn-sm" v-bind:class="{'btn-primary': currentLanguage==enabledLanguage,'btn-secondary': currentLanguage!=enabledLanguage}" v-for="(enabledLanguage) in enabledLanguages" v-bind:key="enabledLanguage" v-on:click="localize(enabledLanguage)">{{languages[enabledLanguage]['name']}}</div>
  </div>

</template>

<script>

  import WandererSingleton from 'wanderer-singleton'

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

        this.$store.commit('wanderer/setCurrentLanguage',language)

        // Rebuild cytoscape data
        for(let i in this.$store.state.wanderer.vertexDocumentIds){
          WandererSingleton.vertexToCytoscape(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.vertexDocumentIds[i]])
        }
        for(let i in this.$store.state.wanderer.edgeDocumentIds){
          WandererSingleton.edgeToCytoscape(this.$store.state.wanderer.edgeDocumentData[this.$store.state.wanderer.edgeDocumentIds[i]])
        }

        this.$emit('localized')

      },
    }
  }

</script>

<style>



</style>
