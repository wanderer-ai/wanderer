
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
          <div class="col" v-if="vertexCount">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Save the current project</h5>
                <p class="card-text">Save and download the current project as {{fileName}}</p>
                <a href="#" class="btn btn-primary" v-on:click="exportJsonFile()">Save current</a>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Start a new project</h5>
                <p class="card-text">Start a completly new project</p>
                <a href="#" class="btn btn-primary" v-on:click="startEmptyProject()">Start new</a>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Restore an existing project</h5>
                <p class="card-text">Restore an existing project from a project file.</p>
                <div class="upload-btn-wrapper">
                  <button class="btn btn-primary">Restore</button>
                  <input class="btn" type="file" @change="loadFromFile">
                </div>
              </div>
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
      if(this.$store.state.wanderer.vertexDocumentIds.length){
        if(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.vertexDocumentIds[0]].topic){
          return this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.vertexDocumentIds[0]].topic[this.$store.state.wanderer.currentLanguage]+'.json';
        }
      }
      return 'untitled.json'
    }
  },
  methods: {
    startEmptyProject(){
      // Lets reset the IDs. So we have no conflicts with imported data in the future
      this.loadFromJson(this.resetIds({
        "version": "1.0.0",
        "languages": ["en","de"],
        "vertices": [
          {
            "_collection": "flow",
            "_id": "d3fab08d-e05e-4885-8eba-f1e86a374c98",
            "_isOrigin": true,
            "_x": 0,
            "_y": 0,
            "topic": {
              "en": "Cat consultant",
              "de": "Katzenberater"
            },
            "onboarding": {
              "en": "Hey! I am your cat consultant!",
              "de": "Hey! Ich bin dein Katzenberater!"
            },
            "offboarding": {
              "en": "Thanks for participating. I have no further questions.",
              "de": "Danke, dass du mitgemacht hast. Ich habe keine weiteren Fragen."
            },
            "author": "Unknown",
            "license": "MIT"
          }
        ]
      }))

    },
    loadFromJson(data){
      WandererSingleton.load(data)

      // Center
      this.$cytoscape.cy.center(this.$cytoscape.cy.$id(data.vertices[0]._id))
      this.$cytoscape.cy.zoom(1)

      // Close modal
      this.showModal = false

    },
    loadFromFile(ev) {
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
    resetIds(data){
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
        date: new Date(),
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

</style>
