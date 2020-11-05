<template>
  <transition>

    <div class="chat-panel" v-if="showPanel">
      <wanderer-chat />
    </div>

  </transition>
</template>

<script>

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

.chat-panel {
  position:absolute;
  top:0px;
  left:0px;
  height: 100%;
  width:500px;
  font-family: Helvetica, Arial, sans-serif;
  z-index: 9997;

  background-color: rgba(248, 249, 250, 0.5);
}

</style>
