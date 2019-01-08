<template>

  <transition name="fade">

    <div>
      <div
        class="bubble"
        v-bind:class="{
          'bubble--local': from=='local',
          'bubble--remote': from=='remote'
        }">

        <slot>

        </slot>

      </div>

      <div class="clearfix"></div>

    </div>

    <div v-if="!showMessage">
      Typing ...
    </div>

  </transition>
</template>

<script>

  export default {
    props: {
      from: {
        default: 'remote',
        type: String
      },
      delay: {
        default: 1000,
        type: Number
      }
    },
    data: function () {
      return {
        showMessage: false
      }
    },
    mounted() {

      setTimeout(() => {
        this.showMessage = true;
        // this.$store.commit('chat/setTyping',false)
      }, this.delay)

    }
  }

</script>

<style>

  .bubble{
    display: inline-block;
    width:auto;
    position: relative;
    background: #ccc;
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
  .bubble:after{
    content: '';
    position: absolute;
    /*top: 50%;*/
    bottom: 0;
  	width: 0;
  	height: 0;
    border: 20px solid transparent;
    border-bottom: 0;
    margin-top: -10px;
  }

  .bubble--remote:after{
    left: 0;
    margin-left: -20px;
    border-right-color: #ccc;
    border-left: 0;
  }

  .bubble--local:after{
  	right: 0;
  	margin-right: -20px;
    border-left-color: #ccc;
	  border-right: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>
