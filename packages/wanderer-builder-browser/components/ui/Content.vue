<template>

  <div class="builder--content">
    <slot></slot>
  </div>

</template>

<script>

export default {

}

</script>

<style>

.builder--content p {
  @apply mb-4;
}

.builder--content a {
  @apply underline;
}

.builder--content strong {
  @apply font-bold;
}

</style>
