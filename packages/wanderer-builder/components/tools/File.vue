
<template>

  <div>

    <portal to="actionbar" :order="1">
      <button class="btn btn-secondary navbar-btn" title="Save or restore a project" v-on:click="showModal=true">
        <icon name="save"></icon>{{showModal}}
      </button>
    </portal>

    <portal to="modals" :order="1">
      <builder-modal :showHeader="true" title="Save and Restore" :showFooter="true" :showClose="vertexCount>0" :show="showModal"  v-on:closeButton="showModal=false">

        <div class="mb-4">

          <builder-button v-on:click="startTutorial()">
            <icon name="book"></icon>
            Start a tutorial now
          </builder-button>

          <span>
            or
          </span>

          <builder-button v-on:click="viewExamples()">
            <icon name="lightbulb"></icon>
            View some examples
          </builder-button>

        </div>

        <div class="mb-4">

          <builder-button v-on:click="startEmptyProject()">
            <icon name="file"></icon>
            Start a new project
          </builder-button>

          <span>
            or
          </span>

          <builder-button>
            <icon name="upload"></icon>
            Restore from file
            <input class="btn" type="file" @change="loadJsonFile">
          </builder-button>

        </div>

        <div class="mb-4" v-if="vertexCount">

          <builder-button v-on:click="exportJsonFile()">
            <icon name="download"></icon>
            Download your current project
          </builder-button>

        </div>

        <div class="mb-4">

          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <builder-button v-on:click="loadJsonRemote(url)">
                <icon name="globe"></icon>
                Restore from URL
              </builder-button>
            </div>
            <input type="text" class="form-control" v-model="url">
          </div>

        </div>

        <div class="alert alert-warning" role="alert">
          <strong>Important information:</strong> This software is experimental! Currently you should not use Wanderer.ai for production projects!
          The project is in a early stage of development. So your conversation flows could break in the future.
        </div>

      </builder-modal>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/save'
import Icon from 'vue-awesome/components/Icon'

// Icons
import 'vue-awesome/icons/download'
import 'vue-awesome/icons/book'
import 'vue-awesome/icons/file'
import 'vue-awesome/icons/upload'
import 'vue-awesome/icons/globe'
import 'vue-awesome/icons/lightbulb'

import {version} from '../../package.json'

export default {
  components: {
    Icon
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      showModal: this.show,
      url: 'https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/intro/welcome.json'
    }
  },
  watch: {
    show: function (newValue, oldValue) {
      this.showModal = newValue
    }
  },
  computed: {
    vertexCount () {
      // return this.$store.state.wanderer.vertexDocumentIds.length;
    },
    fileName () {
      // if (this.$store.state.wanderer.originVertexId) {
      //   if(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.originVertexId].topic){
      //     return this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.originVertexId].topic[this.$store.state.wanderer.currentLanguage]+'.json';
      //   }
      // }
      return 'untitled.json'
    },
    version () {
      return version
    }
  },
  methods: {
    startTutorial (url) {
      this.showModal = false
      this.$emit('startTutorial')
    },
    viewExamples (url) {
      this.showModal = false
      this.$emit('viewExamples')
    },
    startEmptyProject () {

      this.$wanderer.loadFromData(this.$wanderer.regenerateJsonDataIds({
        "vertices": [
          {
            "_collection": "flow",
            "_id": "d3fab08d-e05e-4885-8eba-f1e86a374c98",
            "_origin": true,
            "_x": 0,
            "_y": 0,
            "languages": ["en", "de"],
            "topic": {
              "en": "New chat flow",
              "de": "Neuer Chat-Flow"
            },
            "author": "Unknown",
            "license": "MIT",
            "builder": "wanderer.ai",
            "target": "web",
            "version": this.version,
            "time": ""
          }
        ]
      }))

      this.showModal = false

    },
    async loadJsonRemote (url) {
      try {
        await WandererSingleton.loadJsonRemote(url)
        this.showModal = false
      } catch (e) {
        WandererStoreSingleton.store.dispatch('wanderer/builder/addAlert',{message: e, type: 'danger'})
      }

    },
    async loadJsonFile (ev) {

      const file = ev.target.files[0]

      // try {
        await this.$wanderer.loadFromFile(file)
        this.showModal = false
      //} catch (e) {
        // this.$store.dispatch('wandererBuilder/addAlert',{message: e, type: 'danger'})
      //}

    },
    generateExportData () {
      let exportData = {
        // version: WandererConfig.version,
        vertices: [],
        edges: []
      }

      // export vertices
      for(let i in this.$store.state.wanderer.vertexDocumentIds) {
        if(
          this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.vertexDocumentIds[i]]['_immutable'] === undefined ||
          this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.vertexDocumentIds[i]]['_immutable'] === false
        ) {

          // Override some flow values before saving it to the file
          if(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.vertexDocumentIds[i]]['_origin']) {
            WandererStoreSingleton.store.commit('wanderer/setVertexDataValue', {
              id: this.$store.state.wanderer.vertexDocumentIds[i],
              key: 'builder',
              value: 'wanderer.ai'
            })
            WandererStoreSingleton.store.commit('wanderer/setVertexDataValue', {
              id: this.$store.state.wanderer.vertexDocumentIds[i],
              key: 'target',
              value: 'web'
            })
            WandererStoreSingleton.store.commit('wanderer/setVertexDataValue', {
              id: this.$store.state.wanderer.vertexDocumentIds[i],
              key: 'version',
              value: this.version
            })
            WandererStoreSingleton.store.commit('wanderer/setVertexDataValue', {
              id: this.$store.state.wanderer.vertexDocumentIds[i],
              key: 'time',
              value: new Date()
            })
          }

          exportData.vertices.push(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.vertexDocumentIds[i]])
        }
      }

      // export edges
      for(let i in this.$store.state.wanderer.edgeDocumentIds) {
        if(
          this.$store.state.wanderer.edgeDocumentData[this.$store.state.wanderer.edgeDocumentIds[i]]['_immutable'] === undefined ||
          this.$store.state.wanderer.edgeDocumentData[this.$store.state.wanderer.edgeDocumentIds[i]]['_immutable'] === false
        ) {
          exportData.edges.push(this.$store.state.wanderer.edgeDocumentData[this.$store.state.wanderer.edgeDocumentIds[i]])
        }
      }

      return exportData
    },
    exportJsonFile () {
      let exportData = this.generateExportData();

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

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.col.has-devider {
  border-right:1px solid #eee;
}

.col.has-devider:last-of-type {
  border-right:0;
}

</style>
