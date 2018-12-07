<template>
  <div>

    <div class="form-group">
      <label for="label">Suggestion</label>
      <input v-model="suggestion" type="text" class="form-control" id="label" placeholder="Enter your suggestion">
    </div>
    {{suggestion}}

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'
// import StoreSingleton from 'wanderer-store-singleton'

export default {
  computed: {
    suggestion: WandererBuilder.getTranslatableVertexModel('suggestion')
  }
}
</script>

<style>

</style>
