<template>

  <button @click="$emit('click')" :class="'chat--button chat--button-'+size+' chat--button-'+theme">
    <slot></slot>
  </button>

</template>

<script>

export default {
  props: {
    theme: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'normal'
    }
  }
}

</script>

<style>

.chat--button {
  @apply rounded flex-grow;
}

.chat--button-normal {
  @apply text-sm p-2;
  min-width: 2.5rem;
}

.chat--button-small {
  @apply text-xs p-1;
  min-width: 1.5rem;
}

.chat--button-primary {
  @apply bg-blue text-white;
}

.chat--button-secondary {
  @apply bg-gray text-black;
}

</style>
