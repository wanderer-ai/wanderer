<template>

  <builder-button-group>
    <builder-button :size="size" :color="(currentLanguage==enabledLanguage?'blue':'gray-dark')" v-for="(enabledLanguage) in enabledLanguages" v-bind:key="enabledLanguage" v-on:click="localize(enabledLanguage)">{{languages[enabledLanguage]['name']}}</builder-button>
  </builder-button-group>

</template>

<script>

  export default {
    props: {
      size: {
        type: String,
        default: 'normal'
      }
    },
    computed: {
      languages () {
        return this.$wanderer.getLanguages()
      },
      currentLanguage () {
        return this.$builder.getCurrentLanguage()
      },
      enabledLanguages () {
        var languages = this.$vueGraph.getOriginDataValue('languages')
        if(!languages) {
          languages = []
        }
        return languages
      }
    },
    methods: {
      localize(language) {
        this.$builder.setCurrentLanguage(language);
        this.$emit('localized')
      }
    }
  }

</script>

<style>



</style>
