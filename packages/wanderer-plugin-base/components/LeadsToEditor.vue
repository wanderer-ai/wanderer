<template>
  <div>

    <div class="form-group">
      <label for="label">Type</label>
      <select v-model="type" class="form-control" id="type">
        <option value="or">default</option>
        <option value="and">require</option>
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
    type: WandererBuilder.getEdgeModel('type'),
    priority: WandererBuilder.getEdgeModel('priority')
  }
}
</script>

<style>

</style>
