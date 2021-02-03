
<template>

  <div class="wanderer-chat__container" v-if="vertexCount">

    <div v-if="!isVisible" class="wanderer-chat__opener">
      <div class="wanderer-chat__opener-button" @click="show()" :class="(actionRequired?'wanderer-chat__shake':'')">
        <icon name="robot" scale="2"></icon>
      </div>
    </div>

    <div v-if="isVisible" class="wanderer-chat__panel" @click="focus()">

      <div class="wanderer-chat__stack">

        <div class="wanderer-chat__header">
          <div class="wanderer-chat__avatar">
            <icon name="robot" scale="2"></icon>
          </div>

          <div class="wanderer-chat__title">
            {{name}}
          </div>

          <div class="wanderer-chat__controls">
            <div class="wanderer-chat__controls-icon wanderer-chat__restart" @click="restart()">
              <icon name="sync"></icon>
            </div>
            <div class="wanderer-chat__controls-icon wanderer-chat__close" @click="hide()">
              <icon name="times"></icon>
            </div>
          </div>

        </div>

        <div class="wanderer-chat__body" ref="chatbody">

          <div class="wanderer-chat__messages">
            <div
              v-for="(messageId, key) in messages"
              :key="key">
              <component v-bind:is="getMessageComponentByMessageId(messageId)" :messageId="messageId" ></component>
            </div>
          </div>

          <div class="wanderer-chat__typing" v-if="typing">
            <span class="wanderer-chat__typing-circle"></span>
            <span class="wanderer-chat__typing-circle"></span>
            <span class="wanderer-chat__typing-circle"></span>
          </div>

          <div class="wanderer-chat__interactions">
            <div
              v-for="(vertexId, key) in interactions"
              :key="key">
              <component v-if="!isInteractionInsideNavigation(vertexId)" v-bind:is="getInteractionComponentByVertexId(vertexId)" :vertexId="vertexId"></component>
            </div>
          </div>

          <div class="wanderer-chat__spacer"></div>

        </div>

        <div class="wanderer-chat__navigation">
          <div
            v-for="(vertexId, key) in interactions"
            :key="key">
            <component v-if="isInteractionInsideNavigation(vertexId)" v-bind:is="getInteractionComponentByVertexId(vertexId)" :vertexId="vertexId"></component>
          </div>
        </div>

      </div>

    </div>

    <div class="wanderer-chat__indicator" v-if="actionRequired"></div>

  </div>
</template>

<script>

import 'vue-awesome/icons/sync'
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/robot'
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

.wanderer-chat__container {
  @apply fixed right-0 bottom-0 z-50;
}

.wanderer-chat__opener {
  @apply p-4;
}

.wanderer-chat__opener-button {
  @apply relative bg-blue p-4 shadow-lg text-white;
  cursor:pointer;
}

.wanderer-chat__opener-button:after {
  @apply absolute block w-0 h-0;
  content: "";
  right: 2rem;
  bottom: -0.5rem;
  border-left: 0.5rem solid transparent;
  border-right: 2px solid transparent;
  border-top: 0.5rem solid theme('colors.blue');
}

.wanderer-chat__panel {
  width:400px;
  height:700px;
  max-height:100vh;
  max-width:100vw;
  @apply overflow-hidden p-4;
}

.wanderer-chat__stack {
  @apply shadow-lg h-full flex items-stretch flex-col shadow-md;
}

.wanderer-chat__header {
  @apply flex justify-between items-center bg-blue p-4 text-white;
}

.wanderer-chat__avatar {

}

.wanderer-chat__title {
  @apply flex-grow font-bold px-2;
}

.wanderer-chat__controls {
  @apply -m-2 flex justify-between;
}

.wanderer-chat__controls-icon {
  @apply m-2;
}

.wanderer-chat__restart {
  @apply cursor-pointer;
}

.wanderer-chat__close {
  @apply cursor-pointer;
}

.wanderer-chat__body {
  @apply flex-grow bg-gray p-4;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.wanderer-chat__messages {

}

.wanderer-chat__spacer {
  @apply pb-12;
}

.wanderer-chat__navigation {
  @apply bg-blue p-4 text-white;
}

.wanderer-chat__typing {
  @apply flex mb-2 mt-4;
}

.wanderer-chat__typing-circle {
  @apply bg-gray-dark;
  display: block;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin: 2px;
  animation: wanderer-chat__typing-bounce 600ms ease-in-out infinite;
}

.wanderer-chat__typing-circle:nth-child(1) {
  animation-delay: 0ms;
}

.wanderer-chat__typing-circle:nth-child(2) {
  animation-delay: 200ms
}

.wanderer-chat__typing-circle:nth-child(3) {
  animation-delay: 400ms
}

@keyframes wanderer-chat__typing-bounce {
  0% { transform: translateY(0); }
  33% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.wanderer-chat__shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: wanderer-chat__shake 5s;

  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes wanderer-chat__shake {
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

.wanderer-chat__indicator {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  @apply bg-green;
  height:1rem;
  width:1rem;
  border-radius: 50%
}

</style>
