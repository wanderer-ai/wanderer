<template>

  <button @click="$emit('click')" :class="'wanderer-chat__button wanderer-chat__button-'+size+' wanderer-chat__button-'+theme">
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

.wanderer-chat__button {
  @apply rounded flex-grow;
}

.wanderer-chat__button-normal {
  @apply text-sm p-2;
  min-width: 2.5rem;
}

.wanderer-chat__button-small {
  @apply text-xs p-1;
  min-width: 1.5rem;
}

.wanderer-chat__button-primary {
  @apply bg-blue text-white;
}

.wanderer-chat__button-secondary {
  @apply bg-gray text-black;
}

</style>
