<template>
  <div>

    {{conclusion}}

    <!-- <button class="btn" v-on:click="report()">Report</button> -->

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {
  props: {
    vertexId: {
      type: String
    }
  },
  computed: {
    conclusion: function () {
      if(this.vertexId != undefined){
        return WandererSingleton.getTranslatableVertexValue(this.vertexId,'conclusion')
      }
    }
  },
  methods: {

    // report () {
    //   WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
    //     // id: traversalResult.lastFoundConclusionIds[i],
    //     component: 'wanderer-report-message',
    //     backgroundColor: '#FEC106',
    //     delay: 1000
    //   })
    // }

  }
}
</script>

<style>

</style>
