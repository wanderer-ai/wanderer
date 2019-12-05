
<template>

  <div>

    <portal to="actionbar" :order="1">
      <button class="btn btn-secondary navbar-btn" title="Save or restore a project" v-on:click="showModal=true">
        <icon name="save"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal title="Save or restore project" :show="showModal"  v-on:closeButton="showModal=false">

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

            <h5 class="card-title">Restore an existing project</h5>
            <p class="card-text">Restore an existing project from a project file.</p>
            <div class="upload-btn-wrapper">
              <button class="btn btn-primary">Restore</button>
              <input class="btn" type="file" @change="loadFromFile">
            </div>

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

import WandererSingleton from 'wanderer-singleton'

import {version} from '../../../package.json';

export default {
  components: {
    Modal, Icon
  },
  data: function () {
    return {
      showModal: true
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
      this.loadFromJson(this.resetIds({
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
              "en": "Cat consultant",
              "de": "Katzenberater"
            },
            "author": "Unknown",
            "license": "MIT"
          }
        ]
      }))

    },
    loadFromJson (data) {

      WandererSingleton.load(data)

      // Center
      this.$cytoscape.cy.center(this.$cytoscape.cy.$id(data.vertices[0]._id))
      this.$cytoscape.cy.zoom(1)

      // Close modal
      this.showModal = false

    },
    loadFromFile (ev) {
      const file = ev.target.files[0]
      const reader = new FileReader()

      reader.onload = e => {
        try {
          this.loadFromJson(JSON.parse(e.target.result))
        } catch(e) {
          console.log(e)
          // this.$store.dispatch('alerts/add',{message:'The file structure seems to be invalid',type:'danger'})
        }
      };

      reader.readAsText(file)
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
