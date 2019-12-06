
<template>

  <div>

    <portal to="actionbar" :order="1">
      <button class="btn btn-secondary navbar-btn" title="Switch language" v-on:click="showModal=true">
        <icon name="flag"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal title="Switch and manage languages" :show="showModal"  v-on:closeButton="showModal=false">

        <language-switcher v-on:localized="showModal=false"/>

        <p>
          <div class="btn btn-small" v-on:click="toggleMore">
            <span>Enable / Disable more Languages</span>
          </div>
        </p>

        <div v-if="showMore">

          <div class="form-check form-check-inline" v-for="(language, code) in languages" v-bind:key="code">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox" value="true" v-on:click="toggle(code,$event)" :checked="enabledLanguages.includes(code)">
              {{language.name}}
            </label>
          </div>

        </div>

      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/flag'
import Icon from 'vue-awesome/components/Icon'
import WandererSingleton from 'wanderer-singleton'

import LanguageSwitcher from '../LanguageSwitcher.vue'

export default {
  components: {
    Modal, Icon, LanguageSwitcher
  },
  data: function () {
    return {
      showModal: false,
      showMore: false
    }
  },
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
    toggleMore(){
      if(this.showMore){
        this.showMore = false;
      }else{
        this.showMore = true;
      }
    },
    toggle(language,e){
      if (e.target.checked) {
        this.$store.commit('wanderer/enableLanguage',language)
      }else{
        this.$store.commit('wanderer/disableLanguage',language)
      }
    }
  }
}
</script>

<style>

</style>
