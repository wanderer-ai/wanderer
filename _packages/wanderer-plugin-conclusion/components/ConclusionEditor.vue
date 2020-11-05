<template>
  <div>

    <div class="form-group">
      <label for="label">Conclusion</label>
      <input v-model="label" type="text" class="form-control" id="label" placeholder="Label">
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    label: WandererBuilder.getVertexModel('label')
  }
}
</script>

<style>

</style>
