<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">

    <a class="navbar-brand" href="#">Wanderer.ai <small>Builder</small></a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">

      <!--<div class="btn-group">
        <remove-tool />
        <connect-tool />
        <edit-tool />
      </div>-->

    </div>

    <span class="navbar-text navbar-right">

      <div class="btn-group">
        <!--<chat-tool />-->
        <!--<topic-selector-tool />-->
        <!--<language-tool />
        <file-tool />
        <search-tool />
        <functions-tool />
        <info-tool />-->

        <!--<no-ssr>
          <logout-tool />
        </no-ssr>-->
      </div>

    </span>

  </nav>
</template>

<script>

export default {
  components: {

  },
  methods: {

  }
}

</script>

<style>
  .navbar{
    z-index:20;
  }
</style>
