
<template>
  <div class="chat--container" v-if="vertexCount">

    <div v-if="!isVisible">
      <div class="chat--button" @click="show()" :class="(actionRequired?'chat--shake':'')">
        Open Chat
      </div>
    </div>

    <div v-if="isVisible" class="chat--panel" @click="focus()">

      <div class="chat--header">
        <div class="chat--title">
          {{name}}
        </div>
        <div class="chat--close" @click="hide()">
          <svg class="chat--close-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
          </svg>
        </div>
      </div>

      <div class="chat--body" ref="chatbody">

        <div class="chat--messages">
          <div
            v-for="(messageId, key) in messages"
            :key="key">
            <component v-bind:is="getMessageComponentByMessageId(messageId)" :messageId="messageId" ></component>
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

    <div class="chat--dot" v-if="actionRequired"></div>

  </div>
</template>

<script>

var interactionsCount = 0;

export default {
  data: function () {
    return {
      scrollTimeout: false,
      isVisible: false,
      actionRequired: false
    }
  },
  computed: {
    vertexCount () {
      return this.$store.state.wandererGraph.vertexDocumentIds.length;
    },
    name () {
      return this.$chat.getTranslatableOriginDataValue('topic')
    },
    messages: function () {
      return this.$store.state.wandererChat.messageIds
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
      if(this.messages.length) {
        this.actionRequired = true
      }
    },
    interactions: function (newObj, oldObj) {
      // This object will be completely overidden on every cycle. So lets watch the length only.
      if(interactionsCount!=this.interactions.length) {
        interactionsCount = this.interactions.length
        this.scrollToBottom()
        this.actionRequired = true
      }
    },
    typing: function (newObj, oldObj) {
      if(newObj) {
        this.scrollToBottom()
      }
    }
  },
  methods: {
    show() {
      this.isVisible = true
      this.actionRequired = false
    },
    hide() {
      this.isVisible = false
    },
    focus() {
      this.unreadMessages = false
      this.actionRequired = false
    },
    // getMessagePayloadByMessageId (messageId) {
    //   var messageData = this.$chat.getMessageDataById(messageId)
    //   return messageData.payload
    // },
    getMessageComponentByMessageId (messageId) {
      var messageData = this.$chat.getMessageDataById(messageId)
      var props = this.$chat.getVertexCollectionPropsById(messageData.vertexId)
      if(props) {
        return props.get('messageComponent')
      }
    },
    isInteractionInsideNavigation (vertexId) {
      return this.$vueGraph.getVertexDataValue(vertexId, 'showInNavigation')
    },
    getInteractionComponentByVertexId (vertexId) {
      var props = this.$chat.getVertexCollectionPropsById(vertexId)
      if(props) {
        return props.get('interactionComponent')
      }
    },
    scrollToBottom () {

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
  cursor:pointer;
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

.chat--close-icon path {
  fill: white;
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

.chat--shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 5s;

  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% { transform: translate(0px, 0px) rotate(0deg); }
  1% { transform: translate(-1px, -2px) rotate(-1deg); }
  2% { transform: translate(-3px, 0px) rotate(1deg); }
  3% { transform: translate(3px, 2px) rotate(0deg); }
  4% { transform: translate(1px, -1px) rotate(1deg); }
  5% { transform: translate(-1px, 2px) rotate(-1deg); }
  6% { transform: translate(-3px, 1px) rotate(0deg); }
  7% { transform: translate(3px, 1px) rotate(-1deg); }
  8% { transform: translate(-1px, -1px) rotate(1deg); }
  9% { transform: translate(1px, 2px) rotate(0deg); }
  10% { transform: translate(0px, 0px) rotate(0deg); }
}

.chat--dot {
  position: absolute;
  top: -0.5rem;
  left: -0.5rem;
  @apply bg-green;
  height:1rem;
  width:1rem;
  border-radius: 50%
}

</style>
