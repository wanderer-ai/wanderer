<template>
  <div>

    <strong>{{title}}</strong><br/>

    {{report}}


    <!-- <button class="btn" v-on:click="perceed()">Ok</button> -->

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
    title: function () {
      if(this.vertexId != undefined){
        return WandererSingleton.getTranslatableVertexValue(this.vertexId,'title')
      }
    },
    report: function () {
      if(this.vertexId != undefined){
        return WandererSingleton.getTranslatableVertexValue(this.vertexId,'report')
      }
    }
  },
  methods: {

    // perceed () {
    //   WandererSingleton.traverse()
    // }

  }
}
</script>

<style>

</style>
