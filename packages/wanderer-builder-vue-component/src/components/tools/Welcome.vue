
<template>

  <div>

    <portal to="modals" :order="1">
      <modal title="Welcome" :show="showModal" :showClose="false" v-on:closeButton="showModal=false">

        <p>
          Welcome! This it the Wanderer.ai Conversation Builder. If you are familiar with me you can now create or restore projects.
          If you are new, click on the tutorial button to get a short introduction.
          <br/><br/>
        </p>

        <div class="row">

          <div class="col has-devider">

            <h5 class="card-title">Start a tutorial</h5>
            <p class="card-text">Are you new to Wanderer? Start with a series of tutorials.</p>
            <span class="btn btn-primary" v-on:click="loadJsonRemote('https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/001_simple_bot.json')">Start tutorial</span>

          </div>

          <div class="col has-devider">

            <h5 class="card-title">Create or Restore</h5>
            <p class="card-text">Restore or Create a new or load an existing project</p>
            <button class="btn btn-primary" v-on:click="showFileTool()">Create or load</button>

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
    }
  },
  methods: {
    showFileTool () {
      this.showModal=false;
      this.$emit('openFileTool')
    },
    loadJsonRemote (url) {
      try {
        WandererSingleton.loadJsonRemote(url)
        this.showModal = false
      } catch (e) {
        StoreSingleton.store.dispatch('wanderer/builder/addAlert',{message: e.message, type: 'danger'})
        this.showModal = false
      }
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
