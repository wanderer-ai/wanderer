
<template>

  <div>

    <portal to="toolbar" :order="2">
      <button class="btn btn-warning navbar-btn" title="Connect" v-on:click="connect()" v-if="selectedVertexIds.length==2">
        <icon name="link"></icon>
      </button>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/link'
import Icon from 'vue-awesome/components/Icon'

import Brain from 'wanderer-brain'

export default {
  components: {
    Icon
  },
  computed: {
    selectedVertexIds () {
      return this.$store.state.brain.selectedVertexIds
    }
  },
  methods: {
    connect () {
      this.showModal = false
      Brain.connectById(this.selectedVertexIds[0], this.selectedVertexIds[1])
    }
  }
}
</script>

<style>

</style>
