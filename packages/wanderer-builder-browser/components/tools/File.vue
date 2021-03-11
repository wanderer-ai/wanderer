
<template>

  <div>

    <portal to="actionbar" :order="1">
      <builder-button color="gray-dark" title="Save or restore a project" v-on:click="showModal=true">
        <icon name="save"></icon>
      </builder-button>
    </portal>

    <portal to="modals" :order="1">
      <builder-modal :showHeader="true" :title="(vertexCount>0)?'Project':'Welcome'" :showFooter="true" :showClose="vertexCount>0" :show="showModal"  v-on:closeButton="showModal=false">

        <div class="flex flex-col">

          <builder-button class="mb-4" color="green" v-on:click="startTutorial()">
            <div class="flex w-full justify-between items-center">
              <icon name="robot"></icon>
              <span>Start tutorial bot</span>
              <icon name="arrow-right"></icon>
            </div>
          </builder-button>

          <!-- <builder-button class="mb-4" color="green" v-on:click="viewExamples()">
            <div class="flex w-full justify-between items-center">
              <icon name="lightbulb"></icon>
              <span>View examples</span>
              <icon name="arrow-right"></icon>
            </div>
          </builder-button> -->

          <builder-button v-if="vertexCount" class="mb-4" color="yellow" v-on:click="downloadFile()">
            <div class="flex w-full justify-between items-center">
              <icon name="download"></icon>
              <span>Download project</span>
              <icon name="arrow-right"></icon>
            </div>
          </builder-button>

          <builder-button class="mb-4" v-on:click="startEmptyProject()">
            <div class="flex w-full justify-between items-center">
              <icon name="file"></icon>
              <span>New project</span>
              <icon name="arrow-right"></icon>
            </div>
          </builder-button>

          <builder-button class="mb-4 upload--button">
            <div>
              <div class="flex w-full justify-between items-center">
                <icon name="upload"></icon>
                <span>Load from file</span>
                <icon name="arrow-right"></icon>
              </div>
              <input type="file" @change="loadFromFile">
            </div>
          </builder-button>

          <builder-button class="w-full" v-on:click="loadFromUrl(url)">
            <div class="flex w-full justify-between items-center">
              <icon name="globe"></icon>
              <span>Load from URL</span>
              <icon name="arrow-right"></icon>
            </div>
          </builder-button>

          <input type="text" class="rounded w-full py-2 px-4 text-gray-700 leading-tight border-2 border-blue" v-model="url" />

        </div>

      </builder-modal>
    </portal>

  </div>

</template>

<script>

import Icon from 'vue-awesome/components/Icon'

// Icons
import 'vue-awesome/icons/save'
import 'vue-awesome/icons/download'
import 'vue-awesome/icons/robot'
import 'vue-awesome/icons/file'
import 'vue-awesome/icons/upload'
import 'vue-awesome/icons/globe'
import 'vue-awesome/icons/lightbulb'
import 'vue-awesome/icons/arrow-right'

import {version} from '../../package.json'

export default {
  components: {
    Icon
  },
  data: function () {
    return {
      url: 'https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/intro/welcome.json'
    }
  },
  watch: {
    showModal: function (showModal) {

      // Unselect all items because I dont want to trigger the delete key event inside the file tool because we have a text input in here
      if(showModal) {
        this.$builder.unselect()
      }

    }
  },
  computed: {
    showModal: {
      get() {
        return this.$store.state.wandererBuilder.showFileTool
      },
      set(value) {
        this.$store.commit('wandererBuilder/setShowFileTool', value)
      }
    },
    vertexCount () {
      return this.$store.state.wandererGraph.vertexDocumentIds.length;
    },
    fileName () {
      var fileName = this.$builder.getTranslatableOriginDataValue('topic')
      if(!fileName) {
        fileName = 'untitled.json'
      }
      return fileName.replace(/[^\w.]+/g, "_").toLowerCase()+'.json'
    },
    version () {
      return version
    }
  },
  methods: {
    startTutorial () {
      this.showModal = false
      let url = 'https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/intro/welcome.json'
      this.$wanderer.loadFromUrl(url)
      this.$store.commit('wandererBuilder/setTutorialMode', true)
      this.$store.commit('wandererChat/setVisible', true)
    },
    viewExamples () {
      this.showModal = false
      this.$wanderer.loadFromUrl('https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/examples/examples.json')
      this.$store.commit('wandererBuilder/setTutorialMode', true)
      this.$store.commit('wandererChat/setVisible', true)
    },
    startEmptyProject () {

      this.$wanderer.startEmptyProject()

      this.$store.commit('wandererBuilder/setTutorialMode', false)

      this.showModal = false

    },
    async loadFromUrl (url) {
      try {
        await this.$wanderer.loadFromUrl(url)
        this.$store.commit('wandererBuilder/setTutorialMode', false)
        this.showModal = false
      } catch (e) {
        this.$store.dispatch('wandererBuilder/addAlert',{message: e, type: 'error'})
      }
    },
    async loadFromFile (ev) {
      const file = ev.target.files[0]
      try {
        await this.$wanderer.loadFromFile(file)
        this.$store.commit('wandererBuilder/setTutorialMode', false)
        this.showModal = false
      } catch (e) {
        this.$store.dispatch('wandererBuilder/addAlert',{message: e, type: 'error'})
      }
    },
    downloadFile () {
      let exportData = this.$builder.generateExportData();

      // Trigger download
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2)));
      element.setAttribute('download', this.fileName);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);

      // Hide modal
      this.showModal = false

    }
  }
}
</script>

<style>

.upload--button {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.upload--button input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}

</style>
