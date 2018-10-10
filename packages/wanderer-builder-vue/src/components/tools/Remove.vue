
<template>

  <div>

    <portal to="actionbar" :order="2">
      <button class="btn btn-danger navbar-btn" title="Delete" v-on:click="showModal=true" v-if="selectedVertices">
        <icon name="trash"></icon>
      </button>
    </portal>

    <portal to="modals" :order="2">
      <modal title="Delete" :show="showModal" v-on:closeButton="showModal=false">
          Delete
      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/trash'
import Icon from 'vue-awesome/components/Icon'

// import Brain from 'wanderer-brain'

export default {
  components: {
    Modal, Icon
  },
  data: function () {
    return {
      showModal: false
    }
  },
  computed: {
    selectedVertices () {
      return this.$store.state.brain.selectedVertexIds.length
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
