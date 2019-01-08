<template>
  <div>

    AH! {{conclusion}}

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
// import WandererStoreSingleton from 'wanderer-store-singleton'

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
  }
}
</script>

<style>

</style>
