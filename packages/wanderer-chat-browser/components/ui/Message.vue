<template>

  <div class="wanderer-chat__message">

    <div
      class="wanderer-chat__message-bubble"
      v-bind:class="{
        'wanderer-chat__message-spawn': spawn,
        'wanderer-chat__message-bubble-local': from=='local',
        'wanderer-chat__message-bubble-remote': from=='remote'
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
    },
    spawn: {
      default: true,
      type: Boolean
    }
  }
}

</script>

<style>

  .wanderer-chat__message {
    width:100%;
    display: flex;
    flex-direction: column;
  }

  .wanderer-chat__message-bubble {
    @apply bg-gray-dark p-2 text-white text-sm mb-2;
    display: inline-block;
    width:auto;
    position: relative;
  }

  .wanderer-chat__message-spawn {
    animation: wanderer-message-spawn .25s;
  }

  @keyframes wanderer-message-spawn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  .wanderer-chat__message-bubble-local {
    border-radius: 0.5rem 0.5rem 0 0.5rem;
    align-self: flex-end;
  }

  .wanderer-chat__message-bubble-remote {
    border-radius: 0.5rem 0.5rem 0.5rem 0;
    align-self: flex-start;
  }

</style>
