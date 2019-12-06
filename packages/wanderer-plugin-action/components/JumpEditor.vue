<template>
  <div>

    <div class="form-group">
      <label for="label">Label</label>
      <input v-model="label" type="text" class="form-control" id="label" placeholder="Continue here">
    </div>

    <div class="form-group">
      <label for="url">Jump URL</label>
      <input v-model="url" type="text" class="form-control" id="url" placeholder="https://">
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    url: WandererBuilder.getVertexModel('url'),
    label: WandererBuilder.getTranslatableVertexModel('label')
  }
}
</script>

<style>

</style>
