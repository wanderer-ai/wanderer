export let client = {
  install (wanderer) {

    var worker = wanderer.require('worker')
    var broadcast = wanderer.require('broadcast')

    // Register a subscriber
    var subscriber = broadcast.subscribe('worker-client')

    subscriber.on('truncate', () => {
      worker.postMessage({
        'event': 'truncate'
      })
    })

    subscriber.on('resetLifecycle', () => {
      worker.postMessage({
        'event': 'resetLifecycle'
      })
    })

    subscriber.on('setCurrentUrl', (url) => {
      worker.postMessage({
        'event': 'setCurrentUrl',
        'payload': url
      })
    })

    subscriber.on('setLanguage', (language) => {
      worker.postMessage({
        'event': 'setLanguage',
        'payload': language
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
        case 'resetLifecycle':
          subscriber.emit('resetLifecycle')
          break;
        case 'setLanguage':
          subscriber.emit('setLanguage', e.data.payload)
          break;
        case 'setCurrentUrl':
          subscriber.emit('setCurrentUrl', e.data.payload)
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
}

export let thread = {
  install (wanderer) {

    var thread = wanderer.require('thread')
    var broadcast = wanderer.require('broadcast')

    // Register a subscriber
    var subscriber = broadcast.subscribe('worker-thread')

    subscriber.on('truncate', () => {
      thread.postMessage({
        'event': 'truncate'
      })
    })

    subscriber.on('resetLifecycle', () => {
      thread.postMessage({
        'event': 'resetLifecycle'
      })
    })

    subscriber.on('setLanguage', (language) => {
      thread.postMessage({
        'event': 'setLanguage',
        'payload': language
      })
    })

    subscriber.on('setCurrentUrl', (url) => {
      thread.postMessage({
        'event': 'setCurrentUrl',
        'payload': url
      })
    })

    subscriber.on('addVertexFromData', (data) => {
      thread.postMessage({
        'event': 'addVertexFromData',
        'payload': data
      })
    })

    subscriber.on('addEdgeFromData', (data) => {
      thread.postMessage({
        'event': 'addEdgeFromData',
        'payload': data
      })
    })

    subscriber.on('removeVertexById', (id) => {
      thread.postMessage({
        'event': 'removeVertexById',
        'payload': id
      })
    })

    subscriber.on('removeEdgeById', (id) => {
      thread.postMessage({
        'event': 'removeEdgeById',
        'payload': id
      })
    })

    subscriber.on('setVertexDataValue', (data) => {
      thread.postMessage({
        'event': 'setVertexDataValue',
        'payload': data
      })
    })

    subscriber.on('setEdgeDataValue', (data) => {
      thread.postMessage({
        'event': 'setEdgeDataValue',
        'payload': data
      })
    })

    subscriber.on('setVertexLifecycleValue', (data) => {
      thread.postMessage({
        'event': 'setVertexLifecycleValue',
        'payload': data
      })
    })

    subscriber.on('traversalFinished', (data) => {
      thread.postMessage({
        'event': 'setTraversedVertices',
        'payload': data.activatedVertexIds
      })
      thread.postMessage({
        'event': 'setTraversedEdges',
        'payload': data.activatedEdgeIds
      })
    })

    thread.addEventListener('message', function(e) {
      switch(e.data.event) {
        case 'truncate':
          subscriber.emit('truncate')
          break;
        case 'resetLifecycle':
          subscriber.emit('resetLifecycle')
          break;
        case 'setLanguage':
          subscriber.emit('setLanguage', e.data.payload)
          break;
        case 'setCurrentUrl':
          subscriber.emit('setCurrentUrl', e.data.payload)
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
      }
    }, false);

  }
}
