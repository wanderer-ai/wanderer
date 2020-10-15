<template>
  <div>

    <div class="form-group">
      <label for="title">Title</label>
      <input v-model="title" type="text" class="form-control" id="title" placeholder="Report Title">
    </div>

    <div class="form-group">
      <label for="text">Text</label>
      <textarea v-model="text" type="text" class="form-control" id="text" placeholder="Report Text"></textarea>
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    title: WandererBuilder.getTranslatableVertexModel('title'),
    text: WandererBuilder.getTranslatableVertexModel('text'),
  }
}
</script>

<style>

</style>
