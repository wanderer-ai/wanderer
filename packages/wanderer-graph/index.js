
class WandererItemList {

  constructor (vertexData) {
    this.itemIds = []
    this.items = {}
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

  empty (item) {
    this.itemIds = []
    this.items = {}
  }

  foreach (callback) {
    for (const i in this.itemIds) {
      callback(this.items[i])
    }
  }

}

class WandererItem {

  constructor (data) {
    this.data = new WandererNestedData(data)
    this.lifecycle = new WandererNestedData()
    this.collection = new WandererNestedData()
  }

}

class WandererVertex extends WandererItem {

  constructor (data) {
    super(data);
    this.inboundEdges = new WandererItemList()
    this.outboundEdges = new WandererItemList()
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

}

class WandererEdge extends WandererItem {

  constructor (data) {
    super(data)
    this.sourceVertex = undefined
    this.targetVertex = undefined
  }

  setSourceVertex (vertex) {
    this.sourceVertex = vertex
    this.setValue('_from', vertex.data.get('_id'))
  }

  setTargetVertex (vertex) {
    this.targetVertex = vertex
    this.setValue('_to', vertex.data.get('_id'))
  }

  getSourceVertex () {
    return this.sourceVertex
  }

  getTargetVertex () {
    return this.targetVertex
  }

}

class WandererGraph {

  constructor (thread) {
    this.collections = {}
    this.vertices = new WandererItemList()
    this.edges = new WandererItemList()
  }

  setCollectionProps (collectionName, key, props) {
    if(this.collections[collectionName] === undefined) {
      this.collections[collectionName] = new WandererNestedData()
    }
    this.collections[collectionName].set(key, props)
  }

  getCollections () {
    return this.collections
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

    var vertex = new WandererVertex(data)

    // Set collection
    if(data._collection !== undefined) {
      if(this.collections[data._collection] !== undefined) {
        vertex.collection = this.collections[data._collection]
      }
    }

    this.vertices.add(vertex)

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

    var edge = new WandererEdge(data)

    if(data._collection !== undefined) {
      if(this.collections[data._collection] !== undefined) {
        vertex.collection = this.collections[data._collection]
      }
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

}

module.exports = WandererGraph
