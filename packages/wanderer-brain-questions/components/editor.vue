<template>
  <div>

    This is the default editor for questions

    https://github.com/vuejs/vuex/issues/409

    <div class="form-group">
      <label for="label">Question</label>
      <input v-model="question" type="text" class="form-control" id="label" placeholder="Enter your question">
    </div>
    {{question}}

    <div class="form-group">
      <label for="label">simpleProp</label>
      <input v-model="simpleProp" type="text" class="form-control" id="label" placeholder="Enter your prop">
    </div>
    {{simpleProp}}

    <div class="form-group">
      <label for="label">complexProp</label>
      <input v-model="complexProp" type="text" class="form-control" id="label" placeholder="Enter your complex prop">
    </div>
    {{complexProp}}


  </div>
</template>

<script>

// import Toolbar from './components/Toolbar.vue'
// import Cytoscape from './components/Cytoscape.vue'

import Brain from 'wanderer-brain'

console.log(Brain)

export default {
  // name: 'App',
  components: {
    // Toolbar,
    // Cytoscape
  },
  computed: {
    // test: this.$store.state.brain
    question: Brain.getEditVertexModel('question', 'de'),
    simpleProp: Brain.getEditVertexModel('simpleProp'),
    complexProp: Brain.getEditVertexModel('complexProp', 'foo')
  }
}
</script>

<style>

</style>
