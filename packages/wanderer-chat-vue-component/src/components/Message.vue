<template>

  <div v-if="showMessage">

    <div
      :id="'message-'+id"
      class="bubble"
      v-bind:class="{
        'bubble--local': from=='local',
        'bubble--remote': from=='remote'
      }"
      v-bind:style="{backgroundColor: backgroundColor}">

      <slot>

      </slot>

      <div
        class="triangle"
        v-bind:class="{
          'triangle--local': from=='local',
          'triangle--remote': from=='remote'
        }"
        v-bind:style="[
          from=='remote' ? {borderRightColor: backgroundColor} : {borderLeftColor: backgroundColor}
        ]">
      </div>

    </div>

    <div class="clearfix"></div>

  </div>

</template>

<script>

export default {
  props: {
    id: {
      default: '',
      type: String
    },
    from: {
      default: 'remote',
      type: String
    },
    delay: {
      default: 1000,
      type: Number
    },
    backgroundColor: {
      default: '#cccccc',
      type: String
    },
    show: {
      default: false,
      type: Boolean
    }
  },
  data: function () {
    return {
      showMessage: false
    }
  },
  watch: {
    show: {
      handler: function (show) {

        // The show prop has changed
        if (show) {

          // Start a delay to show the message
          setTimeout(() => {
            this.showMessage = true
            // Emit an event to my parent so the next message can be shown
            this.$emit('messageArrived')
          }, this.delay)
        }
      },
      immediate: true,
    }
  }
}

</script>

<style>

  .bubble{
    display: inline-block;
    width:auto;
    position: relative;
    padding:15px;
    color:#fff;
    font-size:20px;
    margin-bottom:25px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .bubble--remote{
    border-radius: 15px 15px 15px 0;
  }

  .bubble--local{
    border-radius: 15px 15px 0 15px;
    float:right;
  }

  /*
    Bubble triangle
  */
  .triangle{
    position: absolute;
    /*top: 50%;*/
    bottom: 0;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-bottom: 0;
    margin-top: -10px;
  }

  .triangle--remote{
    left: 0;
    margin-left: -20px;
    border-left: 0;
  }

  .triangle--local{
    right: 0;
    margin-right: -20px;
    border-right: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>
