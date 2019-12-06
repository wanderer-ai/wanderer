<template>
  <div>

    <div class="form-group">
      <label for="label">Label</label>
      <input v-model="label" type="text" class="form-control" id="label" placeholder="Label">
    </div>

    <div class="form-group">
      <label for="link">Link</label>
      <input v-model="link" type="text" class="form-control" id="link" placeholder="https://">
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    label: WandererBuilder.getTranslatableVertexModel('label'),
    link: WandererBuilder.getTranslatableVertexModel('link'),
  }
}
</script>

<style>

</style>
