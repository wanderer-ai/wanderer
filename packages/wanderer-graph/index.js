
import WandererNestedData from 'wanderer-nested-data'

class WandererItemList {

  constructor (subscriber) {
    this.itemIds = []
    this.items = {}
    this.subscriber = subscriber
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

  empty (item) {
    this.itemIds = []
    this.items = {}
  }

  each (callback) {
    for (const i in this.itemIds) {
      if(this.items[this.itemIds[i]] != undefined) {
        callback(this.items[this.itemIds[i]])
      }
    }
  }

  sort (key) {
    this.itemIds = this.itemIds.sort(function(a, b) {
      var itemA = this.items[a]
      var itemB = this.items[b]
      if(itemA.has(key) && itemB.has(key)) {
        return itemB.get(key) - itemA.get(key)
      }
    })
  }

}

class WandererItem {

  constructor (data, subscriber) {
    this.data = new WandererNestedData(data)
    this.lifecycle = new WandererNestedData()
    this.collection = new WandererNestedData()
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
    this.inboundEdges = new WandererItemList(subscriber)
    this.outboundEdges = new WandererItemList(subscriber)
    this.subscriber = subscriber
  }

  addInboundEdge (edge) {
    if(! edge instanceof WandererEdge) {
      throw 'Edge must be instance of WandererEdge!';
    }
    this.inboundEdges.add(edge)
  }

  addOutboundEdge (edge) {
    if(! edge instanceof WandererEdge) {
      throw 'Edge must be instance of WandererEdge!';
    }
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
    this.setDataValue('_from', vertex.data.get('_id'))
  }

  setTargetVertex (vertex) {
    this.targetVertex = vertex
    this.setDataValue('_to', vertex.data.get('_id'))
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
    this.vertices = new WandererItemList(subscriber)
    this.edges = new WandererItemList(subscriber)
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

    if(vertex.data.get('_origin')) {
      this.origin = vertex
    }

    this.subscriber.emit('addVertexFromData', data)

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
        vertex.collection = collection
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

    this.subscriber.emit('addEdgeFromData', data)

    return edge
  }

  setVertexDataValue (id, key, value, language) {
    var vertex = this.vertices.getElementById(id)
    if(vertex) {
      vertex.setDataValue(key, value, language)
    }
  }

  setEdgeDataValue (id, key, value, language) {
    var edge = this.edges.getElementById(id)
    if(edge) {
      edge.setDataValue(key, value, language)
    }
  }

  setVertexLifecycleValue (id, key, value) {
    var vertex = this.vertices.getElementById(id)
    if(vertex) {
      vertex.setLifecycleValue(key, value)
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
    this.subscriber.emit('removeVertexById', vertexId)
  }

  removeEdgeById (edgeId) {
    // Find the edge
    var edge = this.edges.getElementById(edgeId)
    // Remove the edge from the source and target vertex
    edge.sourceVertex.outboundEdges.removeElementById(edgeId)
    edge.targetVertex.inboundEdges.removeElementById(edgeId)
    // Remove the edge itself
    this.edges.removeElementById(edgeId)
    this.subscriber.emit('removeEdgeById', edgeId)
  }

  truncate () {
    this.vertices = new WandererItemList(this.subscriber)
    this.edges = new WandererItemList(this.subscriber)
    this.subscriber.emit('truncate')
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
