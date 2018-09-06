<template>

  <div>

    <div id="cy"></div>

  </div>

</template>

<script>

export default {

  mounted () {
    this.$brain.initCytoscape({
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

    this.$brain.addVertex({
      '_id': '3948v57c3902t85n',
      '_origin': false,
      '_collection': 'flow',
      '_x': 100,
      '_y': 100
    })

    this.$brain.addVertex({
      '_id': '349z8qp8ez',
      '_origin': false,
      '_collection': 'default',
      '_x': 200,
      '_y': 200
    })

    this.$brain.addVertex({
      '_id': '2vn764576f',
      '_origin': false,
      '_collection': 'question',
      '_x': 300,
      '_y': 300,
      'question': {
        'de': 'Frage',
        'en': 'Question'
      }
    })

    this.$brain.addVertex({
      '_id': '7v6bbv45687680',
      '_origin': false,
      '_collection': 'suggestion',
      '_x': 400,
      '_y': 400,
      'suggestion': {
        'de': 'Antwort',
        'en': 'Answer'
      }
    })

    this.$brain.addVertex({
      '_id': '07890957b7678946897',
      '_origin': false,
      '_collection': 'request',
      '_x': 500,
      '_y': 400
    })

    this.$brain.addVertex({
      '_id': '6734b76gh5785b3',
      '_origin': false,
      '_collection': 'response',
      '_x': 600,
      '_y': 400
    })
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
