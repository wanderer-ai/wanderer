<template>
  <nav class="flex p-4 justify-between items-center bg-gray shadow-lg">

    <div>
      <div class="text-xl">Wanderer.ai</div>
      <div class="text-sm">Conversation Builder</div>
    </div>

    <div class="">
      {{name}}
    </div>

    <span class="">

      <portal-target class="" name="actionbar" multiple />

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
