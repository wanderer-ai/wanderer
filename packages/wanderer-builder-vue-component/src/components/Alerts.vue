<template>

  <div class="alerts">

    <transition-group name="fade">
      <div
        class="alert"
        v-bind:class="{
          'alert-primary': alert.type=='primary',
          'alert-secondary': alert.type=='secondary',
          'alert-success': alert.type=='success',
          'alert-danger': alert.type=='danger',
          'alert-warning': alert.type=='warning',
          'alert-info': alert.type=='info',
          'alert-light': alert.type=='light',
          'alert-dark': alert.type=='dark',
        }"
        role="alert"
        v-for="(alert) in alerts"
        v-bind:key="alerts.indexOf(alert)"
      >
        {{alert.message}}
      </div>
    </transition-group>
  </div>

</template>

<script>

  export default {
    computed: {
      alerts () { return this.$store.state.wanderer.builder.alerts },
    },
  }

</script>

<style>

  .alerts{
    position:fixed;
    width:400px;
    top:90px;
    right:15px;
  }

</style>
