<template>
  <div>

    {{offboarding}}

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
    offboarding: function () {
      if(this.data.vertexId != undefined){
        return WandererSingleton.getTranslatableVertexValue(this.data.vertexId,'offboarding')
      }
    }
  }
}
</script>

<style>

</style>
