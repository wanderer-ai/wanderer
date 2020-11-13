<template>

  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/5">
      <label class="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4" :for="_uid">
        {{label}}
      </label>
    </div>
    <div class="md:w-4/5">
      <select v-model="inputVal" class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
        <option v-for="label, key in options" :value="key">{{label}}</option>
      </select>
    </div>
  </div>

</template>

<script>

export default {
  props: {
    value: {
      type: String,
    },
    options: {
      type: Object,
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


</style>
