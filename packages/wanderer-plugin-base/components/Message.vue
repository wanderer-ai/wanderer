<template>
  <div class="message" v-html="message"></div>
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
        return WandererSingleton.markdown2html(WandererSingleton.evaluateVertexTemplate(WandererSingleton.getTranslatableVertexValue(this.vertexId,'message'), this.vertexId))
      }
    }
  }
}
</script>

<style>

.message p:last-of-type {
  margin: 0;
}

.message a {
  color:white;
}

</style>
