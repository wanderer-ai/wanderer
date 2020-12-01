
<template>
  <div class="fixed right-0 bottom-0 m-4 z-40">

    <div class="bg-blue p-4" v-if="!show" v-on:click="show=true">
      Open Chat
    </div>

    <div v-if="show" class="" ref="messages">

      Chat

      <div>
        <div
          v-for="(vertexId, key) in messages"
          :key="key">
          <component v-bind:is="getMessageComponentByVertexId(vertexId)" :vertexId="vertexId"></component>
        </div>
      </div>

      <div class="typing" v-if="typing">
        <span class="circle bouncing"></span>
        <span class="circle bouncing"></span>
        <span class="circle bouncing"></span>
      </div>

      <div>
        <chat-message
          v-for="(vertexId, key) in interactions"
          :key="key">
          <component class="" v-bind:is="getInteractionComponentByVertexId(vertexId)" :vertexId="vertexId"></component>
        </chat-message>
      </div>

    </div>

    <!-- <div v-if="interactions.length" class="chat--navigation">
      <div
        v-if="interaction.showInNavigation"
        v-for="(interaction,key) of interactions"
        :key="interaction.vertexId"
        :id="interaction.vertexId">
        <component class="mb-2" v-bind:is="interaction.component" :vertexId="interaction.vertexId"></component>
      </div>
    </div> -->

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
    // messageIds: function () {
    //   return this.$store.state.wandererChat.messageIds
    // },
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
