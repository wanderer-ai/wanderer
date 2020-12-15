<template>

  <div class="builder--checkbox-group flex flex-wrap">

    <div class="md:w-1/5">

    </div>
    <div class="md:w-4/5 flex flex-wrap">

      <slot></slot>

    </div>

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

.builder--checkbox-group {
  @apply -m-1;
}

.builder--checkbox-group .builder--checkbox{
  @apply m-1;
}

</style>
