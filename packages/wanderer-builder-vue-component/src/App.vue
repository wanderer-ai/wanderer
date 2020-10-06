
<template>
  <div class="wanderer-builder">

    <div class="wanderer-builder-wrapper">

      <div class="wanderer-builder-toolbar">
        <toolbar />
      </div>

      <div class="wanderer-builder-cytoscape">

        <chat-panel class="wanderer-builder-chat" :show="showChatPanel" v-on:closeButton="showChatPanel=false" />

        <cytoscape />

      </div>

    </div>

    <portal-target name="modals" multiple />

    <alerts />

    <info-tool />
    <edit-vertex-tool />
    <edit-edge-tool />
    <remove-tool />
    <unlink-tool />
    <connect-tool />
    <file-tool :show="showFileTool" v-on:startTutorial="startTutorial()"/>
    <language-tool />
    <chat-tool v-on:toggle="toggleChatPanel()"/>
    <add-vertex-tool />
    <!-- <welcome-tool v-on:startTutorial="startTutorial()" v-on:openFileTool="openFileTool()" /> -->

  </div>
</template>

<script>

import Toolbar from './components/Toolbar.vue'
import Cytoscape from './components/Cytoscape.vue'
import ChatPanel from './components/ChatPanel.vue'
import Alerts from './components/Alerts.vue'

import InfoTool from './components/tools/Info.vue'
import EditVertexTool from './components/tools/EditVertex.vue'
import EditEdgeTool from './components/tools/EditEdge.vue'
import RemoveTool from './components/tools/Remove.vue'
import UnlinkTool from './components/tools/Unlink.vue'
import ConnectTool from './components/tools/Connect.vue'
import FileTool from './components/tools/File.vue'
import LanguageTool from './components/tools/Language.vue'
import ChatTool from './components/tools/Chat.vue'
import AddVertexTool from './components/tools/AddVertex.vue'
// import WelcomeTool from './components/tools/Welcome.vue'

import WandererSingleton from 'wanderer-singleton'

export default {
  name: 'App',
  components: {
    Toolbar,
    Cytoscape,
    ChatPanel,
    Alerts,
    InfoTool,
    EditVertexTool,
    EditEdgeTool,
    RemoveTool,
    UnlinkTool,
    ConnectTool,
    FileTool,
    LanguageTool,
    ChatTool,
    AddVertexTool,
    // WelcomeTool
  },
  data: function () {
    return {
      showChatPanel: false,
      showFileTool: true
    }
  },
  methods: {
    // openFileTool () {
    //   this.showFileTool = true
    // },
    toggleChatPanel () {
      if(this.showChatPanel){
        this.showChatPanel = false
      }else{
        this.showChatPanel = true
      }
    },
    async startTutorial () {
      this.showChatPanel = true
      await WandererSingleton.loadJsonRemote('https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/intro/welcome.json')
      // WandererSingleton.traverse()
    }
  }
}
</script>

<style>

.wanderer-builder-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
  height:100vh;
}

.wanderer-builder-cytoscape {
  flex:1 1;
  position: relative;
  overflow: hidden; /* Some elements will flow out of the cytocsape box. Hide them. */
}

</style>
