
<template>
  <div class="chat">

    <div class="chat-messages" id="chat">

      <message v-for="message in messages" :key="message.id" :from="message.from" :delay="message.delay" :backgroundColor="message.backgroundColor">
        <component v-bind:is="message.component" :data="message.data"></component>
      </message>

    </div>
    <div class="chat-controls">

      <div v-if="showTyping">
        Typing ...
      </div>

      <button class="btn" v-on:click="restart">Restart</button>
    </div>
  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'
import CytoscapeSingleton from 'wanderer-cytoscape-singleton'

import Message from './components/Message.vue'

export default {
  name: 'App',
  components: {
    Message
  },
  data: function () {
    return {
      showTyping: false
    }
  },
  computed: {
    messages: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.messages
    },
    vertexCount () {
      return WandererStoreSingleton.store.state.wanderer.vertexDocumentIds.length
    }
  },
  watch: {
    // whenever question changes, this function will run
    messages: function (newObj, oldObj) {
      // Set typing timeout
      this.showTyping = true
      setTimeout(() => {
        this.showTyping = false
      }, newObj[newObj.length - 1].delay)

      // Set auto scroll activation timeout
      setTimeout(() => {
        // Scroll to bottom
        this.scrollToBottom()
      }, newObj[newObj.length - 1].delay + 100)
    }
  },
  mounted: function () {
    // Lets check if cy is already initiated
    // The Chat component could be part of other libs that have already initiated cy like the builder
    if (!CytoscapeSingleton.initiated()) {
      CytoscapeSingleton.init({
        headless: true
      })
    }

    this.$nextTick(function () {
      if (!this.vertexCount) {
        console.log('No data! Loading!')

        this.$axios.get('/static/startflow.json')
          .then((response) => {
            console.log(response.data)
            WandererSingleton.load(response.data)
            WandererSingleton.traverse()
          }, (error) => {
            console.log('error loading initial chat data')
            console.log(error)
          })
      } else {
        // Start the traversal
        WandererSingleton.traverse()
      }
    })
  },
  methods: {
    restart () {
      WandererSingleton.trigger('clean')
      WandererSingleton.traverse()
    },
    scrollToBottom () {
      var elem = document.getElementById('chat')
      if (elem.scrollTop !== (elem.scrollHeight - elem.offsetHeight)) {
        elem.scrollBy(0, 2)
        setTimeout(this.scrollToBottom, 1)
      }
    }
  }
}

</script>

<style>
.chat{
  height:100%;
}
.chat-messages{
  padding-bottom:100px;
}
.chat-controls{
  position:fixed;
  left:0;
  bottom:0;
  min-height:50px;
}
</style>
