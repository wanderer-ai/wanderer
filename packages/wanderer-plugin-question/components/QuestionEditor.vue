<template>
  <div>

    <div class="form-group">
      <label for="label">Question</label>
      <input v-model="question" type="text" class="form-control" id="label" placeholder="Enter your question">
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'
// import StoreSingleton from 'wanderer-store-singleton'

export default {
  computed: {
    question: WandererBuilder.getTranslatableVertexModel('question'),
    // id: WandererBuilder.getVertexModel('_id'),
  }
}
</script>

<style>

</style>
