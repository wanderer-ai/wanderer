<template>

  <div class="builder-vertex-card p-4 w-full md:w-1/2 flex-grow">

    <div class="flex bg-white rounded-lg shadow-md h-full">

      <div class="p-4">
        <div @click="$emit('click')" class="builder-vertex-card__vertex cursor-pointer" :style="'background-color:'+color+';'">

        </div>
      </div>

      <div class="flex flex-col">

        <div class="p-4 pb-0 text-md">
          <span @click="$emit('click')" class="cursor-pointer text-sm" v-if="through">{{through}}</span>
          <span @click="$emit('click')" class="cursor-pointer font-bold">{{title}}</span>
          <a :href="infoUrl" v-if="infoUrl" target="_blank" title="help" class="text-gray-dark">
            <icon name="question-circle"></icon>
          </a>
          <a href="https://wanderer.ai/docs/user-guide/proprietary-nodes.html" v-if="proprietary" target="_blank" title="Professional Edition" class="text-yellow">
            <icon name="crown"></icon>
          </a>
          <div class="border-b-2 boder-solid border-gray"></div>
        </div>

        <div @click="$emit('click')" class="cursor-pointer p-4 pt-0 text-sm text-gray-dark">
          <slot/>
        </div>

      </div>

    </div>

  </div>

</template>

<script>

import 'vue-awesome/icons/question-circle'
import 'vue-awesome/icons/crown'
import Icon from 'vue-awesome/components/Icon'

export default {
  components: {
    Icon
  },
  props: {
    color: {
      type: String,
      default: 'grey'
    },
    title: {
      type: String,
      default: 'Titel'
    },
    through: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: 'Text'
    },
    infoUrl: {
      type: String,
      default: ''
    },
    proprietary: {
      type: Boolean,
      default: false
    }
  }
}

</script>

<style>

.builder-vertex-card__vertex {
  height:50px;
  width:50px;
  border-radius: 50%;
}

</style>
