
<template>

  <div>

    <portal to="actionbar" :order="4">
      <builder-button color="green" title="Reload Tutorial" v-on:click="reload" v-if="tutorialMode">
        <icon name="sync"></icon>
      </builder-button>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/sync'
import Icon from 'vue-awesome/components/Icon'

export default {
  components: {
    Icon
  },
  computed: {
    tutorialMode () {
      return this.$store.state.wandererBuilder.tutorialMode
    },
    currentFlowUrl () {
      return this.$store.state.wandererBuilder.currentFlowUrl
    }
  },
  methods: {
    reload () {
      this.$wanderer.loadFromUrl(this.currentFlowUrl)
    }
  }
}
</script>

<style>

</style>
