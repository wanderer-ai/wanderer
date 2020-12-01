
module.exports = {

  install (wanderer) {

    var worker = wanderer.require('thread')
    var broadcast = wanderer.require('broadcast')

    // Register a subscriber
    var subscriber = broadcast.subscribe('builder-worker')

    // Listen to traversalFinished event
    subscriber.on('traversalFinished', (payload) => {

      // Animate the nodes if this is ok
      if(payload.traversedVertexIds.length+payload.traversedEdgeIds.length <= 100) {
        worker.postMessage({
          'event': 'animateTraversal',
          'payload': payload
        })
      }

    })

  }

}
