<template>
  <div>

    <div class="form-group">
      <label for="question">Question</label>
      <textarea v-model="question" type="text" class="form-control" id="question" placeholder="Enter your question"></textarea>
    </div>

    <div class="form-group">
      <div class="form-check">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="hideMessages">
          Hide suggestion messages in chat
        </label>
      </div>
      <div class="form-check">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="drawAttention">
          Draw attention (Shake buttons)
        </label>
      </div>
      <div class="form-check">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="smallButtons">
          Use small buttons
        </label>
      </div>
    </div>

  </div>
</template>

<script>

import WandererBuilder from 'wanderer-builder-singleton'
// import StoreSingleton from 'wanderer-store-singleton'

export default {
  computed: {
    question: WandererBuilder.getTranslatableVertexModel('question'),
    hideMessages: WandererBuilder.getVertexModel('hideMessages'),
    drawAttention: WandererBuilder.getVertexModel('drawAttention'),
    smallButtons: WandererBuilder.getVertexModel('smallButtons')
  }
}
</script>

<style>

</style>
