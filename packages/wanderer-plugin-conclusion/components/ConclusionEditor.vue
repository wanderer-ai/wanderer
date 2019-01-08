<template>
  <div>

    <div class="form-group">
      <label for="label">Conclusion</label>
      <input v-model="conclusion" type="text" class="form-control" id="label" placeholder="Conclusion">
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    conclusion: WandererBuilder.getTranslatableVertexModel('conclusion')
  }
}
</script>

<style>

</style>
