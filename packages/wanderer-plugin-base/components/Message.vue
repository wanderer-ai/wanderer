<template>
  <div>

    {{ message }}

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'

export default {
  props: {
    vertexId: {
      type: String
    }
  },
  computed: {
    message: function () {
      if(this.vertexId != undefined){
        return WandererSingleton.getTranslatableVertexValue(this.vertexId,'message')
      }
    }
  }
}
</script>

<style>

</style>
