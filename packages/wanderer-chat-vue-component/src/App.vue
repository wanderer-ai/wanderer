
<template>
  <div class="chat">

    <div class="chat-messages" ref="messages">

      <message
        v-for="(message,key) of messages"
        :key="message.id"
        :id="message.id"
        :from="message.from"
        :backgroundColor="message.backgroundColor">

        <component v-bind:is="message.component" :vertexId="message.vertexId" :lastOfType="lastOfType[message.component] == message.id" :last="key == messages.length - 1"></component>

      </message>

      <div v-if="typing">
        Typing ...
      </div>

      <div class="chat-messages-bottom-spacing"></div>

    </div>
    <div class="chat-interactions">

      <div
        v-if="interactions.length"
        v-for="(interaction,key) of interactions"
        :key="key">

        <component class="mb-2" v-bind:is="interaction.component" :vertexId="interaction.vertexId"></component>

      </div>

    </div>

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'
import CytoscapeSingleton from 'wanderer-cytoscape-singleton'

import Message from './components/Message.vue'
// import Report from './components/Report.vue'

export default {
  name: 'App',
  components: {
    Message
  },
  data: function () {
    return {
      // showTyping: false,
      waitingForMessage: false,
      showReport: false,
      scrollTimeout: false
    }
  },
  computed: {
    messageIds: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.messageIds
    },
    messages: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.messages
    },
    interactions: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.interactions
    },
    typing: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.typing
    },
    lastOfType: function () {
      var result = {};
      for (var key in this.messages) {
        result[this.messages[key]['component']] = this.messages[key]['id'];
      }
      return result
    },
    vertexCount () {
      return WandererStoreSingleton.store.state.wanderer.vertexDocumentIds.length
    }
  },
  watch: {
    // Lets watch the message ids
    // So we can detect if a new message will income at the stack
    messageIds: function (newObj, oldObj) {

      var component = this

      // Set auto scroll activation timeout
      if(this.scrollTimeout) {
        clearTimeout(this.scrollTimeout)
      }
      this.scrollTimeout = setTimeout(() => {
        this.$refs['messages'].scrollTo(0,this.$refs['messages'].scrollHeight)
      }, 100)
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
    WandererSingleton.startTraversal()
  },
  beforeDestroy: () => {

    WandererSingleton.stopTraversal()

    // if(this.scrollTimeout) {
    //   clearTimeout(this.scrollTimeout)
    // }
  },
  methods: {

  }
}

</script>

<style>
.chat{

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
  height:100%;
}
.chat-messages {
  overflow-y: scroll;
  flex:1 1;
  padding:20px;
}
.chat-messages-bottom-spacing {
  padding-bottom:100px; /* For some reason I cannot scroll to the final bottom. A few pixels always left. So I added a padding. So the message should always be visible */
}
.chat-interactions {
  flex:0 0 100px;
  padding:20px;
}




</style>
