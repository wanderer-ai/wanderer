
import WandererNestedData from 'wanderer-nested-data'

class WandererItemList {

  constructor (items) {
    this.itemIds = []
    this.items = {}

    if(items != undefined) {
      this.itemIds = Object.keys(items)
      this.items = items
    }
  }

  add (item) {
    this.itemIds.push(item.data.get('_id'))
    this.items[item.data.get('_id')] = item
  }

  getElementById (id) {
    if(this.items[id] !== undefined) {
      return this.items[id]
    }
    return false
  }

  removeElementById (id) {
    if(this.items[id] !== undefined) {
      delete this.items[id]
      return true
    }
    return false
  }

  empty () {
    this.itemIds = []
    this.items = {}
  }

  each (callback) {
    for (const i in this.itemIds) {
      if(this.items[this.itemIds[i]] != undefined) {
        let returnValue = callback(this.items[this.itemIds[i]])
        if(returnValue === false) {
          break
        }
      }
    }
  }

  // Return a new sorted list
  sort (key) {

    // Sort the item array into a new one
    var sortedItemIds = this.itemIds.sort((a, b) => {
      var itemA = this.items[a]
      var itemB = this.items[b]
      if(itemA != undefined && itemB != undefined) {
        if(itemA.data.has(key) && itemB.data.has(key)) {
          return itemB.data.get(key) - itemA.data.get(key)
        }
      }
    })

    // Create a new item list
    var newList = new WandererItemList()

    // Push the sorted items to the new list
    for (const i in sortedItemIds) {
      if(this.items[sortedItemIds[i]] != undefined) {
        newList.add(this.items[sortedItemIds[i]])
      }
    }

    return newList

  }

  clone () {
    // Clone the data
    return new WandererItemList({ ...this.items })
  }

}

class WandererItem {

  constructor (data, subscriber) {
    this.data = new WandererNestedData(data)
    this.lifecycle = new WandererNestedData()
    this.collection = new WandererNestedData()
    this.collectionName = undefined
    this.subscriber = subscriber
  }

  setDataValue (key, value, language) {
    if(language !== undefined) {
      this.data.set(key+'.'+language, value)
    } else {
      this.data.set(key, value)
    }
  }

  setLifecycleValue (key, value) {
    this.lifecycle.set(key, value)
  }

}

class WandererVertex extends WandererItem {

  constructor (data, subscriber) {
    super(data, subscriber);
    this.inboundEdges = new WandererItemList()
    this.outboundEdges = new WandererItemList()
    this.subscriber = subscriber
  }

  addInboundEdge (edge) {
    // if(! edge instanceof WandererEdge) {
    //   throw 'Edge must be instance of WandererEdge!';
    // }
    this.inboundEdges.add(edge)
  }

  addOutboundEdge (edge) {
    // if(! edge instanceof WandererEdge) {
    //   throw 'Edge must be instance of WandererEdge!';
    // }
    this.outboundEdges.add(edge)
  }

  getOutboundEdges () {
    return this.outboundEdges
  }

  getInboundEdges () {
    return this.inboundEdges
  }

  setDataValue (key, value, language) {
    super.setDataValue(key, value, language)

    this.subscriber.emit('setVertexDataValue', {
      id: this.data.get('_id'),
      key: key,
      value: value,
      language: language
    })
  }

  setLifecycleValue (key, value) {
    super.setLifecycleValue(key, value)

    this.subscriber.emit('setVertexLifecycleValue', {
      id: this.data.get('_id'),
      key: key,
      value: value
    })

  }

}

class WandererEdge extends WandererItem {

  constructor (data, subscriber) {
    super(data)
    this.sourceVertex = undefined
    this.targetVertex = undefined
    this.subscriber = subscriber
  }

  setSourceVertex (vertex) {
    this.sourceVertex = vertex
    // Note: Use super here because I dont want to trigger the emit
    super.setDataValue('_from', vertex.data.get('_id'))
  }

