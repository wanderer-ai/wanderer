import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import Vuex from 'vuex'
const uuidv4 = require('uuid/v4');

cytoscape.use( cxtmenu );

export default class Brain {

  constructor (Vue) {

    this.Vue = Vue;
    this.Vue.use(Vuex)

    this.vertexCollections = {}
    this.edgeCollections = {}
    this.cytoscapeStylesheets = []

    // Initiate vuex store
    this.store = new Vuex.Store({
      state: {
        editVertex: 0
      },
      mutations: {
        setEditVertex (state, id){
          state.editVertex = id
        }
      }
    })

    this.registerVertexCollection('unknown',{
      label: 'Unknown',
      color: '#6C757D',
      cytoscapeClasses: 'unknown-vertex',
      cytoscapeCtxMenuSelector: '.unknown',
      creatable: false,
      defaultFields: {},
      toCytoscape: function(data){
        return {
          label: 'Unknown'
        }
      },
    })

    this.registerEdgeCollection('unknown',{
      label: 'Unknown',
      color: '#6C757D',
      cytoscapeClasses: 'unknown-edge',
      creatable: false,
      defaultFields: {},
      toCytoscape: function(data){
        return {
          label: 'Unknown'
        }
      }
    })

  }

  use (plugin) {
    plugin.install(this)
  }

  commit(name, method, payload){
    this.store.commit(name+'/'+method, payload)
  }

  registerVertexCollection (name, configuration) {
    this.vertexCollections[name] = configuration // Register the collection

    // The following lines will register a custom store in vuex for this collection
    if(configuration.store === undefined){ configuration.store = {} }

    // Prepare options
    if(configuration.store.state === undefined){ configuration.store.state = {} }
    if(configuration.store.mutations === undefined){ configuration.store.mutations = {} }

    configuration.store.state.documentIds = []; // Array for storing the IDs
    configuration.store.state.documentData = {}; // Object for storing the base data for every document

    // This module is always namespaced in vuex
    configuration.store.namespaced = true;

    // Convert user defined add mutation into a hook function
    if(configuration.store.mutations.add !== undefined){
      // Use it as hook
      var addHook = configuration.store.mutations.add
    }

    // Create the ADD mutation
    configuration.store.mutations.add = function(state, documentData){
      // Execute hook function
      if(addHook !== undefined){
        addHook(state, documentData)
      }
      // Push document id
      state.documentIds.push(documentData._id)
      // Push basic document data
      state.documentData[documentData._id] = {
        _id: documentData._id,
        _collection: documentData._collection,
        _isOrigin: documentData._isOrigin,
        _x: documentData._x,
        _y: documentData._y
      }
    }

    // Register the store in vuex
    this.store.registerModule(name, configuration.store)
  }

  registerEdgeCollection (name, configuration) {
    this.edgeCollections[name] = configuration // Register the collection
  }

  getVertexCollection(name){
    if(this.vertexCollections[name] === undefined){
      return this.vertexCollections['unknown']
    }
    return this.vertexCollections[name]
  }

  getVertexDataById(id){
    for(var c in this.vertexCollections){ // For each collection
      if(this.vertexCollections.hasOwnProperty(c)){
        if(this.store.state[c].documentData[id] !== undefined){
          return this.store.state[c].documentData[id]
        }
      }
    }
    return false
  }

  getVertexCollectionById(id){
    let vertexData = this.getVertexDataById(id)
    if(vertexData){
      return this.getVertexCollection(vertexData._collection)
    }
    return false
  }

  getEdgeCollection(name){
    if(this.edgeCollections[name] === undefined){
      return this.edgeCollections['unknown']
    }
    return this.edgeCollections[name]
  }

