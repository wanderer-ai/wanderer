<template>

  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/5">
      <label class="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4" :for="_uid">
        {{label}}
      </label>
    </div>
    <div class="md:w-4/5">
      <input v-model="inputVal" :id="_uid" type="checkbox" class="py-2 px-4 leading-tight focus:outline-none focus:bg-white border-2 border-white focus:border-blue">
    </div>
  </div>

</template>

<script>

export default {
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


</style>
