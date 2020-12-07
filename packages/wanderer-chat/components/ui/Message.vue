<template>

  <div class="message">

    <div
      class="message--bubble"
      v-bind:class="{
        'message--bubble-local': from=='local',
        'message--bubble-remote': from=='remote'
      }">

      <slot>

      </slot>

    </div>

  </div>

</template>

<script>

export default {
  props: {
    from: {
      default: 'remote',
      type: String
    }
  }
}

</script>

<style>

  .message {
    width:100%;
    display: flex;
    flex-direction: column;
  }

  .message--bubble {
    @apply bg-gray-dark p-2 text-white text-sm mb-2;
    display: inline-block;
    width:auto;
    position: relative;
  }

  .message--bubble-local {
    border-radius: 0.5rem 0.5rem 0 0.5rem;
    align-self: flex-end;
  }

  .message--bubble-remote {
    border-radius: 0.5rem 0.5rem 0.5rem 0;
    align-self: flex-start;
  }

</style>
