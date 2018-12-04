
<template>
  <div>

    <toolbar />
    <cytoscape />
    <chat-panel :show="showChatPanel" v-on:closeButton="showChatPanel=false" />

    <portal-target name="modals" multiple />

    <info-tool />
    <edit-vertex-tool />
    <remove-tool />
    <connect-tool />
    <file-tool />
    <language-tool />
    <chat-tool v-on:toggle="toggleChatPanel()"/>

  </div>
</template>

<script>

import Toolbar from './components/Toolbar.vue'
import Cytoscape from './components/Cytoscape.vue'
import ChatPanel from './components/ChatPanel.vue'

import InfoTool from './components/tools/Info.vue'
import EditVertexTool from './components/tools/EditVertex.vue'
import RemoveTool from './components/tools/Remove.vue'
import ConnectTool from './components/tools/Connect.vue'
import FileTool from './components/tools/File.vue'
import LanguageTool from './components/tools/Language.vue'
import ChatTool from './components/tools/Chat.vue'

export default {
  name: 'App',
  components: {
    Toolbar,
    Cytoscape,
    ChatPanel,
    InfoTool,
    EditVertexTool,
    RemoveTool,
    ConnectTool,
    FileTool,
    LanguageTool,
    ChatTool
  },
  data: function () {
    return {
      showChatPanel: false
    }
  },
  methods: {
    toggleChatPanel (){
      if(this.showChatPanel){
        this.showChatPanel = false
      }else{
        this.showChatPanel = true
      }
    }
  }
}
</script>

<style>

</style>
