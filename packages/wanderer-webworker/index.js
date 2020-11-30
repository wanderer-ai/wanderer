
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

      subscriber.on('addVertexFromData', (vertexData) => {
        worker.postMessage({
          'event': 'addVertexFromData',
          'payload': vertexData
        })
      })

      subscriber.on('addEdgeFromData', (edgeData) => {
        worker.postMessage({
          'event': 'addEdgeFromData',
          'payload': edgeData
        })
      })

      subscriber.on('removeVertexById', (vertexId) => {
        worker.postMessage({
          'event': 'removeVertexById',
          'payload': vertexId
        })
      })

      subscriber.on('removeEdgeById', (edgeId) => {
        worker.postMessage({
          'event': 'removeEdgeById',
          'payload': edgeId
        })
      })

      subscriber.on('setVertexDataValue', (data) => {
        worker.postMessage({
          'event': 'setVertexDataValue',
          'payload': data
        })
      })

      subscriber.on('setVertexLifecycleValue', (data) => {
        worker.postMessage({
          'event': 'setVertexLifecycleValue',
          'payload': data
        })
      })

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
          case 'setVertexLifecycleValue':
            subscriber.emit('setVertexLifecycleValue', e.data.payload)
            break;
          case 'setTraversedVertices':
            subscriber.emit('setTraversedVertices', e.data.payload)
            break;
          case 'setTraversedEdges':
            subscriber.emit('setTraversedEdges', e.data.payload)
            break;
        }
      }, false)

    }
  },

  thread: {
    install (wanderer) {

      var thread = wanderer.require('thread')
      var graph = wanderer.require('graph')
      var traversal = wanderer.require('traversal')

      console.log('Hello from worker thread')

      graph.subscriber.on('truncate', (data) => {
        thread.postMessage({
          'event': 'truncate'
        })
      })

      graph.subscriber.on('addVertexFromData', (data) => {
        thread.postMessage({
          'event': 'addVertexFromData',
          'payload': data
        })
      })

      graph.subscriber.on('addEdgeFromData', (data) => {
        thread.postMessage({
          'event': 'addEdgeFromData',
          'payload': data
        })
      })

      graph.subscriber.on('removeVertexById', (id) => {
        thread.postMessage({
          'event': 'removeVertexById',
          'payload': id
        })
      })

      graph.subscriber.on('removeEdgeById', (id) => {
        thread.postMessage({
          'event': 'removeEdgeById',
          'payload': id
        })
      })

      graph.subscriber.on('setVertexDataValue', (data) => {
        thread.postMessage({
          'event': 'setVertexDataValue',
          'payload': data
        })
      })

      graph.subscriber.on('setEdgeDataValue', (data) => {
        thread.postMessage({
          'event': 'setEdgeDataValue',
          'payload': data
        })
      })

      graph.subscriber.on('setVertexLifecycleValue', (data) => {
        thread.postMessage({
          'event': 'setVertexLifecycleValue',
          'payload': data
        })
      })

      traversal.subscriber.on('traversalFinished', (data) => {
        thread.postMessage({
          'event': 'setTraversedVertices',
          'payload': data.traversedVertexIds
        })
        thread.postMessage({
          'event': 'setTraversedEdges',
          'payload': data.traversedEdgeIds
        })
      })

      thread.addEventListener('message', function(e) {
        switch(e.data.event) {
          case 'truncate':
            graph.truncate()
            break;
          case 'addVertexFromData':
            graph.addVertexFromData(e.data.payload)
            break;
          case 'addEdgeFromData':
            graph.addEdgeFromData(e.data.payload)
            break;
          case 'removeVertexById':
            graph.removeVertexById(e.data.payload)
            break;
          case 'removeEdgeById':
            graph.removeEdgeById(e.data.payload)
            break;
          case 'setVertexDataValue':
            graph.setVertexDataValue(e.data.payload.id, e.data.payload.key, e.data.payload.value)
            break;
          case 'setEdgeDataValue':
            graph.setEdgeDataValue(e.data.payload.id, e.data.payload.key, e.data.payload.value)
            break;
          case 'setVertexLifecycleValue':
            graph.setVertexLifecycleValue(e.data.payload.id, e.data.payload.key, e.data.payload.value)
            break;
        }
      }, false);

    }
  }

}
