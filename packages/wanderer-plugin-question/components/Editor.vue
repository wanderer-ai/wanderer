<template>
  <div>

    <div class="form-group">
      <label for="label">Question</label>
      <input v-model="question" type="text" class="form-control" id="label" placeholder="Enter your question">
    </div>
    {{question}}

    <div class="form-group">
      <label for="label">simpleProp</label>
      <input v-model="simpleProp" type="text" class="form-control" id="label" placeholder="Enter your prop">
    </div>
    {{simpleProp}}

    <div class="form-group">
      <label for="label">complexProp</label>
      <input v-model="complexProp" type="text" class="form-control" id="label" placeholder="Enter your complex prop">
    </div>
    {{complexProp}}

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    question: WandererBuilder.getEditVertexModel('question', 'de'),
    simpleProp: WandererBuilder.getEditVertexModel('simpleProp'),
    complexProp: WandererBuilder.getEditVertexModel('complexProp', 'foo')
  }
}
</script>

<style>

</style>
