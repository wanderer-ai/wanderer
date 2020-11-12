<template>
  <nav class="flex p-4 justify-between bg-gray">

    <a class="" href="#">Wanderer.ai <small>Conversation Builder</small></a>

    <div class="collapse navbar-collapse">
      <portal-target class="btn-group" name="toolbar" multiple />
    </div>

    <div class="collapse navbar-collapse">
      {{name}}
    </div>

    <span class="navbar-text navbar-right">

      <portal-target class="btn-group" name="actionbar" multiple />

    </span>

  </nav>
</template>

<script>

export default {
  computed: {
    name () {
      // if (this.$store.state.wanderer.originVertexId) {
      //   if(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.originVertexId].topic){
      //     return this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.originVertexId].topic[this.$store.state.wanderer.currentLanguage];
      //   }
      // }
      return 'untitled'
    }
  },
}

</script>

<style>

</style>
