<template>
  <div>

    <div class="form-group">
      <label for="topic">Topic</label>
      <input v-model="topic" type="text" class="form-control" id="topic" placeholder="Enter your topic name">
    </div>

    <!-- <div class="form-group">
      <label for="onboarding">Onboarding</label>
      <input v-model="onboarding" type="text" class="form-control" id="onboarding" placeholder="Onboarding">
    </div>

    <div class="form-group">
      <label for="offboarding">Offboarding</label>
      <input v-model="offboarding" type="text" class="form-control" id="offboarding" placeholder="Offboarding">
    </div> -->

    <div class="form-group">
      <label for="author">Author</label>
      <input v-model="author" type="text" class="form-control" id="author" placeholder="Author">
    </div>

    <div class="form-group">
      <label for="license">License</label>
      <input v-model="license" type="text" class="form-control" id="license" placeholder="License">
    </div>

  </div>
</template>

<script>

import WandererBuilderSingleton from 'wanderer-builder-singleton'
// import StoreSingleton from 'wanderer-store-singleton'

export default {
  computed: {
    topic: WandererBuilderSingleton.getTranslatableVertexModel('topic'),
    // onboarding: WandererBuilderSingleton.getTranslatableVertexModel('onboarding'),
    // offboarding: WandererBuilderSingleton.getTranslatableVertexModel('offboarding'),
    author: WandererBuilderSingleton.getVertexModel('author'),
    license: WandererBuilderSingleton.getVertexModel('license'),
  }
}
</script>

<style>

</style>
