<template>

  <div class="builder--button-group flex flex-wrap">
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

.builder--button-group {
  @apply -m-1;
}

.builder--button-group .builder--button{
  @apply m-1;
}

</style>
