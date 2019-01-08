<template>

  <div>

    <div id="cy"></div>

    <!-- <button style="position:relative;z-index:100;" v-on:click="initHeadless()">init headless</button>
    <button style="position:relative;z-index:100;" v-on:click="initHead()">init head</button> -->

  </div>

</template>

<script>

// import Brain from 'wanderer-brain'

export default {

  mounted () {

    this.$wandererBuilder.initCytoscape({
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

  },
  methods: {
    // initHead () {
    //   this.$wandererBuilder.initCytoscape({
    //     container: document.getElementById('cy'),
    //
    //     // initial viewport state:
    //     zoom: 1,
    //     pan: { x: 0, y: 0 },
    //
    //     // interaction options:
    //     minZoom: 0.3,
    //     maxZoom: 3,
    //     zoomingEnabled: true,
    //     userZoomingEnabled: true,
    //     panningEnabled: true,
    //     userPanningEnabled: true,
    //     boxSelectionEnabled: true,
    //     selectionType: 'single',
    //     touchTapThreshold: 8,
    //     desktopTapThreshold: 4,
    //     autolock: false,
    //     autoungrabify: false,
    //     autounselectify: false,
    //
    //     // rendering options:
    //     headless: false,
    //     styleEnabled: true,
    //     hideEdgesOnViewport: false,
    //     hideLabelsOnViewport: false,
    //     textureOnViewport: false,
    //     motionBlur: false,
    //     motionBlurOpacity: 0.2,
    //     wheelSensitivity: 0.1,
    //     pixelRatio: 'auto'
    //   })
    // },
    // initHeadless () {
    //   this.$cytoscape.initHeadlessCytoscape(Brain.initCytoscape({
    //     headless: true,
    //   }))
    // }
  }
}

</script>

<style>

#cy {
  position:absolute;
  width: 100%;
  height: 100%;
  top:0;
  left:0;
}

</style>
