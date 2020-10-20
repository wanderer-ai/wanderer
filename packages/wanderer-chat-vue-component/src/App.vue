
<template>
  <div class="chat">
    <div class="chat--messages" ref="messages">

      <div>
        <message
          v-for="(message,key) of messages"
          :key="message.id"
          :id="message.id"
          :from="message.from"
          :backgroundColor="message.backgroundColor">
          <component v-bind:is="message.component" :text="message.text" :vertexId="message.vertexId" :lastOfType="lastOfType[message.component] == message.id" :last="key == messages.length - 1"></component>
        </message>
      </div>

      <div class="typing" v-if="typing">
        <span class="circle bouncing"></span>
        <span class="circle bouncing"></span>
        <span class="circle bouncing"></span>
      </div>

      <div>
        <message
          v-if="interactions.length && !interaction.showInNavigation"
          v-for="(interaction,key) of interactions"
          :key="interaction.vertexId"
          :id="interaction.vertexId"
          from="remote"
          backgroundColor="#6C757D">
          <component class="mb-2" v-bind:is="interaction.component" :vertexId="interaction.vertexId"></component>
        </message>
      </div>

    </div>
    <div class="chat--navigation">
      <div
        v-if="interactions.length && interaction.showInNavigation"
        v-for="(interaction,key) of interactions"
        :key="interaction.vertexId"
        :id="interaction.vertexId">
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

var interactionsCount = 0;

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
    interactionVertexIds: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.interactionVertexIds
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
      this.scrollToBottom()
    },
    interactionVertexIds: function (newObj, oldObj) {
      // This object will be completely overidden on every cycle. So lets watch the length only.
      if(interactionsCount!=this.interactionVertexIds.length) {
        interactionsCount = this.interactionVertexIds.length
        this.scrollToBottom()
      }
    },
    typing: function () {
      // this.scrollToBottom()
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

  },
  methods: {
    scrollToBottom: function () {

      // Set auto scroll activation timeout
      if(this.scrollTimeout) {
        clearTimeout(this.scrollTimeout)
      }

      this.scrollTimeout = setTimeout(() => {
        this.$refs['messages'].scrollTo(0,this.$refs['messages'].scrollHeight)
      }, 100)

    }
  }
}

</script>

<style>
.chat {
  display: flex;
  flex-direction: column;
  height:100%;
}

.chat--messages {
  flex-shrink: 1;
  flex-grow: 1;
  padding-top:25px;
  overflow-y: scroll;
}

.chat--navigation {
  flex-shrink: 1;
  flex-grow: 1;
  padding:25px;
  background-color: #F8F9FA;
}

.typing {
  display: block;
  width: 60px;
  height: 40px;
  background-color: #6C757D;
  margin-left: 20px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom:25px;
}

.circle {
  display: block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #fff;
  margin: 3px;
}

.circle.bouncing {
  animation: bounce 600ms ease-in-out infinite;
}

.circle.scaling {
  animation: typing 600ms ease-in-out infinite;
}

.circle:nth-child(1) {
  animation-delay: 0ms;
}

.circle:nth-child(2) {
  animation-delay: 200ms
}

.circle:nth-child(3) {
  animation-delay: 400ms
}

@keyframes typing {
  0% { transform: scale(1); }
  33% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}

@keyframes bounce {
  0% { transform: translateY(0); }
  33% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

</style>
