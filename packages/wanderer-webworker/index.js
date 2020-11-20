
module.exports = {

  client: {
    install (wanderer) {

      var worker = wanderer.require('worker')
      var broadcast = wanderer.require('broadcast')

      // Register a subscriber
      var subscriber = broadcast.subscribe('worker-client')

      // Truncate
      subscriber.on('truncate', (vertexData) => {
        worker.postMessage({
          'event': 'truncate'
        })
      })

      // Listen for new vertices
      subscriber.on('addVertexFromData', (vertexData) => {
        worker.postMessage({
          'event': 'addVertexFromData',
          'payload': vertexData
        })
      })

      // Listen for new edges
      subscriber.on('addEdgeFromData', (edgeData) => {
        worker.postMessage({
          'event': 'addEdgeFromData',
          'payload': edgeData
        })
      })

      // Listen for vertex deletions
      subscriber.on('removeVertexById', (vertexId) => {
        worker.postMessage({
          'event': 'removeVertexById',
          'payload': vertexId
        })
      })

      // Listen for edge deletions
      subscriber.on('removeEdgeById', (edgeId) => {
        worker.postMessage({
          'event': 'removeEdgeById',
          'payload': edgeId
        })
      })

      // Listen for vertex data changes
      subscriber.on('setVertexDataValue', (data) => {
        worker.postMessage({
          'event': 'setVertexDataValue',
          'payload': data
        })
      })

      // Listen for edge data changes
      subscriber.on('setEdgeDataValue', (data) => {
        worker.postMessage({
          'event': 'setEdgeDataValue',
          'payload': data
        })
      })

      // Listen to worker messages
      worker.addEventListener('message', function(e) {
        switch(e.data.event) {
          case 'truncate':
            subscriber.emit('truncate')
            break;
          case 'addVertexFromData':
            subscriber.emit('addVertexFromData', e.data.payload)
            break;
          case 'addEdgeFromData':
            subscriber.emit('addEdgeFromData', e.data.payload)
            break;
          case 'removeVertexById':
            subscriber.emit('removeVertexById', e.data.payload)
            break;
          case 'removeEdgeById':
            subscriber.emit('removeEdgeById', e.data.payload)
            break;
          case 'setVertexDataValue':
            subscriber.emit('setVertexDataValue', e.data.payload)
            break;
          case 'setEdgeDataValue':
            subscriber.emit('setEdgeDataValue', e.data.payload)
            break;
        }
      }, false)

    }
  },

  thread: {
    install (wanderer) {

      var thread = wanderer.require('thread')
      var graph = wanderer.require('graph')

      console.log('Hello from worker thread')

      // graph.on('addVertexFromData', () => {
      //
      // })

      thread.addEventListener('message', function(e) {
        switch(e.data.event) {
          case 'truncate':
            // subscriber.emit('truncate')
            break;
          case 'addVertexFromData':
            // subscriber.emit('addVertexFromData', e.data.payload)
            break;
          case 'addEdgeFromData':
            // subscriber.emit('addEdgeFromData', e.data.payload)
            break;
          case 'removeVertexById':
            // subscriber.emit('removeVertexById', e.data.payload)
            break;
          case 'removeEdgeById':
            // subscriber.emit('removeEdgeById', e.data.payload)
            break;
          case 'setVertexDataValue':
            // subscriber.emit('setVertexDataValue', e.data.payload)
            break;
          case 'setEdgeDataValue':
            // subscriber.emit('setEdgeDataValue', e.data.payload)
            break;
        }
      }, false);


    }
  }

}
