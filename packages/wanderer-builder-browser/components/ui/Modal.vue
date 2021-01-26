<template>

  <div v-if="showModal" class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">

    <div class="modal--overlay absolute w-full h-full bg-gray-dark opacity-50" @click="close()"></div>

    <div :class="'modal--container modal--container-'+size+' bg-gray mx-auto rounded shadow-lg z-40 overflow-y-auto'">

      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="modal--content text-left">

        <!--Title-->
        <div v-if="showHeader" class="px-6 pt-3 flex justify-between items-center">
          <p class="text-2xl font-bold" v-if="title">{{title}}</p>
          <div v-if="showClose" class="pl-4 modal--close cursor-pointer z-50" @click="close()">
            <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </div>
        </div>

        <!--Body-->
        <div class="px-6 py-6">
          <slot>

          </slot>
        </div>

        <!--Footer-->
        <div class="flex justify-between px-6 pb-3" v-if="showFooter">
          <div>
            <slot name="buttons">

            </slot>
          </div>
          <div>
            <builder-button class="modal--close" size="small" color="gray-dark" v-if="showClose" @click="close()">Close</builder-button>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'auto'
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
  },
  methods: {
    close() {
      if(this.showClose) {
        this.$emit('closeButton')
      }
    }
  }
}

</script>

<style>

.modal--container {
  max-width:100vw;
  max-height: 100vh;
}

@screen lg {
  .modal--container {
    max-width:50%;
  }

  .modal--container-lg {
    min-width: 50%;
    max-width:100%;
  }
}

</style>
