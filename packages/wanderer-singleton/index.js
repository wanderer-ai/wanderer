import StoreSingleton from 'wanderer-store-singleton'
import CytoscapeSingleton from 'wanderer-cytoscape-singleton'
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

  // static cytoscape = null;
  // static store = null;

  // static init (cytoscape, store) {
  //   this.cytoscape = cytoscape
  //   this.store = store
  // }

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
    let newCyVertex = CytoscapeSingleton.cy.add({
      data: data,
      position: position,
      classes: collection.builder.cytoscapeClasses
    })

    // Convert data to Cytoscape if needed
    this.toCytoscape(vertexData)

    // Add data to store
    StoreSingleton.store.commit('wanderer/addVertex', vertexData)

    this.trigger('afterAddVertex');
  }

  static addEdge (edgeData) {

    let collection = this.getEdgeCollection(edgeData._collection)

    CytoscapeSingleton.cy.add({
      data: {
        id: edgeData._id, //Set required cytoscape id
        source: edgeData._from, //Set cytoscape source
        target: edgeData._to //Set cytoscape target
      },
      classes: collection.builder.cytoscapeClasses
    });

    // Add data to store
    StoreSingleton.store.commit('wanderer/addEdge', edgeData)

    this.trigger('afterAddEdge');
  }

  static removeVertex (vertexId) {
    let vertex = CytoscapeSingleton.cy.getElementById(vertexId)

    // Remove from cy
    vertex.remove()

    // Remove from store
    StoreSingleton.store.commit('wanderer/removeVertex', vertexId)

    this.trigger('afterRemoveVertex');
  }

  static removeEdge (edgeId) {
    let edge = CytoscapeSingleton.cy.getElementById(edgeId)

    // Remove from cy
    edge.remove();

    // Remove from store
    StoreSingleton.store.commit('brain/removeEdge', edgeId)

    this.trigger('afterRemoveEdge');
  }

  static getVertexValue(vertexId, key){
    if(StoreSingleton.store.state.wanderer.vertexDocumentData[vertexId] !== undefined){
      return StoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key]
    }
  }

  static getTranslatableVertexValue(vertexId, key){
    if(StoreSingleton.store.state.wanderer.vertexDocumentData[vertexId] !== undefined){
      return StoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key][StoreSingleton.store.state.wanderer.currentLanguage]
    }
  }

  static toCytoscape (vertexData) {
    let cytoscapeData = {}
    let collection = this.getVertexCollection(vertexData._collection)
    if(collection.toCytoscape !== undefined){
      cytoscapeData = collection.toCytoscape(vertexData, StoreSingleton.store.state.wanderer.currentLanguage)
    }
    cytoscapeData.id = vertexData._id; // You cannot override the id
    let vertex = CytoscapeSingleton.cy.getElementById(vertexData._id)
    vertex.data(cytoscapeData)
  }

  static generateId () {
    return uuidv4()
  }

  static traverse (nodeId, visitorData) {

    // Get node data
    let currentCytoscapeVertex = CytoscapeSingleton.cy.getElementById( nodeId )
    let currentVertexData = StoreSingleton.store.state.wanderer.vertexDocumentData[nodeId]
    let currentVertexCollection = this.getVertexCollection(currentVertexData._collection);

    var traversalFinished = true;

    if(visitorData == undefined){
      var visitorData = {
        _visitedEdges: [],
        _visitedVertices: []
      }
      traversalFinished = false;
    }

    // Remember this vertex as visited
    visitorData._visitedVertices.push(currentCytoscapeVertex.id())

    // Is there a visitor available for this kind of node?
    if(currentVertexCollection.visitor){
      currentVertexCollection.visitor(nodeId, currentVertexData, StoreSingleton.store.state.wanderer.currentLanguage)
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

    // Are there outbound edges?
    if(cytoscapeOutboundEdges.length){
      let expandEdges = cytoscapeOutboundEdges
      // Is there a expander available for this kind of node which will alter the expand edges?
      if(currentVertexCollection.expander){
        expandEdges = currentVertexCollection.expander(nodeId, currentVertexData, cytoscapeOutboundEdges)
      }
      // expand the edges
      for(let i in expandEdges){
        // Remember this vertex as visited
        visitorData._visitedEdges.push(expandEdges[i].id())
        // traverse the node
        this.traverse(expandEdges[i].target().id(), visitorData)
      }
    }

    // Is this the first function call in the recursive stack?
    if(!traversalFinished){
      this.trigger('traversalFinished')
    }


  }


}
