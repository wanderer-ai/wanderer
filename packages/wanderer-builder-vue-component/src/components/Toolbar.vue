<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">

    <a class="navbar-brand" href="#">Wanderer.ai <small>Builder</small></a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">

      <portal-target class="btn-group" name="toolbar" multiple />

    </div>

    <span class="navbar-text navbar-right">

      <portal-target class="btn-group" name="actionbar" multiple />

    </span>

  </nav>
</template>

<script>

export default {

}

</script>

<style>
  .navbar{
    z-index:20;
  }
</style>
