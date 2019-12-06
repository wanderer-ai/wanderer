<template>
  <div>

    <span v-on:click="openLink()">{{label}}</span>

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {
  props: {
    data: {
      type: Object
    }
  },
  mounted () {
    this.openLink()
  },
  computed: {
    label: function () {
      if(this.data.vertexId != undefined) {
        return WandererSingleton.getTranslatableVertexValue(this.data.vertexId,'label')
      }
    },
    link: function () {
      if(this.data.vertexId != undefined) {
        return WandererSingleton.getTranslatableVertexValue(this.data.vertexId,'link')
      }
    }
  },
  methods: {

    openLink () {

      // Open the link
      window.open(this.link)

      var that = this

      function returnToPage() {
        WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
          id: that.data.vertexId,
          key: 'finished',
          value: true
        })

        // Start next traversal tick
        WandererSingleton.traverse()

        // Remove the listener
        window.removeEventListener('focus', returnToPage);
      }

      // Register event to confirm this node if the user comes back
      window.addEventListener('focus', returnToPage);

    }

  }
}
</script>

<style>

</style>
