<template>
  <div>

    <button class="btn" v-on:click="jump()">{{label}}</button>

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

    // this.jump()

  },
  computed: {
    url: function () {
      if(this.vertexId != undefined) {
        return WandererSingleton.getEvaluatedVertexValue(this.vertexId,'url')
      }
    },
    label: function () {
      if(this.vertexId != undefined) {
        return WandererSingleton.getTranslatableVertexValue(this.vertexId,'label')
      }
    }
  },
  methods: {
    jump () {
      WandererSingleton.loadJsonRemote(this.url)
    }
  }
}
</script>

<style>

</style>
