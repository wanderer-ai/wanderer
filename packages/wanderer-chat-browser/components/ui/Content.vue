<template>

  <div class="chat--content">
    <slot></slot>
  </div>

</template>

<script>

export default {

}

</script>

<style>

.chat--content p {
  @apply mb-2;
}

.chat--content p:last-child {
  @apply mb-0;
}

.chat--content a {
  @apply underline;
}

.chat--content strong {
  @apply font-bold;
}

.chat--content ul, .chat--content ol {
  @apply ml-4;
}

.chat--content ul li {
  list-style: disc;
}

.chat--content ol li {
  list-style: decimal;
}

.chat--content h1 {
  @apply text-2xl;
}

.chat--content h2 {
  @apply text-xl;
}

.chat--content h3 {
  @apply text-lg;
}

.chat--content h4 {
  @apply text-base;
}

.chat--content h5 {
  @apply text-sm;
}

.chat--content h6 {
  @apply text-xs;
}

</style>
