
<template>
  <div class="chat" id="chat">

    <div>
      <message v-for="message in messages" :key="message.id" :from="message.from" :delay="message.delay">
        <component v-bind:is="message.component" :data="message.data"></component>
      </message>
    </div>

    <button class="btn" v-on:click="traverse">Start traverse</button>
    <button class="btn" v-on:click="clean">Clean</button>

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'
import WandererCytoscapeSingleton from 'wanderer-cytoscape-singleton'

import Message from './components/Message.vue'

export default {
  name: 'App',
  components: {
    Message
  },
  computed: {
    messages: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.messages
    }
  },
  watch: {
    // whenever question changes, this function will run
    messages: function (newObj, oldObj) {
      setTimeout(function(){
        var objDiv = document.getElementById("chat");
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 500);

    }
  },
  methods: {
    traverse () {
      WandererSingleton.traverse()
    },
    clean () {
      WandererStoreSingleton.store.commit('wanderer/chat/cleanMessages')
    }
  }
}

</script>

<style>
.chat{
  overflow-y: scroll;
  overflow-x: visible;
  height: 100%
}
</style>
