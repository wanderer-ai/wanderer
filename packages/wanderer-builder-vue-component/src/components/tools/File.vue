
<template>

  <div>

    <portal to="actionbar" :order="1">
      <button class="btn btn-secondary navbar-btn" title="Save or restore a project" v-on:click="showModal=true">
        <icon name="save"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal title="Save or restore project" :showClose="vertexCount>0" :show="showModal"  v-on:closeButton="showModal=false">

        <div class="row">
          <div class="col has-devider" v-if="vertexCount">

            <h5 class="card-title">Save the current project</h5>
            <p class="card-text">Save and download the current project as {{fileName}}</p>
            <a href="#" class="btn btn-primary" v-on:click="exportJsonFile()">Save current</a>

          </div>
          <div class="col has-devider">

            <h5 class="card-title">Start a new project</h5>
            <p class="card-text">Start a completly new project</p>
            <a href="#" class="btn btn-primary" v-on:click="startEmptyProject()">Start new</a>

          </div>
          <div class="col has-devider">

            <h5 class="card-title">Restore from file</h5>
            <p class="card-text">Restore an existing project from a project file.</p>
            <div class="upload-btn-wrapper">
              <button class="btn btn-primary">Restore from file</button>
              <input class="btn" type="file" @change="loadJsonFile">
            </div>

          </div>

          <div class="col has-devider">

            <h5 class="card-title">Load from URL</h5>
            <p class="card-text">Load a project by URL</p>
            <input type="text" class="form-control" v-model="url">
            <a href="#" class="btn btn-primary" v-on:click="loadJsonRemote(url)">Load</a>

          </div>


        </div>

      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/save'
import Icon from 'vue-awesome/components/Icon'

import StoreSingleton from 'wanderer-store-singleton'
import WandererSingleton from 'wanderer-singleton'

import {version} from '../../../package.json'

export default {
  components: {
    Modal, Icon
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
      url: ''
    }
  },
  watch: {
    show: function (newValue, oldValue) {
      this.showModal = newValue
    }
  },
  computed: {
    vertexCount () {
      return this.$store.state.wanderer.vertexDocumentIds.length;
    },
    fileName () {
      if (this.$store.state.wanderer.originVertexId) {
        if(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.originVertexId].topic){
          return this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.originVertexId].topic[this.$store.state.wanderer.currentLanguage]+'.json';
        }
      }
      return 'untitled.json'
    },
    version () {
      return version
    }
  },
  methods: {
    startEmptyProject () {
      WandererSingleton.load(this.resetIds({
        "wanderer": "web-wanderer",
        "version": "1.0.0",
        "languages": ["en","de"],
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
            "license": "MIT"
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
        StoreSingleton.store.dispatch('wanderer/builder/addAlert',{message: e, type: 'danger'})
      }

    },
    async loadJsonFile (ev) {

      const file = ev.target.files[0]

      try {
        await WandererSingleton.loadJsonFile(file)
        this.showModal = false
      } catch (e) {
        StoreSingleton.store.dispatch('wanderer/builder/addAlert',{message: e, type: 'danger'})
      }

    },
    resetIds (data) {

      // Lets reset the IDs. So we have no conflicts with imported data in the future

      let dataString = JSON.stringify(data);

      for(let i in data.vertices){
        let oldId = data.vertices[i]._id
        let newId = this.$wanderer.generateId()
        var re = new RegExp(oldId, 'g')
        dataString = dataString.replace(re,newId)
      }

      for(let i in data.edges){
        let oldId = data.edges[i]._id
        let newId = this.$wanderer.generateId()
        var re = new RegExp(oldId, 'g')
        dataString = dataString.replace(re,newId)
      }

      return JSON.parse(dataString)
    },
    generateExportData () {
      let exportData = {
        // version: WandererConfig.version,
        wanderer: 'web-wanderer',
        version: this.version,
        time: new Date(),
        vertices: [],
        edges: []
      }

      // export vertices
      for(let i in this.$store.state.wanderer.vertexDocumentIds){
        exportData.vertices.push(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.vertexDocumentIds[i]])
      }

      // export edges
      for(let i in this.$store.state.wanderer.edgeDocumentIds){
        exportData.edges.push(this.$store.state.wanderer.edgeDocumentData[this.$store.state.wanderer.edgeDocumentIds[i]])
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
