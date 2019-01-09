import WandererStoreSingleton from 'wanderer-store-singleton'
import WandererCytoscapeSingleton from 'wanderer-cytoscape-singleton'
const uuidv4 = require('uuid/v4');

// Bei dieser Klasse geht es nur darum einen Singleton zu haben, den ich dann später in Vue injecten kann, aber auch an die Plugins weitergeben kann.
// Es geht darum von vielen Orten auf diese Methoden zugreifen zu können
// Daraus könnte ich auch ein Extra Pack machen. Dieses bracuht aber dann zumindest den Store und Cytoscape.
// Damit ich die nicht injecten muss, könnte ich auch aus dem Store ein Singleton machen
// Das gleiche gilt dann auch für den Wanderer Builder
export default (function () {

  // This configurtaion of babel does not support static properties
  // So I switched back to a self executing function class

  var vertexCollections = {}
  var edgeCollections = {}

  var hooks = {}

  // static cytoscape = null;
  // static store = null;

  // static init (cytoscape, store) {
  //   this.cytoscape = cytoscape
  //   this.store = store
  // }

  // Try to load config file if exists
  // console.log(__dirname)
  // try {
  //   // var configuration = require('wanderer.config.json');
  // } catch (ex) {
  //     throw ('No wanderer configuration file was found')
  // }

  function on(hookName,method){
    if(hooks[hookName] === undefined){
      hooks[hookName] = []
    }
    hooks[hookName].push(method)
  }

  function trigger(hookName, payload){
    if(hooks[hookName] !== undefined){
      for(let i in hooks[hookName]){
        hooks[hookName][i](payload)
      }
    }
  }

  function registerVertexCollection (name, configuration) {
    vertexCollections[name] = configuration // Register the collection
  }

  function registerEdgeCollection (name, configuration) {
    edgeCollections[name] = configuration // Register the collection
  }

  function getVertexCollections () {
    return vertexCollections
  }

  function getEdgeCollections () {
    return edgeCollections
  }

  function getVertexCollection(name){
    if(vertexCollections[name] === undefined){
      return vertexCollections['default']
    }
    return vertexCollections[name]
  }

  // static getVertexCollectionById(id){
  //   let vertexData = getVertexDataById(id)
  //   if(vertexData){
  //     return getVertexCollection(vertexData._collection)
  //   }
  //   return false
  // }

  function getEdgeCollection(name){
    if(edgeCollections[name] === undefined){
      return edgeCollections['default']
    }
    return edgeCollections[name]
  }

  // Warum nicht direkt an den Store?
  // getVertexData(id){
  //   if(this.store.state.wanderer.vertexDocumentData[id] !== undefined){
  //     return this.store.state.wanderer.vertexDocumentData[id]
  //   }
  //   return false
  // },

  function addVertex (vertexData) {

    let collection = getVertexCollection(vertexData._collection)

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
    let newCyVertex = WandererCytoscapeSingleton.cy.add({
      data: data,
      position: position,
      classes: collection.builder.cytoscapeClasses
    })

    // Convert data to Cytoscape if needed
    toCytoscape(vertexData)

    // Add data to store
    WandererStoreSingleton.store.commit('wanderer/addVertex', vertexData)

    trigger('afterAddVertex');
  }

  function addEdge (edgeData) {

    let collection = getEdgeCollection(edgeData._collection)

    WandererCytoscapeSingleton.cy.add({
      data: {
        id: edgeData._id, //Set required cytoscape id
        source: edgeData._from, //Set cytoscape source
        target: edgeData._to //Set cytoscape target
      },
      classes: collection.builder.cytoscapeClasses
    });

    // Add data to store
    WandererStoreSingleton.store.commit('wanderer/addEdge', edgeData)

    trigger('afterAddEdge');
  }

  function removeVertex (vertexId) {
    let vertex = WandererCytoscapeSingleton.cy.getElementById(vertexId)

    // Remove from cy
    vertex.remove()

    // Remove from store
    WandererStoreSingleton.store.commit('wanderer/removeVertex', vertexId)

    trigger('afterRemoveVertex');
  }

  function removeEdge (edgeId) {
    let edge = WandererCytoscapeSingleton.cy.getElementById(edgeId)

    // Remove from cy
    edge.remove();

    // Remove from store
    WandererStoreSingleton.store.commit('wanderer/removeEdge', edgeId)

    trigger('afterRemoveEdge');
  }

  function load (data) {

    // Clean cy
    WandererCytoscapeSingleton.cy.remove( '*' )

    // Clean store
    WandererStoreSingleton.store.commit('wanderer/truncate')

    // Load vertices
    for (var key in data.vertices) {
      this.addVertex(data.vertices[key])
    }

    // Load edges
    for (var key in data.edges) {
      this.addEdge(data.edges[key])
    }
  }

  function getVertexValue (vertexId, key) {
    if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId] !== undefined){
      return WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key]
    }
  }

  function getTranslatableVertexValue (vertexId, key) {
    if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId] !== undefined){
      if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key] !== undefined){
        return WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key][WandererStoreSingleton.store.state.wanderer.currentLanguage]
      }
    }
  }

  function toCytoscape (vertexData) {
    let cytoscapeData = {}
    let collection = getVertexCollection(vertexData._collection)
    if(collection.toCytoscape !== undefined){
      cytoscapeData = collection.toCytoscape(vertexData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
    }
    cytoscapeData.id = vertexData._id; // You cannot override the id
    let vertex = WandererCytoscapeSingleton.cy.getElementById(vertexData._id)
    vertex.data(cytoscapeData)
  }

  function generateId () {
    return uuidv4()
  }

  function traverse (nodeId, visitorData) {
    if (nodeId == undefined) {
      var nodeId = WandererStoreSingleton.store.state.wanderer.vertexDocumentIds[0]
    }

    // Get node data
    let currentCytoscapeVertex = WandererCytoscapeSingleton.cy.getElementById(nodeId)
    let currentVertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[nodeId]
    let currentVertexCollection = getVertexCollection(currentVertexData._collection)

    var traversalFinished = true;

    if (visitorData == undefined) {
      var visitorData = {
        _visitedEdges: [],
        _visitedVertices: []
      }
      traversalFinished = false;
    }

    // Get edges
    let cytoscapeEdges = currentCytoscapeVertex.connectedEdges()

    // Get outbound edges
    let cytoscapeOutboundEdges = []
    cytoscapeEdges.forEach(function(currentCytoscapeEdge){
      if(currentCytoscapeVertex.id()==currentCytoscapeEdge.data('source')){
        cytoscapeOutboundEdges.push(currentCytoscapeEdge);
      }
    })

    // Get inbound edges
    let cytoscapeInboundEdges = []
    cytoscapeEdges.forEach(function(currentCytoscapeEdge){
      if(currentCytoscapeVertex.id()==currentCytoscapeEdge.data('target')){
        cytoscapeInboundEdges.push(currentCytoscapeEdge);
      }
    })

    // Check for every edge if there is a allowTargetTraversal function that would allow or restrict the traversal of the current vertex
    var traversable = true
    if (cytoscapeInboundEdges.length) {
      for (let i in cytoscapeInboundEdges) {
        let currentCytoscapeEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[cytoscapeInboundEdges[i].id()]
        let currentCytoscapeEdgeCollection = getEdgeCollection(currentCytoscapeEdgeData._collection)
        if(currentCytoscapeEdgeCollection.allowTargetTraversal !== undefined) {
          traversable = currentCytoscapeEdgeCollection.allowTargetTraversal(
            currentCytoscapeVertex,
            currentVertexData,
            cytoscapeInboundEdges[i],
            currentCytoscapeEdgeData,
            WandererStoreSingleton.store.state.wanderer.currentLanguage
          )
        }
      }
    }

    if (traversable) {
      // Remember this vertex as visited
      visitorData._visitedVertices.push(currentCytoscapeVertex.id())

      // Is there a visitor available for this kind of node?
      if (currentVertexCollection.visitor) {
        currentVertexCollection.visitor(currentCytoscapeVertex, currentVertexData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
      }

      // Are there outbound edges?
      if (cytoscapeOutboundEdges.length) {
        let expandEdges = cytoscapeOutboundEdges
        // Is there a expander available for this kind of node which will alter the expand edges?
        if (currentVertexCollection.expander) {
          expandEdges = currentVertexCollection.expander(currentCytoscapeVertex, currentVertexData, cytoscapeOutboundEdges)
        }
        // expand the edges
        for (let i in expandEdges) {
          // Remember this vertex as visited
          visitorData._visitedEdges.push(expandEdges[i].id())
          // Get edge information
          let EdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[expandEdges[i].id()]
          let EdgeCollection = getEdgeCollection(EdgeData._collection)
          // Call the visitor for this edge
          if (EdgeCollection.visitor) {
            EdgeCollection.visitor(expandEdges[i], EdgeData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
          }
          // traverse the node
          traverse(expandEdges[i].target().id(), visitorData)
        }
      }
    }

    // Is this the first function call in the recursive stack?
    if (!traversalFinished) {
      // Check the flowFinished function for all vertices
      // This function gets executed if all vertice collections decide not to repeat the traversal for the flow
      // This means the program is over
      var flowFinished = false
      let vertexCollections = this.getVertexCollections()
      for (var i in vertexCollections) {
        if (vertexCollections[i].finisher !== undefined) {
          if (!vertexCollections[i].finisher()) {
            flowFinished = false
            break
          }
          flowFinished = true
        }
      }
      if (flowFinished) {
        trigger('flowFinished')
      }

      // Finish the current traversal
      trigger('traversalFinished')
    }

  }

  return {
    on: on,
    trigger: trigger,
    registerVertexCollection: registerVertexCollection,
    registerEdgeCollection: registerEdgeCollection,
    getVertexCollections: getVertexCollections,
    getEdgeCollections: getEdgeCollections,
    getVertexCollection: getVertexCollection,
    getEdgeCollection: getEdgeCollection,
    addVertex: addVertex,
    addEdge: addEdge,
    load: load,
    removeVertex: removeVertex,
    removeEdge: removeEdge,
    getVertexValue: getVertexValue,
    getTranslatableVertexValue: getTranslatableVertexValue,
    toCytoscape: toCytoscape,
    generateId: generateId,
    traverse: traverse
  }

}())
