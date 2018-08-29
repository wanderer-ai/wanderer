
<template>
  <div>

    <toolbar />
    <cytoscape />

  </div>
</template>

<script>

import Toolbar from './components/Toolbar.vue'
import Cytoscape from './components/Cytoscape.vue'

export default {
  name: 'App',
  components: {
    Toolbar,
    Cytoscape
  }
}
</script>

<style>

</style>
