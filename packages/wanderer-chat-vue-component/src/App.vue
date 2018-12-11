
<template>
  <div>

    Chat
    <button class="btn" v-on:click="traverse">Start traverse</button>

    <div>
      <div v-for="message in messages" :key="message.id">
        <component v-bind:is="message.component" :data="message.data"></component>
      </div>
    </div>

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'
import WandererCytoscapeSingleton from 'wanderer-cytoscape-singleton'

export default {
  name: 'App',
  computed: {
    messages: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.messages
    }
  },
  methods: {
    traverse () {

      let startNodeId = WandererStoreSingleton.store.state.wanderer.vertexDocumentIds[0]

      //let nodes = WandererCytoscapeSingleton.cy.$('node[_collection = "flow"]')
      // console.log(nodes)
      WandererSingleton.traverse(startNodeId);
    }
  }
}

</script>

<style>

</style>
