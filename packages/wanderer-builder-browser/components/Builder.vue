
<template>
  <div class="">

    <div class="flex flex-col relative z-10 h-screen">

      <div class="">
        <toolbar />
      </div>

      <div class="flex-grow flex-shrink overflow-hidden relative ">

        <div class="builder--toolbar absolute z-30 top-2 left-2">
          <portal-target tag="builder-button-group" name="toolbar" multiple />
        </div>

        <cytoscape />

      </div>

    </div>

    <portal-target class="relative z-50" name="modals" multiple />

    <alerts />

    <file-tool v-on:startTutorial="startTutorial()" v-on:viewExamples="viewExamples()"/>
    <info-tool />
    <edit-vertex-tool />
    <edit-edge-tool />
    <remove-tool />
    <connect-tool />
    <language-tool />
    <reload-tool />
    <add-vertex-tool />

    <wanderer-chat/>

  </div>
</template>

<script>

import Toolbar from './Toolbar.vue'
import Cytoscape from './Cytoscape.vue'
import Alerts from './Alerts.vue'

import InfoTool from './tools/Info.vue'
import EditVertexTool from './tools/EditVertex.vue'
import EditEdgeTool from './tools/EditEdge.vue'
import RemoveTool from './tools/Remove.vue'
import ConnectTool from './tools/Connect.vue'
import FileTool from './tools/File.vue'
import LanguageTool from './tools/Language.vue'
import AddVertexTool from './tools/AddVertex.vue'
import ReloadTool from './tools/Reload.vue'

export default {
  name: 'App',
  components: {
    Toolbar,
    Cytoscape,
    Alerts,
    InfoTool,
    EditVertexTool,
    EditEdgeTool,
    RemoveTool,
    ConnectTool,
    FileTool,
    LanguageTool,
    AddVertexTool,
    ReloadTool
  },
  data: function () {
    return {
      showChatPanel: false
    }
  }
}
</script>

<style>

.builder--toolbar {
  top:2rem;
  left:2rem;
}

</style>
