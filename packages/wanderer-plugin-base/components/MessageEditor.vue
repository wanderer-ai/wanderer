<template>
  <div>

    <div class="form-group">
      <label for="message">Message</label>
      <input v-model="message" type="text" class="form-control" id="message" placeholder="Enter your message">
    </div>

  </div>
</template>

<script>

import WandererBuilderSingleton from 'wanderer-builder-singleton'
// import StoreSingleton from 'wanderer-store-singleton'

export default {
  computed: {
    message: WandererBuilderSingleton.getTranslatableVertexModel('message')
  }
}
</script>

<style>

</style>
