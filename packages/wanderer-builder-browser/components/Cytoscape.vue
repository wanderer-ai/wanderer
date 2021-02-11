<template>

  <div id="cy"></div>

</template>

<script>

export default {

  mounted () {

    this.$builder.initCytoscape({
      container: document.getElementById('cy'),

      // initial viewport state:
      zoom: 1,
      pan: { x: 0, y: 0 },

      // interaction options:
      minZoom: 0.3,
      maxZoom: 3,
      zoomingEnabled: true,
      userZoomingEnabled: true,
      panningEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: true,
      selectionType: 'single',
      touchTapThreshold: 8,
      desktopTapThreshold: 4,
      autolock: false,
      autoungrabify: false,
      autounselectify: false,

      // rendering options:
      headless: false,
      styleEnabled: true,
      hideEdgesOnViewport: false,
      hideLabelsOnViewport: false,
      textureOnViewport: false,
      motionBlur: false,
      motionBlurOpacity: 0.2,
      wheelSensitivity: 0.1,
      pixelRatio: 'auto'
    })

  }
}

</script>

<style>

#cy {
  width: 100%;
  height: 100%;
}

.cxtmenu-item {
  color:white !important;
}

</style>
