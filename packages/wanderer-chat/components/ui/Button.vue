<template>

  <button @click="$emit('click')" :class="'chat--button bg-'+color+' text-'+textColor">
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

.chat--button {
  @apply rounded p-2 flex-grow;
  min-width:2.5rem;
}

</style>
