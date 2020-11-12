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
    message: {
      get: function () {
        return this.$builder.getTranslatableVertexDataValue('message')
      },
      set: function (value) {
        this.$builder.setTranslatableVertexDataValue('message', value)
      }
    }
  }
}
</script>

<style>

</style>
