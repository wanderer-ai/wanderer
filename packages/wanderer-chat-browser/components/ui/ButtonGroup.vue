<template>

  <div class="wanderer-chat__button-group">
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

.wanderer-chat__button-group {
  @apply -mx-1 -my-1 flex flex-wrap items-stretch;
}

.wanderer-chat__button-group .wanderer-chat__button{
  @apply mx-1;
  @apply my-1;
}

</style>
