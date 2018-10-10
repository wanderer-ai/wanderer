
<template>
  <div>

    <toolbar />

    <cytoscape />

    <portal-target name="modals" multiple />

    <info-tool />

    <edit-vertex-tool />

    <remove-tool />

  </div>
</template>

<script>

import Toolbar from './components/Toolbar.vue'
import Cytoscape from './components/Cytoscape.vue'
import InfoTool from './components/tools/Info.vue'
import EditVertexTool from './components/tools/EditVertex.vue'
import RemoveTool from './components/tools/Remove.vue'

export default {
  name: 'App',
  components: {
    Toolbar,
    Cytoscape,
    InfoTool,
    EditVertexTool,
    RemoveTool
  }
}
</script>

<style>

</style>
