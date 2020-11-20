#
<template>
  <div class="fixed right-0 bottom-0 m-4 z-40">

    <div class="bg-blue p-4" v-if="!show" v-on:click="show=true">
      Open Chat
    </div>

    <div v-if="show" class="" ref="messages">

      Chat

      <div>
        <chat-message
          v-for="(message,key) of messages"
          :key="message.id"
          :id="message.id"
          :from="message.from"
          :backgroundColor="message.backgroundColor">
          <component v-bind:is="message.component" :text="message.text" :vertexId="message.vertexId"></component>
        </chat-message>
      </div>

      <div class="typing" v-if="typing">
        <span class="circle bouncing"></span>
        <span class="circle bouncing"></span>
        <span class="circle bouncing"></span>
      </div>

      <div v-if="interactions.length">
        <chat-message
          v-if="!interaction.showInNavigation"
          v-for="(interaction,key) of interactions"
          :key="interaction.vertexId"
          :id="interaction.vertexId"
          from="remote"
          backgroundColor="#6C757D">
          <component class="mb-2" v-bind:is="interaction.component" :vertexId="interaction.vertexId"></component>
        </chat-message>
      </div>

    </div>

    <div v-if="interactions.length" class="chat--navigation">
      <div
        v-if="interaction.showInNavigation"
        v-for="(interaction,key) of interactions"
        :key="interaction.vertexId"
        :id="interaction.vertexId">
        <component class="mb-2" v-bind:is="interaction.component" :vertexId="interaction.vertexId"></component>
      </div>
    </div>

  </div>
</template>

<script>

var interactionsCount = 0;

export default {
  data: function () {
    return {
      scrollTimeout: false,
      show: false
    }
  },
  computed: {
    messageIds: function () {
      return this.$store.state.wandererChat.messageIds
    },
    messages: function () {
      return this.$store.state.wandererChat.messages
    },
    interactions: function () {
      return this.$store.state.wandererChat.interactions
    },
    interactionVertexIds: function () {
      return this.$store.state.wandererChat.interactionVertexIds
    },
    typing: function () {
      return this.$store.state.wandererChat.typing
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
    }
  },
  methods: {
    scrollToBottom: function () {

      // Set auto scroll activation timeout
      if(this.scrollTimeout) {
        clearTimeout(this.scrollTimeout)
      }

      this.scrollTimeout = setTimeout(() => {
        if(this.$refs['messages'] != undefined) {
          this.$refs['messages'].scrollTo(0,this.$refs['messages'].scrollHeight)
        }
      }, 100)

    }
  }
}

</script>

<style>

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
