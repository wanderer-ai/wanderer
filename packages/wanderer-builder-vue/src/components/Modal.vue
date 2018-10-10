<template>

  <transition name="modal">
    <div class="modal-mask" v-if="showModal">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            {{title}}
          </div>

          <div class="modal-body">

            <slot>

            </slot>

          </div>

          <div class="modal-footer">

            <div class="btn-group">

              <slot name="buttons">

              </slot>

              <button v-if="showClose" class="btn btn-secondary modal-default-button" @click="$emit('closeButton')">
                Close
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: 'Modal window'
    },
    show: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showModal: this.show
    }
  },
  watch: {
    show: function (newValue, oldValue) {
      this.showModal = newValue
    }
  }
}

</script>

<style>

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 800px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

</style>
