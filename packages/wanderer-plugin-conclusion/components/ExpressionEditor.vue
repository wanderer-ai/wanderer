<template>
  <div>

    <div class="form-group">
      <label for="expression">Expression</label>
      <textarea v-model="expression" type="text" class="form-control" id="expression" placeholder="Expression"></textarea>
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    expression: WandererBuilder.getVertexModel('expression')
  }
}
</script>

<style>

</style>
