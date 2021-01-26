
<template>

  <div class="chat--container" v-if="vertexCount">

    <div v-if="!isVisible" class="chat--opener">
      <div class="chat--opener-button" @click="show()" :class="(actionRequired?'chat--shake':'')">
        {{openLabel}}
      </div>
    </div>

    <div v-if="isVisible" class="chat--panel" @click="focus()">

      <div class="chat--stack">

        <div class="chat--header">
          <div class="chat--title">
            {{name}}
          </div>

          <div class="chat--controls">
            <div class="chat--controls-icon chat--restart" @click="restart()">
              <icon name="sync"></icon>
            </div>
            <div class="chat--controls-icon chat--close" @click="hide()">
              <icon name="times"></icon>
            </div>
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

          <div class="chat--spacer"></div>

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

    <div class="chat--indicator" v-if="actionRequired"></div>

  </div>
</template>

<script>

import 'vue-awesome/icons/sync'
import 'vue-awesome/icons/times'
import Icon from 'vue-awesome/components/Icon'

var interactionsCount = 0;

export default {
  components: {
    Icon
  },
  props: {
    flowUrl: {
      type: String,
      default: ''
    },
    openLabel: {
      type: String,
      default: 'Open Chat'
    },
  },
  mounted: function() {
    if(this.flowUrl != '') {
      this.$wanderer.loadFromUrl(this.flowUrl)
    }
  },
  data: function () {
    return {
      scrollTimeout: false,
      actionRequired: false
    }
  },
  computed: {
    isVisible () {
      return this.$store.state.wandererChat.isVisible
    },
    vertexCount () {
      return this.$store.state.wandererGraph.vertexDocumentIds.length
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
    messages: function () {
      this.scrollToBottom()
      if(this.messages.length) {
        this.actionRequired = true
      }
    },
    interactions: function () {
      // This object will be completely overidden on every cycle. So lets watch the length only.
      if(interactionsCount!=this.interactions.length) {
        interactionsCount = this.interactions.length
        this.scrollToBottom()
        this.actionRequired = true
      }
    },
    typing: function (newObj) {
      if(newObj) {
        this.scrollToBottom()
      }
    }
  },
  methods: {
    show () {
      this.$store.commit('wandererChat/setVisible', true)
      this.actionRequired = false
    },
    hide () {
      this.$store.commit('wandererChat/setVisible', false)
    },
    focus () {
      this.unreadMessages = false
      this.actionRequired = false
    },
    restart () {
      this.$wanderer.subscriber.emit('resetLifecycle')
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
  @apply fixed right-0 bottom-0 z-50;
}

.chat--opener {
  @apply p-4;
}

.chat--opener-button {
  @apply relative bg-blue p-4 shadow-lg text-white;
  cursor:pointer;
}

.chat--opener-button:after {
  @apply absolute block w-0 h-0;
  content: "";
  right: 2rem;
  bottom: -0.5rem;
  border-left: 0.5rem solid transparent;
  border-right: 2px solid transparent;
  border-top: 0.5rem solid theme('colors.blue');
}

.chat--panel {
  width:400px;
  height:700px;
  max-height:100vh;
  max-width:100vw;
  @apply overflow-hidden p-4;
}

.chat--stack {
  @apply shadow-lg h-full flex items-stretch flex-col shadow-md;
}

.chat--header {
  @apply flex justify-between bg-blue p-4 text-white;
}

.chat--title {
  @apply font-bold;
}

.chat--controls {
  @apply -m-2 flex justify-between;
}

.chat--controls-icon {
  @apply m-2;
}

.chat--restart {
  @apply cursor-pointer;
}

.chat--close {
  @apply cursor-pointer;
}

.chat--body {
  @apply flex-grow bg-gray p-4;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.chat--messages {

}

.chat--spacer {
  @apply pb-12;
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

.chat--indicator {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  @apply bg-green;
  height:1rem;
  width:1rem;
  border-radius: 50%
}

</style>
