<template>
  <div>

    <div class="form-group">
      <label for="seconds">Seconds</label>
      <input v-model="seconds" type="number" class="form-control" id="seconds" placeholder="10">
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    seconds: WandererBuilder.getVertexModel('seconds')
  }
}
</script>

<style>

</style>
