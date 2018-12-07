<template>
  <transition>
    <div class="chat-panel" v-if="showPanel">

      <button class="btn btn-secondary modal-default-button" @click="$emit('closeButton')">
        Close
      </button>

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
  width:25%;
  height:100%;
  width: 800px;
  padding: 100px 30px 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

</style>
