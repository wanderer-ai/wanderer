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
    data: {
      type: Object
    }
  },
  computed: {
    conclusion: function () {
      if(this.data.vertexId != undefined){
        return WandererSingleton.getTranslatableVertexValue(this.data.vertexId,'conclusion')
      }
    }
  },
  methods: {

    // report () {
    //   WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
    //     // id: traversalResult.lastFoundConclusionIds[i],
    //     component: 'wanderer-report-message',
    //     backgroundColor: '#FEC106',
    //     data: {
    //
    //     },
    //     delay: 1000
    //   })
    // }

  }
}
</script>

<style>

</style>
