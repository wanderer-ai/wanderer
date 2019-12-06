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
      if(this.data.vertexId != undefined) {
        return WandererSingleton.getVertexValue(this.data.vertexId,'url')
      }
    },
    label: function () {
      if(this.data.vertexId != undefined) {
        return WandererSingleton.getTranslatableVertexValue(this.data.vertexId,'label')
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
