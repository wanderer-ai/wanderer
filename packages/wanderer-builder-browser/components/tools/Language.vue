
<template>

  <div>

    <portal to="actionbar" :order="1">
      <builder-button color="gray-dark" title="Switch language" v-on:click="showModal=true">
        <icon name="flag"></icon>
      </builder-button>
    </portal>

    <portal to="modals" :order="1">
      <builder-modal title="Manage languages" :show="showModal"  v-on:closeButton="showModal=false">

        <language-switcher v-on:localized="showModal=false"/>

        <div v-if="showMore">

          <span class="" v-for="(language, code) in languages" v-bind:key="code">

            <label class="">
              <input class="form-check-input" type="checkbox" value="true" v-on:click="toggle(code,$event)" :checked="enabledLanguages.includes(code)">
              {{language.name}}
            </label>

          </span>

        </div>

        <template v-slot:buttons>
          <builder-button color="gray-dark" size="small" v-on:click="toggleMore">
            <icon name="flag"></icon> More languages
          </builder-button>
        </template>

      </builder-modal>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/flag'
import Icon from 'vue-awesome/components/Icon'

import LanguageSwitcher from '../LanguageSwitcher.vue'

export default {
  components: {
    Icon, LanguageSwitcher
  },
  data: function () {
    return {
      showModal: false,
      showMore: false
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
    toggleMore(){
      if(this.showMore) {
        this.showMore = false
      }else {
        this.showMore = true
      }
    },
    toggle(language,e){
      if (e.target.checked) {
        this.$vueGraph.enableLanguage(language)
      }else{
        this.$vueGraph.disableLanguage(language)
      }
    }
  }
}
</script>

<style>

</style>