  setTargetVertex (vertex) {
    this.targetVertex = vertex
    // Note: Use super here because I dont want to trigger the emit
    super.setDataValue('_to', vertex.data.get('_id'))
  }

  getSourceVertex () {
    return this.sourceVertex
  }

  getTargetVertex () {
    return this.targetVertex
  }

  setDataValue (key, value, language) {
    super.setDataValue(key, value, language)

    this.subscriber.emit('setEdgeDataValue', {
      id: this.data.get('_id'),
      key: key,
      value: value,
      language: language
    })

  }

  setLifecycleValue (key, value) {
    super.setLifecycleValue(key, value)

    this.subscriber.emit('setEdgeLifecycleValue', {
      id: this.data.get('_id'),
      key: key,
      value: value
    })

  }

}

class WandererGraph {

  constructor (subscriber) {
    this.vertexCollectionProps = new WandererNestedData()
    this.edgeCollectionProps = new WandererNestedData()
    this.vertices = new WandererItemList()
    this.edges = new WandererItemList()
    this.subscriber = subscriber
    this.origin = undefined

    // Listen for new vertex collection props
    this.subscriber.on('addVertexCollectionProps', ({name, props}) => {
      props = new WandererNestedData(props)
      props.with('graph', (props) => {
        this.vertexCollectionProps.set(name, props)
      })
    })

    // Listen for new edge collection props
    this.subscriber.on('addEdgeCollectionProps', ({name, props}) => {
      props = new WandererNestedData(props)
      props.with('graph', (props) => {
        this.edgeCollectionProps.set(name, props)
      })
    })

    this.subscriber.on('truncate', () => {
      this.truncate()
    })

    this.subscriber.on('resetLifecycle', () => {
      this.resetLifecycle()
    })

    this.subscriber.on('addVertexFromData', (data) => {
      this.addVertexFromData(data)
    })

    this.subscriber.on('addEdgeFromData', (data) => {
      this.addEdgeFromData(data)
    })

    this.subscriber.on('removeVertexById', (id) => {
      this.removeVertexById(id)
    })

    this.subscriber.on('removeEdgeById', (id) => {
      this.removeEdgeById(id)
    })

    this.subscriber.on('setVertexDataValue', ({id, key, value, language}) => {
      this.setVertexDataValue(id, key, value, language)
    })

    this.subscriber.on('setEdgeDataValue', ({id, key, value, language}) => {
      this.setEdgeDataValue(id, key, value, language)
    })

    this.subscriber.on('setVertexLifecycleValue', ({id, key, value}) => {
      this.setVertexLifecycleValue(id, key, value)
    })

  }

  getOrigin () {
    return this.origin
  }

  getVertices () {
    return this.vertices
  }

  getEdges () {
    return this.edges
  }

  addVertexFromData (data) {

    if(data._id === undefined) {
      throw 'Vertices constructed from data must have a unique id (_id)!';
    }

    if(data._collection === undefined) {
      throw 'Vertices constructed from data must have a collection (_collection)!';
    }

    var vertex = new WandererVertex(data, this.subscriber)

    // Set collection
    if(data._collection !== undefined) {
      this.vertexCollectionProps.with(data._collection, (collection) => {
        vertex.collection = collection
      })
    }

    this.vertices.add(vertex)

    // Mark the first created origin as the main origin
    if(vertex.data.is('_origin')&&!vertex.data.is('_foreign')) {
      this.origin = vertex
    }

    return vertex
  }

