<template>

  <button @click="$emit('click')" :class="'builder-button builder-button-'+size+' bg-'+color+' rounded flex justify-center items-center text-center text-'+textColor">
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
    },
    size: {
      type: String,
      default: 'normal'
    }
  }
}

</script>

<style>

.builder-button {
  min-width:2.5rem;
}

.builder-button-normal {
  @apply p-2 px-3 text-base;
}

.builder-button-small {
  @apply p-1 px-2 text-sm;
}

</style>
