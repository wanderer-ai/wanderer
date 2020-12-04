
<template>

  <div>

    <portal to="actionbar" :order="1">
      <builder-button color="gray-dark" title="Show Info" v-on:click="showModal=true">
        <icon name="info"></icon>
      </builder-button>
    </portal>

    <portal to="modals" :order="1">
      <builder-modal title="Conversation Builder" :show="showModal"  v-on:closeButton="showModal=false">
        <builder-content>
          <p>
            Hey! This is a free service! Use it for commercial or private projects as long as you use it with the wanderer.ai domain.
            If you want to run chatbots built with this software on your own domain, take a look at the
            <a target="_blank" href="https://wanderer.ai/pricing/">licensing model</a>.
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
          <p>
            <strong>Important information:</strong> This software is experimental! Currently you should not use Wanderer.ai for production projects!
            The project is in a early stage of development. So your conversation flows could break in the future.
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
