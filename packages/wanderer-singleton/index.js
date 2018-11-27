const uuidv4 = require('uuid/v4');

// Bei dieser Klasse geht es nur darum einen Singleton zu haben, den ich dann später in Vue injecten kann, aber auch an die Plugins weitergeben kann.
// Es geht darum von vielen Orten auf diese Methoden zugreifen zu können
// Daraus könnte ich auch ein Extra Pack machen. Dieses bracuht aber dann zumindest den Store und Cytoscape.
// Damit ich die nicht injecten muss, könnte ich auch aus dem Store ein Singleton machen
// Das gleiche gilt dann auch für den Wanderer Builder
export default class Wanderer {

  static vertexCollections = {}
  static edgeCollections = {}

  static hooks = {}

  static cytoscape = null;
  static store = null;

  static init (cytoscape, store) {
    this.cytoscape = cytoscape
    this.store = store
  }

  static on(hookName,method){
    if(this.hooks[hookName] === undefined){
      this.hooks[hookName] = []
    }
    this.hooks[hookName].push(method)
  }

  static trigger(hookName, payload){
    if(this.hooks[hookName] !== undefined){
      for(let i in this.hooks[hookName]){
        this.hooks[hookName][i](payload)
      }
    }
  }

  static registerVertexCollection (name, configuration) {
    this.vertexCollections[name] = configuration // Register the collection
  }

  static registerEdgeCollection (name, configuration) {
    this.edgeCollections[name] = configuration // Register the collection
  }

  static getVertexCollections () {
    return this.vertexCollections
  }

  static getEdgeCollections () {
    return this.edgeCollections
  }

  static getVertexCollection(name){
    if(this.vertexCollections[name] === undefined){
      return this.vertexCollections['default']
    }
    return this.vertexCollections[name]
  }

  // static getVertexCollectionById(id){
  //   let vertexData = getVertexDataById(id)
  //   if(vertexData){
  //     return getVertexCollection(vertexData._collection)
  //   }
  //   return false
  // }

  static getEdgeCollection(name){
    if(this.edgeCollections[name] === undefined){
      return this.edgeCollections['default']
    }
    return this.edgeCollections[name]
  }

  // Warum nicht direkt an den Store?
  // getVertexData(id){
  //   if(this.store.state.wanderer.vertexDocumentData[id] !== undefined){
  //     return this.store.state.wanderer.vertexDocumentData[id]
  //   }
  //   return false
  // },

  static addVertex (vertexData) {

    let collection = this.getVertexCollection(vertexData._collection)

    var data = {
      id:vertexData._id, // Set required cytoscape id
    }

    var position = {
      x: vertexData._x,
      y: vertexData._y
    }

    if(vertexData._origin){
      var position = {
        x: 0,
        y: 0
      }
    }

    // Add vertex to Cytoscape
    let newCyVertex = this.cytoscape.cy.add({
      data: data,
      position: position,
      classes: collection.builder.cytoscapeClasses
    })

    // Convert data to Cytoscape if needed
    this.toCytoscape(vertexData)

    // Add data to store
    this.store.commit('wanderer/addVertex', vertexData)

    this.trigger('afterAddVertex');
  }

  static addEdge (edgeData) {

    let collection = this.getEdgeCollection(edgeData._collection)

    this.cytoscape.cy.add({
      data: {
        id: edgeData._id, //Set required cytoscape id
        source: edgeData._from, //Set cytoscape source
        target: edgeData._to //Set cytoscape target
      },
      classes: collection.builder.cytoscapeClasses
    });

    // Add data to store
    this.store.commit('wanderer/addEdge', edgeData)

    this.trigger('afterAddEdge');
  }

  static removeVertex (vertexId) {
    let vertex = this.cytoscape.cy.getElementById(vertexId)

    // Remove from cy
    vertex.remove()

    // Remove from store
    this.store.commit('wanderer/removeVertex', vertexId)

    this.trigger('afterRemoveVertex');
  }

  static removeEdge (edgeId) {
    let edge = this.cytoscape.cy.getElementById(edgeId)

    // Remove from cy
    edge.remove();

    // Remove from store
    this.store.commit('brain/removeEdge', edgeId)

    this.trigger('afterRemoveEdge');
  }

  static toCytoscape (vertexData) {
    let cytoscapeData = {}
    let collection = this.getVertexCollection(vertexData._collection)
    if(collection.toCytoscape !== undefined){
      cytoscapeData = collection.toCytoscape(vertexData)
    }
    cytoscapeData.id = vertexData._id; // You cannot override the id
    let vertex = this.cytoscape.cy.getElementById(vertexData._id)
    vertex.data(cytoscapeData)
  }

  static generateId () {
    return uuidv4()
  }

  static traverse (startId, preExpander, expander, visitor) {

    // Define defaults
    if(!preExpander){
      preExpander = function(edges){
        edges = edges.sort(function(a, b){
          return true
        })
        return edges
      }
    }

    if(!expander){
      expander = function({edge, source, target}){
        return true
      }
    }

    if(!visitor){
      visitor = function({edge, vertex}){
        return vertex
      }
    }

    let visitedEdges = [];
    let visitedVertices = [];

    // Traverse function
    let cycle = function(currentVertex, referringEdge){

      visitedVertices.push(currentVertex.id()) // Remember this vertex as visited

      // Run the visitor function
      visitor({
        referringEdge: referringEdge, // May undefined
        currentVertex: currentVertex
      })

      // Get the edges of the current vertex
      let edges = currentVertex.connectedEdges()

      // Run the preExpander function
      edges = preExpander(edges)

      // For each connected edge
      edges.forEach(function(edge){

        let target = edge.target()

        if(
          currentVertex.id()==edge.data('source') // Follow only outbound edges
          // &&visitedEdges.indexOf(edge.id())==-1 // Visit edge only if it was not visited before
          // &&visitedVertices.indexOf(target.id())==-1 // Visit vertex only if it was not visited before
        ){

          // Run expander for each edge
          // And check if the target should be traversed
          if(expander({
            edge: edge,
            source: edge.source(),
            target: target
          })){

            // Remember this edge as visited
            visitedEdges.push(edge.id())

            // Go into deep first
            cycle(target,edge)

          }
        }

      })

    }

    // Find the start vertex
    let startVertex = this.cytoscape.cy.getElementById( startId );

    // Expand the edges and get the next vertices to visit
    cycle(startVertex);

  }

  static wander (startId, onMessage) {

    this.traverse (startId, preExpander, expander, visitor)

  }

}
