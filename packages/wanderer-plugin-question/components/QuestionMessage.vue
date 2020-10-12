<template>
  <div>

    {{question}}

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
  data: function () {
    return {
      answers: []
    }
  },
  computed: {
    question: function () {
      if(this.vertexId != undefined) {
        return WandererSingleton.getTranslatableVertexValue(this.vertexId,'question')
      }
    }
  }

}
</script>

<style>

</style>
