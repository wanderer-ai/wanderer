<template>

  <div class="wanderer-chat__content">
    <slot></slot>
  </div>

</template>

<script>

export default {

}

</script>

<style>

.wanderer-chat__content p {
  @apply mb-2;
}

.wanderer-chat__content p:last-child {
  @apply mb-0;
}

.wanderer-chat__content a {
  @apply underline;
}

.wanderer-chat__content strong {
  @apply font-bold;
}

.wanderer-chat__content ul, .chat__content ol {
  @apply ml-4;
}

.wanderer-chat__content ul li {
  list-style: disc;
}

.wanderer-chat__content ol li {
  list-style: decimal;
}

.wanderer-chat__content h1 {
  @apply text-2xl;
}

.wanderer-chat__content h2 {
  @apply text-xl;
}

.wanderer-chat__content h3 {
  @apply text-lg;
}

.wanderer-chat__content h4 {
  @apply text-base;
}

.wanderer-chat__content h5 {
  @apply text-sm;
}

.wanderer-chat__content h6 {
  @apply text-xs;
}

</style>
