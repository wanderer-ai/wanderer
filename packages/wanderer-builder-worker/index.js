
export default {

  install (wanderer) {

    var worker = wanderer.require('thread')
    var broadcast = wanderer.require('broadcast')

    // Register a subscriber
    var subscriber = broadcast.subscribe('builder-worker')

    // Listen to traversalFinished event
    subscriber.on('traversalFinished', (payload) => {

      // Send a animation request to the builder
      // Only send it if the animation can be handled by the client
      if(payload.activatedVertexIds.length+payload.activatedEdgeIds.length <= 100) {
        worker.postMessage({
          'event': 'animateTraversal',
          'payload': payload
        })
      }

    })

  }

}
