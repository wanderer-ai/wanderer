<template>

  <div class="wanderer-report-panel">

    Report

    <div
      v-for="(message,key) of messages"
      :key="message.id"
      :id="message.id">
      <div>{{message}}</div>
    </div>

  </div>

</template>

<script>

// import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {
  computed: {
    messageIds: function () {
      return WandererStoreSingleton.store.state.wanderer.chat.messageIds
    },
    messages: function () {
      var conclusionMessages = []
      for (var key in WandererStoreSingleton.store.state.wanderer.chat.messages) {
        if (WandererStoreSingleton.store.state.wanderer.chat.messages.hasOwnProperty(key)) {
          if (WandererStoreSingleton.store.state.wanderer.chat.messages[key].component=='wanderer-conclusion-message') {
            var vertexId = WandererStoreSingleton.store.state.wanderer.chat.messages[key].data.vertexId
            var language = WandererStoreSingleton.store.state.wanderer.currentLanguage
            conclusionMessages.push(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId].conclusion[language])
          }
        }
      }
      return conclusionMessages
    }
  }
}

</script>

<style>

.wanderer-report-panel {
  position:absolute;
  bottom:100px;
  left:0;
  width:100%;
  background:white;
  padding:16px;
}

</style>
