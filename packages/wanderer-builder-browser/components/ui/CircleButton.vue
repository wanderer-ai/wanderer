<template>

  <button @click="$emit('click')" :class="'circle--button bg-'+color+' text-'+textColor">
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

.circle--button {
  @apply p-4;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  align-content: center;
  width:150px;
}

.circle--button:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

</style>
