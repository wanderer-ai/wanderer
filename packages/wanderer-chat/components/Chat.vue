
<template>
  <div class="chat--container">

    <div class="chat--button" v-if="!show" v-on:click="show=true">
      Open Chat
    </div>

    <div v-if="show" class="chat--panel">

      <div class="chat--header">
        <div class="chat--title">
          {{name}}
        </div>
        <div class="chat--close" v-on:click="show=false">
          ×
        </div>
      </div>

      <div class="chat--body" ref="chatbody">

        <div class="chat--messages">
          <div
            v-for="(vertexId, key) in messages"
            :key="key">
            <component v-if="!isInteractionInsideNavigation(vertexId)" v-bind:is="getMessageComponentByVertexId(vertexId)" :vertexId="vertexId"></component>
          </div>
        </div>

        <div class="chat--typing" v-if="typing">
          <span class="chat--typing-circle"></span>
          <span class="chat--typing-circle"></span>
          <span class="chat--typing-circle"></span>
        </div>

        <div class="chat--interactions">
          <div
            v-for="(vertexId, key) in interactions"
            :key="key">
            <component v-if="!isInteractionInsideNavigation(vertexId)" v-bind:is="getInteractionComponentByVertexId(vertexId)" :vertexId="vertexId"></component>
          </div>
        </div>

      </div>

      <div class="chat--navigation">
        <div
          v-for="(vertexId, key) in interactions"
          :key="key">
          <component v-if="isInteractionInsideNavigation(vertexId)" v-bind:is="getInteractionComponentByVertexId(vertexId)" :vertexId="vertexId"></component>
        </div>
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
    name () {
      return this.$chat.getTranslatableOriginDataValue('topic')
    },
    messages: function () {
      return this.$store.state.wandererChat.messageVertexIds
    },
    interactions: function () {
      return this.$store.state.wandererChat.interactionVertexIds
    },
    // interactionVertexIds: function () {
    //   return this.$store.state.wandererChat.interactionVertexIds
    // },
    typing: function () {
      return this.$store.state.wandererChat.typing
    }
  },
  watch: {
    // Lets watch the message ids
    // So we can detect if a new message will income at the stack
    messages: function (newObj, oldObj) {
      this.scrollToBottom()
    },
    interactions: function (newObj, oldObj) {
      // This object will be completely overidden on every cycle. So lets watch the length only.
      if(interactionsCount!=this.interactions.length) {
        interactionsCount = this.interactions.length
        this.scrollToBottom()
      }
    }
  },
  methods: {
    getMessageComponentByVertexId: function (vertexId) {
      var props = this.$chat.getVertexCollectionPropsById(vertexId)
      if(props) {
        return props.get('messageComponent')
      }
    },
    isInteractionInsideNavigation: function (vertexId) {
      return this.$vueGraph.getVertexDataValue(vertexId, 'showInNavigation')
    },
    getInteractionComponentByVertexId: function (vertexId) {
      var props = this.$chat.getVertexCollectionPropsById(vertexId)
      if(props) {
        return props.get('interactionComponent')
      }
    },
    scrollToBottom: function () {

      // Set auto scroll activation timeout
      if(this.scrollTimeout) {
        clearTimeout(this.scrollTimeout)
      }

      this.scrollTimeout = setTimeout(() => {
        if(this.$refs['chatbody'] != undefined) {
          this.$refs['chatbody'].scrollTo(0,this.$refs['chatbody'].scrollHeight)
        }
      }, 100)

    }
  }
}

</script>

<style>

.chat--container {
  @apply fixed right-0 bottom-0 m-4 z-50;
}

.chat--button {
  @apply relative bg-blue p-4 rounded-md shadow-md text-white;
}

.chat--button:after {
  @apply absolute block w-0 h-0;
  content: "";
  right: 2rem;
  bottom: -0.5rem;
  border-left: 0.5rem solid transparent;
  border-right: 2px solid transparent;
  border-top: 0.5rem solid theme('colors.blue');
}

.chat--panel {
  @apply flex h-full items-stretch flex-col rounded-md shadow-lg border-2 border-blue;
  width:300px;
  height:500px;
}

.chat--header {
  @apply flex justify-between bg-blue p-4 text-white;
}

.chat--title {
  @apply font-bold;
}

.chat--close {
  @apply cursor-pointer;
}

.chat--body {
  @apply flex-grow bg-gray p-2;
  overflow-y: auto;
}

.chat--messages {

}

.chat--navigation {
  @apply bg-blue p-4 text-white;
}

.chat--typing {
  @apply flex mb-2 mt-4;
}

.chat--typing-circle {
  @apply bg-gray-dark;
  display: block;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin: 2px;
  animation: hat-typing-bounce 600ms ease-in-out infinite;
  /* animation: chat-typing-scale 600ms ease-in-out infinite; */
}

.chat--typing-circle:nth-child(1) {
  animation-delay: 0ms;
}

.chat--typing-circle:nth-child(2) {
  animation-delay: 200ms
}

.chat--typing-circle:nth-child(3) {
  animation-delay: 400ms
}

@keyframes chat-typing-scale {
  0% { transform: scale(1); }
  33% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}

@keyframes hat-typing-bounce {
  0% { transform: translateY(0); }
  33% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

</style>
