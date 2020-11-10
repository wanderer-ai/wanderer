
<template>
  <div class="wanderer-builder">

    <div class="wanderer-builder-wrapper flex flex-col relative z-10 h-screen">

      <div class="wanderer-builder-toolbar">
        <toolbar />
      </div>

      <div class="wanderer-builder-cytoscape flex-grow flex-shrink overflow-hidden">

        <!-- <chat-panel class="wanderer-builder-chat" :show="showChatPanel" v-on:closeButton="showChatPanel=false" /> -->

        <cytoscape />

      </div>

    </div>

    <portal-target class="relative z-50" name="modals" multiple />

    <alerts />

    <file-tool :show="showFileTool" v-on:startTutorial="startTutorial()" v-on:viewExamples="viewExamples()"/>

    <!-- <info-tool /> -->
     <edit-vertex-tool />
    <!-- <edit-edge-tool />
    <remove-tool />
    <unlink-tool />
    <connect-tool />
    <language-tool />
    <chat-tool v-on:toggle="toggleChatPanel()"/>
    <restart-tool v-on:toggle="toggleChatPanel()" v-if="showChatPanel"/>
    <add-vertex-tool /> -->

  </div>
</template>

<script>

import Toolbar from './Toolbar.vue'
import Cytoscape from './Cytoscape.vue'
// import ChatPanel from './ChatPanel.vue'
import Alerts from './Alerts.vue'
//
// import InfoTool from './tools/Info.vue'
import EditVertexTool from './tools/EditVertex.vue'
// import EditEdgeTool from './tools/EditEdge.vue'
// import RemoveTool from './tools/Remove.vue'
// import UnlinkTool from './tools/Unlink.vue'
// import ConnectTool from './tools/Connect.vue'
import FileTool from './tools/File.vue'
// import LanguageTool from './tools/Language.vue'
// import ChatTool from './tools/Chat.vue'
// import AddVertexTool from './tools/AddVertex.vue'
// import RestartTool from './tools/Restart.vue'

export default {
  name: 'App',
  components: {
    Toolbar,
    Cytoscape,
    // ChatPanel,
    Alerts,
    // InfoTool,
    EditVertexTool,
    // EditEdgeTool,
    // RemoveTool,
    // UnlinkTool,
    // ConnectTool,
    FileTool,
    // LanguageTool,
    // ChatTool,
    // AddVertexTool,
    // RestartTool
  },
  data: function () {
    return {
      showChatPanel: false,
      showFileTool: true
    }
  },
  methods: {
    // toggleChatPanel () {
    //   if(this.showChatPanel){
    //     this.showChatPanel = false
    //   }else{
    //     this.showChatPanel = true
    //   }
    // },
    // async startTutorial () {
    //   this.showChatPanel = true
    //   await WandererSingleton.loadJsonRemote('https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/intro/welcome.json')
    // },
    // async viewExamples () {
    //   this.showChatPanel = true
    //   await WandererSingleton.loadJsonRemote('https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/examples/examples.json')
    // }
  }
}
</script>

<style>


</style>
