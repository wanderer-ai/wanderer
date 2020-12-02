
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
          <span class="circle bouncing"></span>
          <span class="circle bouncing"></span>
          <span class="circle bouncing"></span>
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
  bottom: -1rem;
  border-left: 1rem solid transparent;
  border-right: 2px solid transparent;
  border-top: 1rem solid theme('colors.blue');
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
  @apply flex-grow;
  overflow-y: auto;
}

.chat--messages {
  @apply p-2;
}

.chat--navigation {
  @apply bg-blue p-4 text-white;
}

.chat--typing {
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
