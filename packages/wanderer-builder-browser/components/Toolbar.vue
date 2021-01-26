<template>
  <nav class="flex flex-wrap p-4 justify-between items-center bg-gray shadow-lg">

    <div class="w-full sm:w-1/3 hidden sm:block">
      <div class="text-xl">Wanderer.ai</div>
      <div class="text-sm">Conversation Builder</div>
    </div>

    <div class="w-full sm:w-1/3 mb-2 sm:mb-0 sm:text-center">
      {{name}}
    </div>

    <span class="w-full sm:w-1/3">

      <portal-target tag="builder-button-group" name="actionbar" class="sm:justify-end" multiple />

    </span>

  </nav>
</template>

<script>

export default {
  computed: {
    name () {
      return this.$builder.getTranslatableOriginDataValue('topic')
    }
  },
}

</script>

<style>

</style>
