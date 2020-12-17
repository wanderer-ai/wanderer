<template>

  <div class="builder--checkbox flex mb-6 w-1/4 items-start">

    <div class="w-1/5">

      <label class="builder--checkicon">
        <icon name="check" v-if="inputVal"></icon>
        <input v-model="inputVal" :id="_uid" type="checkbox" class="py-2 px-4 leading-tight focus:outline-none focus:bg-white border-2 border-white focus:border-blue">
      </label>

    </div>

    <div class="w-4/5 pl-2 pr-2">

      <label class="block text-gray-500 text-left mb-1 md:mb-0 pr-2" :for="_uid">
        {{label}}
      </label>

    </div>

  </div>

</template>

<script>

import 'vue-awesome/icons/check'
import Icon from 'vue-awesome/components/Icon'

export default {
  components: {
    Icon
  },
  props: {
    value: {
      type: Boolean,
    },
    label: {
      type: String,
      default: 'Input'
    }
  },
  computed: {
    inputVal: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}

</script>

<style>

.builder--checkicon {
  @apply bg-white border-black border-2 flex items-center justify-center cursor-pointer;
  height: 2rem;
  width: 2rem;
}

.builder--checkicon input {
  display: none;
}

</style>
