<template>
  <div>

    <div class="form-group">
      <label for="topic">Action Message</label>
      <input v-model="message" type="text" class="form-control" id="message" placeholder="">
    </div>

    <div class="form-group">
      <label for="compareVariable">Type</label>
      <select id="type" class="form-control" v-model="type">
        <option value="link">Link</option>
      </select>
    </div>

    <div class="form-group">
      <label for="link">Link</label>
      <input v-model="conclusion" type="text" class="form-control" id="link" placeholder="https://">
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    message: WandererBuilder.getTranslatableVertexModel('message'),
    type: WandererBuilder.getVertexModel('type'),
    conclusion: WandererBuilder.getVertexModel('link')
  }
}
</script>

<style>

</style>
