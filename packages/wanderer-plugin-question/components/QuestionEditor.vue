<template>
  <div>

    <div class="form-group">
      <label for="label">Question</label>
      <input v-model="question" type="text" class="form-control" id="label" placeholder="Enter your question">
    </div>

    <!-- <div class="form-group">
      <label for="button">Button</label>
      <input v-model="button" type="text" class="form-control" id="button" placeholder="The button text">
    </div> -->

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'
// import StoreSingleton from 'wanderer-store-singleton'

export default {
  computed: {
    question: WandererBuilder.getTranslatableVertexModel('question'),
    // button: WandererBuilder.getTranslatableVertexModel('button'),
    // id: WandererBuilder.getVertexModel('_id'),
  }
}
</script>

<style>

</style>
