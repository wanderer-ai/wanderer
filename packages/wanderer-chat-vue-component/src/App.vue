
<template>
  <div class="chat">

    <div class="chat-messages" ref="messages">

      <message
        v-for="(message,key) of messages"
        :key="message.id"
        :id="message.id"
        :from="message.from"
        :delay="message.delay"
        :backgroundColor="message.backgroundColor"
        :show="message.show"
        v-on:messageArrived="messageArrived">
        <component v-bind:is="message.component" :data="message.data" :last="key == messages.length - 1"></component>
      </message>

    </div>
    <div class="chat-controls">

      <div v-if="waitingForMessage">
        Typing ...
      </div>

      <button class="btn btn-secondary" v-on:click="restart">Restart</button>
      <!-- <button class="btn btn-secondary" v-on:click="toggleReport">Report</button> -->

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
      showReport: false
    }
  },
  computed: {
    messageIds: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.messageIds
    },
    messages: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.messages
    },
    vertexCount () {
      return WandererStoreSingleton.store.state.wanderer.vertexDocumentIds.length
    }
  },
  watch: {
    // Lets watch the message ids
    // So we can detect if a new message will income at the stack
    messageIds: function (newObj, oldObj) {

      this.showNextMessage()

      // Set typing timeout
      // this.showTyping = true
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
      WandererStoreSingleton.store.commit('wanderer/cleanVertexLifecycleData')
      WandererSingleton.trigger('reset-chat')
      WandererSingleton.traverse()
    },
    // scrollToBottom () {
    //   var elem = document.getElementById('chat')
    //   if (elem.scrollTop !== (elem.scrollHeight - elem.offsetHeight)) {
    //     elem.scrollBy(0, 2)
    //     setTimeout(this.scrollToBottom, 1)
    //   }
    // },
    showNextMessage () {
      // Check if there is currently a message in que
      // Because we want only wait for one message at a time
      if(!this.waitingForMessage){
        if(this.messages) {
          for (var key in this.messages) {
            // Find the first message that has not been arrived
            if (!this.messages[key].show) {
              // Wait for this message
              this.waitingForMessage = true
              // Show this message
              WandererStoreSingleton.store.commit('wanderer/chat/showMessage', key)
              break;
            }
          }
        }
      }
    },
    messageArrived () {

      // A message delay has endet. So it has been arrived

      // this.showTyping = false

      this.$refs['messages'].scrollTo(0,this.$refs['messages'].scrollHeight)

      // Scroll to bottom
      //this.$refs['messages'].$el.scrollTo(0, this.$refs['messages'].$el.scrollHeight)

      // Now we can show the next message
      // Lets set waitingForMessage to false so this.showNextMessage will be able to show the next
      this.waitingForMessage = false
      this.showNextMessage();

      // var element = document.getElementById('message-'+messageId);
      // if(element){
      //   console.log(scroll);
      //   element.scrollIntoView();
      // }

      // window.location.href = "#message-"+id;
    },
    toggleReport () {

      this.showReport = !this.showReport
      console.log(this.showReport)

    }
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
  padding-bottom:100px; /* For some reason I cannot scroll to the final bottom. A few pixels always left. So I added a padding. So the message should always be visible */
}
.chat-controls{
  flex:0 0 100px;
  padding:20px;
}
</style>
