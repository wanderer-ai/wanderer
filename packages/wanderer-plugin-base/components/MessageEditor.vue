<template>
  <div>

    <div class="form-group">
      <label for="message">Message</label>
      <textarea v-model="message" type="text" class="form-control" id="message" placeholder="Enter your message"></textarea>
    </div>

  </div>
</template>

<script>

export default {
  computed: {
    // message: WandererBuilderSingleton.getTranslatableVertexModel('message')
  }
}
</script>

<style>

</style>
