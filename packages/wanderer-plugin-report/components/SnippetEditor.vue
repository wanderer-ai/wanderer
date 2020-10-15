<template>
  <div>

    <div class="form-group">
      <label for="text">Text</label>
      <textarea v-model="text" type="text" class="form-control" id="text" placeholder="Snippet Text"></textarea>
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    text: WandererBuilder.getTranslatableVertexModel('text')
  }
}
</script>

<style>

</style>
