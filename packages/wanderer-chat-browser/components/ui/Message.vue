<template>

  <div class="chat--message">

    <div
      class="chat--message-bubble"
      v-bind:class="{
        'chat--message-spawn': spawn,
        'chat--message-bubble-local': from=='local',
        'chat--message-bubble-remote': from=='remote'
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

  .chat--message {
    width:100%;
    display: flex;
    flex-direction: column;
  }

  .chat--message-bubble {
    @apply bg-gray-dark p-2 text-white text-sm mb-2;
    display: inline-block;
    width:auto;
    position: relative;
  }

  .chat--message-spawn {
    animation: message-spawn .25s;
  }

  @keyframes message-spawn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  .chat--message-bubble-local {
    border-radius: 0.5rem 0.5rem 0 0.5rem;
    align-self: flex-end;
  }

  .chat--message-bubble-remote {
    border-radius: 0.5rem 0.5rem 0.5rem 0;
    align-self: flex-start;
  }

</style>
