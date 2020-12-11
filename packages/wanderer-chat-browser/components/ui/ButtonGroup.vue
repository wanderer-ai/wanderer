<template>

  <div class="chat--button-group">
    <slot></slot>
  </div>

</template>

<script>

export default {
  props: {
    // color: {
    //   type: String,
    //   default: 'blue'
    // }
  }
}

</script>

<style>

.chat--button-group {
  @apply -mx-1 -my-1 flex flex-wrap items-stretch;
}

.chat--button-group .chat--button{
  @apply mx-1;
  @apply my-1;
}

</style>
