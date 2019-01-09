
<template>

  <div>

    <portal to="actionbar" :order="1">
      <button class="btn btn-secondary navbar-btn" title="Info" v-on:click="showModal=true">
        <icon name="info"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal title="Wanderer.ai Conversation Builder" :show="showModal"  v-on:closeButton="showModal=false">

        <p>
          Version {{version}}
        </p>
        <p>
          This software was published under the {{license}} open source license.
          You can use it for private and commercial projects.
        </p>
        <p>
          Do you need Help? Check out the documentation.
        </p>
        <p>
          Are you interested in the technology behind?
          Visit <a target="_blank" href="https://wanderer.ai">Wanderer.ai</a> and read <a target="_blank" href="https://steampixel.de/en/tag/lets-build-an-open-source-chatbot-builder/">SteamPixel's blog series</a> about this topic.
        </p>
        <p>
          Are you interested in developing applications like this? Are you an open source enthusiast?
          Help me to improve this software!
          Check out the <a target="_blank" href="https://github.com/wanderer-ai">repositories</a> or open a new issue on <a target="_blank" href="https://github.com/wanderer-ai">GitHub</a>.
        </p>

      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/info'
import Icon from 'vue-awesome/components/Icon'

import {version} from '../../../package.json';

export default {
  components: {
    Modal, Icon
  },
  data: function () {
    return {
      license: 'Apache 2.0',
      showModal: false
    }
  },
  computed: {
    version () {
      return version
    }
  }
}
</script>

<style>

</style>
