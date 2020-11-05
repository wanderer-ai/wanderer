<template>
  <div>

    <div class="form-group">
      <label for="label">Suggestion</label>
      <input v-model="suggestion" type="text" class="form-control" id="label" placeholder="Enter your suggestion">
    </div>

    <div class="form-group">
      <label for="label">Type</label>
      <select v-model="type" class="form-control" id="type">
        <option value="button">Button</option>
        <option value="checkbox">Checkbox</option>
        <option value="text">Text</option>
        <option value="textarea">Textarea</option>
      </select>
    </div>

    <div class="form-group">
      <label for="priority">Priority ({{priority}})</label>
      <input type="range" v-model="priority" class="custom-range" id="priority" min="0" max="100">
    </div>


  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    suggestion: WandererBuilder.getTranslatableVertexModel('suggestion'),
    type: WandererBuilder.getVertexModel('type'),
    priority: WandererBuilder.getVertexModel('priority')
  }
}
</script>

<style>

</style>
