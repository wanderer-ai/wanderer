<template>
  <nav class="navbar .navbar-expand navbar-expand navbar-light bg-light">

    <a class="navbar-brand" href="#">Wanderer.ai <small>Conversation Builder</small></a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

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
      if (this.$store.state.wanderer.originVertexId) {
        if(this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.originVertexId].topic){
          return this.$store.state.wanderer.vertexDocumentData[this.$store.state.wanderer.originVertexId].topic[this.$store.state.wanderer.currentLanguage];
        }
      }
      return 'untitled'
    }
  },
}

</script>

<style>
  .navbar{
    position:fixed;
    width:100%;
    z-index:20;
  }
</style>
