
<template>

  <div>

    <portal to="actionbar" :order="3">
      <builder-button color="gray-dark" title="Show Info" v-on:click="showModal=true">
        <icon name="info"></icon>
      </builder-button>
    </portal>

    <portal to="modals" :order="1">
      <builder-modal title="Wanderer.ai Conversation Builder" :show="showModal"  v-on:closeButton="showModal=false">
        <builder-content>
          <p>
            Hey! This is a free service! Use it for commercial or private projects as long as you use it with the wanderer.ai domain.
            If you want to run Wanderer.ai chatbots on your own domain or within your Apps, take a look at the
            <a target="_blank" href="https://wanderer.ai/pricing/">licensing model</a> since some nodes require a proffesional license.
          </p>
          <p>
            Do you have any questions? Do you need help and support? Then take a look at the <a target="_blank" href="https://wanderer.ai/docs/user-guide/">documentation</a> or start a tutorial.
          </p>
          <p>
            Are you interested in the technology behind?
            Visit <a target="_blank" href="https://wanderer.ai">Wanderer.ai</a> and read <a target="_blank" href="https://steampixel.de/en/tag/lets-build-an-open-source-chatbot-builder/">SteamPixel's blog series</a> about this topic.
            Check out the <a target="_blank" href="https://github.com/wanderer-ai">repositories</a> or open a new issue on <a target="_blank" href="https://github.com/wanderer-ai">GitHub</a>.
          </p>
          <p>
            <strong>Important information:</strong> This software is currently in rapid development state. That means that some features will change very frequently.
            At the moment you should not use Wanderer.ai for production projects!
          </p>
          <p>
            Version {{version}}
          </p>
        </builder-content>

      </builder-modal>
    </portal>

  </div>

</template>

<script>

import 'vue-awesome/icons/info'
import Icon from 'vue-awesome/components/Icon'

import {version} from '../../package.json';

export default {
  components: {
    Icon
  },
  data: function () {
    return {
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
