<template>
  <div>

    <div class="form-group">
      <label for="label">Section</label>
      <input v-model="title" type="text" class="form-control" id="label" placeholder="Enter section title">
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'
// import StoreSingleton from 'wanderer-store-singleton'

export default {
  computed: {
    title: WandererBuilder.getTranslatableVertexModel('title'),
    // id: WandererBuilder.getVertexModel('_id'),
  }
}
</script>

<style>

</style>
