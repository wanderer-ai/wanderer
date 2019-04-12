
<template>
  <div class="chat">

    <div class="chat-messages" id="chat">

      <message
        v-for="(message,key) of messages"
        :key="message.id"
        :id="message.id"
        :from="message.from"
        :delay="message.delay"
        :backgroundColor="message.backgroundColor"
        v-on:messageArrived="messageArrived">
        <component v-bind:is="message.component" :data="message.data" :last="key == messages.length - 1"></component>
      </message>

    </div>
    <div class="chat-controls">

      <div v-if="showTyping">
        Typing ...
      </div>

      <button class="btn btn-secondary" v-on:click="restart">Restart</button>
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
      // setTimeout(() => {
      //   this.showTyping = false
      // }, newObj[newObj.length - 1].delay)

      // Set auto scroll activation timeout
      // setTimeout(() => {
      //   // Scroll to bottom
      //   this.scrollToBottom()
      // }, newObj[newObj.length - 1].delay + 100)
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
    },
    messageArrived (messageId) {
      this.showTyping = false

      window.scrollTo(0,document.body.scrollHeight);

      // var element = document.getElementById('message-'+messageId);
      // if(element){
      //   console.log(scroll);
      //   element.scrollIntoView();
      // }

      //window.location.href = "#message-"+id;

    }
  }
}

</script>

<style>
.chat{
  padding:20px;
}
.chat-messages{
  padding-bottom:100px;
}
.chat-controls{
  position:fixed;
  left:1rem;
  bottom:1rem;
}
</style>
