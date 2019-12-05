<template>
  <div>

    {{ message }}

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'

export default {
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    message: function () {
      if(this.data.vertexId != undefined){
        return WandererSingleton.getTranslatableVertexValue(this.data.vertexId,'message')
      }
    }
  }
}
</script>

<style>

</style>
