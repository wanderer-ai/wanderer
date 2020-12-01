
<template>

  <div>

    <portal to="actionbar" :order="1">
      <button class="btn btn-success navbar-btn" title="Restart Chat" v-on:click="restart()">
        <icon name="sync"></icon>
      </button>
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
  methods: {
    restart () {
      WandererStoreSingleton.store.commit('wanderer/cleanVertexLifecycleData')
      WandererSingleton.trigger('truncate')
      WandererSingleton.removeImmutableData()
    },
  }
}
</script>

<style>

</style>