  // Extra initiation is important because we may have to wait for a dom element if cy runs not headless
  initCytoscape (config) {

    if(typeof this.cy === 'undefined'){

      var brain = this

      this.cy = cytoscape(config)

      // Apply the style
      this.cy.style(this.cytoscapeStylesheets)

      // Init ctx menus for the different types of vertices
      // For each vertex collection
      for(var fromCollectionName in this.vertexCollections){
        if (this.vertexCollections.hasOwnProperty(fromCollectionName)) {

          let cxtmenuCommands = []; // an array of commands to list in the menu or a function that returns the array

          let possibleOutgoingCollections = this.getPossibleOutgoingCollections(fromCollectionName)
          for(let i in possibleOutgoingCollections){
            (function(possibleOutgoingVertexCollection, possibleOutgoingEdgeCollection, parent) {
              cxtmenuCommands.push({
                fillColor: parent.vertexCollections[possibleOutgoingVertexCollection].color,
                content: 'add '+parent.vertexCollections[possibleOutgoingVertexCollection].label,
                select: function(vertex){
                  vertex.trigger('append', {
                    vertexCollectionName: possibleOutgoingVertexCollection,
                    edgeCollectionName: possibleOutgoingEdgeCollection
                  })
                }
              });
            })(possibleOutgoingCollections[i].to, possibleOutgoingCollections[i].through[0], this);
          }

          // Add general add more function
          // cxtmenuCommands.push({
          //   fillColor: '#6C757D',
          //   content: 'More',
          //   select: function(vertex){
          //
          //   }
          // });

          // Add new context menu
          this.cy.cxtmenu( {
            menuRadius: 150, // the radius of the circular menu in pixels
            selector: this.vertexCollections[fromCollectionName].cytoscapeCtxMenuSelector, // elements matching this Cytoscape.js selector will trigger cxtmenus
            commands: cxtmenuCommands, // function( ele ){ return [ /*...*/ ] }, // example function for commands
            fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
            activeFillColor: 'rgba(92, 194, 237, 0.75)', // the colour used to indicate the selected command
            activePadding: 20, // additional size in pixels for the active command
            indicatorSize: 24, // the size in pixels of the pointer to the active command
            separatorWidth: 3, // the empty spacing in pixels between successive commands
            spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
            minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
            maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
            openMenuEvents: 'cxttapstart', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
            //openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
            itemColor: 'black', // the colour of text in the command's content
            //itemTextShadowColor: 'black', // the text shadow colour of the command's content
            zIndex: 9999, // the z-index of the ui div
            atMouse: false // draw menu at mouse position
          });

        }
      }

      // Implement dbl click
      var clickedBefore;
      var clickedTimeout;
      this.cy.on('click', function(event) {
        var tappedNow = event.target;
        if (clickedTimeout && clickedBefore) {
          clearTimeout(clickedTimeout);
        }
        if(clickedBefore === tappedNow) {
          tappedNow.trigger('dblclick');
          clickedBefore = null;
        } else {
          clickedTimeout = setTimeout(function(){ clickedBefore = null; }, 300);
          clickedBefore = tappedNow;
        }
      });

      // Edit vertex
      this.cy.on('dblclick','node', function(){
        brain.store.commit('setEditVertex',this.id())
      });

      // Unselect nodes
      this.cy.on('unselect', 'node', function(evt){
        brain.store.commit('setEditVertex',0)
      });

      // Append event
      this.cy.on('append', 'node', function(evt, {vertexCollectionName, edgeCollectionName}){
        brain.append(this.id(), vertexCollectionName, edgeCollectionName)
      })

    }
  }

  append(cytoscapeNodeId, vertexCollectionName, edgeCollectionName){
    this.initCytoscape()

    // Deep clone the default fields
    let newVertexData = JSON.parse(JSON.stringify(this.vertexCollections[vertexCollectionName].defaultFields))
    let newEdgeData = JSON.parse(JSON.stringify(this.edgeCollections[edgeCollectionName].defaultFields))

    // Get the position of the source vertex
    let position = this.cy.getElementById( cytoscapeNodeId ).position()

    // Add base data
    newVertexData._id = uuidv4()
    newVertexData._collection = vertexCollectionName
    newVertexData._isOrigin = false
    newVertexData._x = position.x + 100
    newVertexData._y = position.y + 100

    newEdgeData._id = uuidv4()
    newEdgeData._from = cytoscapeNodeId
    newEdgeData._to = newVertexData._id
    newEdgeData._collection = edgeCollectionName

    this.addVertex(newVertexData)
    this.addEdge(newEdgeData)

  }

  isAllowedOutgoingConnection(fromCollectionName, toCollectionName, throughCollectionName = false){
    // If the from collection restricts the outgoing connections
    if(this.vertexCollections[fromCollectionName].restrictOutgoingConnections !== undefined){
      // Search for the requested connection in the allowed connections of the collection
      for(var i in this.vertexCollections[fromCollectionName].restrictOutgoingConnections){
        if(this.vertexCollections[fromCollectionName].restrictOutgoingConnections[i].to == toCollectionName){
          // Check the edge too
          if(throughCollectionName){
            if(this.vertexCollections[fromCollectionName].restrictOutgoingConnections[i].through == throughCollectionName){
              // Return true if the target collection and the edge are allowed
              return true;
            }
          // Drop the edge check
          }else{
            // Return true if the target collection is allowed
            return true;
          }
        }
      }
      // Always return false if the outgoing connections are restricted and no rule matches
      return false;
    }
    // Always return true if the outgoing connections are not restricted
    return true;
  }

