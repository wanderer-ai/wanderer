<template>

  <button @click="$emit('click')" :class="'px-4 bg-'+color+' p-3 rounded text-'+textColor">
    <slot></slot>
  </button>

</template>

<script>

export default {
  props: {
    color: {
      type: String,
      default: 'blue'
    },
    textColor: {
      type: String,
      default: 'white'
    }
  }
}

</script>

<style>


</style>
