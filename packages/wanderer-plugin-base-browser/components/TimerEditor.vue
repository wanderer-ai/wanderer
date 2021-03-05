<template>
  <div>

    <builder-text-input type="number" label="Seconds" placeholder="Seconds" v-model="seconds" />

    <builder-checkbox-group>
      <builder-checkbox-input label="Forget on inactive" v-model="forgetful" />
    </builder-checkbox-group>

  </div>
</template>

<script>

export default {
  computed: {
    seconds: {
      get: function () {
        return String(this.$builder.getVertexDataValue('seconds')/1000)
      },
      set: function (value) {
        this.$builder.setVertexDataValue('seconds', Number(value*1000))
      }
    },
    forgetful: {
      get: function () {
        return this.$builder.getVertexDataValue('forgetful')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('forgetful', value)
      }
    },
  }
}
</script>

<style>

</style>