  isAllowedIncommingConnection(toCollectionName, fromCollectionName, throughCollectionName = false){
    // If the to collection restricts the incomming connections
    if(this.vertexCollections[toCollectionName].restrictIncommingConnections !== undefined){
      // Search for the requested connection in the allowed connections of the collection
      for(var i in this.vertexCollections[toCollectionName].restrictIncommingConnections){
        if(this.vertexCollections[toCollectionName].restrictIncommingConnections[i].from == fromCollectionName){
          // Check the edge too
          if(throughCollectionName){
            if(this.vertexCollections[toCollectionName].restrictIncommingConnections[i].through == throughCollectionName){
              // Return true if the from collection and the edge are allowed
              return true;
            }
          // Drop the edge check
          }else{
            // Return true if the from collection is allowed
            return true;
          }
        }
      }
      // Always return false if the incomming connections are restricted and no rule matches
      return false;
    }
    // Always return true if the incomming connections are not restricted
    return true;
  }

  getPossibleOutgoingCollections(fromCollectionName){
    var possibleOutgoingCollections = []
    // For each possible target node
    for(var toCollectionName in this.vertexCollections){
      if (this.vertexCollections.hasOwnProperty(toCollectionName)) {
        if(this.vertexCollections[toCollectionName].creatable){

          var possibleOutgoingCollection = {
            to: toCollectionName,
            through: []
          }

          for(var throughCollectionName in this.edgeCollections){
            if (this.edgeCollections.hasOwnProperty(throughCollectionName)) {
              if(this.edgeCollections[throughCollectionName].creatable){
                if(
                  this.isAllowedOutgoingConnection(fromCollectionName, toCollectionName, throughCollectionName)&&
                  this.isAllowedIncommingConnection(toCollectionName, fromCollectionName, throughCollectionName)
                ){
                  possibleOutgoingCollection.through.push(throughCollectionName)
                }
              }
            }
          }

          // If this possible outgoing connection has possible hideEdgesOnViewport
          if(possibleOutgoingCollection.through.length){
            possibleOutgoingCollections.push(possibleOutgoingCollection)
          }
        }
      }
    }
    return possibleOutgoingCollections
  }

  destroy () {
    this.initCytoscape()
    this.cy.destroy()
  }

  addCytoscapeStylesheet(stylesheet){
    this.cytoscapeStylesheets = this.cytoscapeStylesheets.concat(stylesheet)
  }

  addVertex(vertexData){
    this.initCytoscape()

    let collection = this.getVertexCollection(vertexData._collection)

    var data = {
      id:vertexData._id, // Set required cytoscape id
    };

    var position = {
      x: vertexData._x,
      y: vertexData._y
    };

    if(vertexData._origin){
      var position = {
        x: 0,
        y: 0
      };
    }

    // Add vertex to Cytoscape
    let newCyVertex = this.cy.add({
      data: data,
      position: position,
      classes: collection.cytoscapeClasses
    });

    // Convert data to Cytoscape
    this.toCytoscape(vertexData)

    // Add data to store
    this.commit(vertexData._collection, 'add', vertexData)

  }

  addEdge(edgeData){

    let collection = this.getEdgeCollection(edgeData._collection)

    this.cy.add({
      data: {
        id: edgeData._id, //Set required cytoscape id
        source: edgeData._from, //Set cytoscape source
        target: edgeData._to //Set cytoscape target
      },
      classes: collection.cytoscapeClasses
    });

  }

  toCytoscape(vertexData){
    this.initCytoscape()
    let cytoscapeData = {}
    let collection = this.getVertexCollection(vertexData._collection);
    if(collection.toCytoscape !== undefined){
      cytoscapeData = collection.toCytoscape(vertexData);
    }
    cytoscapeData.id = vertexData._id; // You cannot override the id
    let vertex = this.cy.getElementById(vertexData._id);
    vertex.data(cytoscapeData);
  }

}
