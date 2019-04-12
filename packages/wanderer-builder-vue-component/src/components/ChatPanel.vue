<template>
  <transition>

    <div>

      <div class="chat-background" v-if="showPanel">

      </div>

      <div class="chat-panel" v-if="showPanel">
        <wanderer-chat />
      </div>

    </div>

  </transition>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPanel: this.show
    }
  },
  watch: {
    show: function (newValue, oldValue) {
      this.showPanel = newValue
    }
  }
}

</script>

<style>

.chat-background {
  height: 100vh;
  width:500px;
  position: fixed;
  background-color:#efefefef;
}

.chat-panel {
  padding-top:70px;
  height: 100vh;
  width:500px;
  font-family: Helvetica, Arial, sans-serif;
}

</style>