  addEdgeFromData (data) {

    if(data._id === undefined) {
      throw 'Edges constructed from data must have a unique id (_id)!';
    }

    if(data._from === undefined) {
      throw 'Edges constructed from data must have a source id (_from)!';
    }

    if(data._to === undefined) {
      throw 'Edges constructed from data must have a target id (_to)!';
    }

    var edge = new WandererEdge(data, this.subscriber)

    // Set collection
    if(data._collection !== undefined) {
      this.edgeCollectionProps.with(data._collection, (collection) => {
        edge.collection = collection
      })
    }

    var sourceVertex = this.vertices.getElementById(data._from)
    var targetVertex = this.vertices.getElementById(data._to)

    if(!sourceVertex) {
      throw 'Cannot add edge! The source vertex with id '+data._from+' was not found.';
    }

    if(!targetVertex) {
      throw 'Cannot add edge! The target vertex with id '+data._to+' was not found.';
    }

    edge.setSourceVertex(sourceVertex)
    edge.setTargetVertex(targetVertex)

    sourceVertex.addOutboundEdge(edge)
    targetVertex.addInboundEdge(edge)

    this.edges.add(edge)

    return edge
  }

  setVertexDataValue (id, key, value, language) {
    var vertex = this.vertices.getElementById(id)
    if(vertex) {
      vertex.data.set(key, value, language)
    }
  }

  setEdgeDataValue (id, key, value, language) {
    var edge = this.edges.getElementById(id)
    if(edge) {
      edge.data.set(key, value, language)
    }
  }

  setVertexLifecycleValue (id, key, value) {
    var vertex = this.vertices.getElementById(id)
    if(vertex) {
      vertex.lifecycle.set(key, value)
    }
  }

  removeVertexById (vertexId) {
    // Find the vertex
    var vertex = this.vertices.getElementById(vertexId)
    // Remove all connected edges
    vertex.inboundEdges.each((edge) => {
      this.removeEdgeById(edge.data.get('_id'))
    })
    vertex.outboundEdges.each((edge) => {
      this.removeEdgeById(edge.data.get('_id'))
    })
    // Remove the vertex itself
    this.vertices.removeElementById(vertexId)
    // this.subscriber.emit('removeVertexById', vertexId)
  }

  removeEdgeById (edgeId) {
    // Find the edge
    var edge = this.edges.getElementById(edgeId)
    // Remove the edge from the source and target vertex
    edge.sourceVertex.outboundEdges.removeElementById(edgeId)
    edge.targetVertex.inboundEdges.removeElementById(edgeId)
    // Remove the edge itself
    this.edges.removeElementById(edgeId)
    // this.subscriber.emit('removeEdgeById', edgeId)
  }

  truncate () {
    this.origin = undefined
    this.vertices = new WandererItemList()
    this.edges = new WandererItemList()
    // this.subscriber.emit('truncate')
  }

  resetLifecycle () {
    this.vertices.each((vertex) => {
      vertex.lifecycle.empty()
    })
    this.edges.each((edge) => {
      edge.lifecycle.empty()
    })
    this.removeForeignData()
  }

  removeForeignData () {
    this.vertices.each((vertex) => {
      if(vertex.data.is('_foreign')) {
        this.removeVertexById(vertex.data.get('_id'))

        // Lets emit this in here
        // So I dont have to delete the data from the other modules manually (builder, cytoscape, ...)
        this.subscriber.emit('removeVertexById', vertex.data.get('_id'))
      }
    })
    this.edges.each((edge) => {
      if(edge.data.is('_foreign')) {
        this.removeEdgeById(edge.data.get('_id'))

        // Lets emit this in here
        // So I dont have to delete the data from the other modules manually (builder, cytoscape, ...)
        this.subscriber.emit('removeEdgeById', edge.data.get('_id'))
      }
    })
  }

  createItemList (items) {
    return new WandererItemList(items)
  }

}

export default {
  install (wanderer) {

    // Require the broadcast
    var broadcast = wanderer.require('broadcast')

    // Register a subscriber
    var subscriber = broadcast.subscribe('graph')

    // Create a new graph instance
    var wandererGraph = new WandererGraph(subscriber)

    // Provide the graph
    wanderer.provide('graph', wandererGraph)

  }
}
