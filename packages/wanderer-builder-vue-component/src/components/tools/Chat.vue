
<template>

  <div>

    <portal to="actionbar" :order="1">
      <button class="btn btn-secondary navbar-btn" title="Toggle Chat" v-on:click="$emit('toggle')">
        <icon name="comments"></icon>
      </button>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/comments'
import Icon from 'vue-awesome/components/Icon'

export default {
  components: {
    Icon
  }
}
</script>

<style>

</style>
