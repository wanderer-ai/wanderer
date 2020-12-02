<template>

  <button @click="$emit('click')" :class="'button button-'+size+' bg-'+color+' rounded text-'+textColor">
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

.button {
  min-width:2.5rem;
}

.button + .button {
  @apply ml-2;
}

.button-normal {
  @apply p-2 px-3 text-base;
}

.button-small {
  @apply p-1 px-2 text-sm;
}

</style>
