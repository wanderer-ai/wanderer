<template>

  <div class="builder--alerts">

    <div
      class="p-4 rounded-lg mb-4 text-white"
      v-bind:class="{
        'bg-red': alert.type=='error',
        'bg-yellow': alert.type=='info',
        'bg-green': alert.type=='success'
      }"
      v-for="(alert) in alerts"
      v-bind:key="alerts.indexOf(alert)"
    >
      {{alert.message}}
    </div>

  </div>

</template>

<script>

  export default {
    computed: {
      alerts () { return this.$store.state.wandererBuilder.alerts },
    }
  }

</script>

<style>

  .builder--alerts {
    position:fixed;
    max-width:400px;
    bottom: 2rem;
    left: 2rem;
    z-index: 9999;
  }

</style>
