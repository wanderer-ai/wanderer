<template>
  <div>

    <div class="form-group">
      <label for="title">Titel</label>
      <input v-model="title" type="text" class="form-control" id="title" placeholder="Report titel">
    </div>

    <div class="form-group">
      <label for="label">Report</label>
      <textarea v-model="report" class="form-control" id="label" height="20"></textarea>
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'

export default {
  computed: {
    title: WandererBuilder.getTranslatableVertexModel('title'),
    report: WandererBuilder.getTranslatableVertexModel('report')
  }
}
</script>

<style>

</style>
