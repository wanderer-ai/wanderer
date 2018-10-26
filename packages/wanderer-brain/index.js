import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
// import Vuex from 'vuex'
const uuidv4 = require('uuid/v4');

cytoscape.use( cxtmenu );

export default class Brain {

  static init (store) {

    // this.Vue = Vue;
    // this.Vue.use(Vuex)

    this.vertexCollections = {}
    this.edgeCollections = {}
    this.cytoscapeStylesheets = []

    var brain = this

    // Initiate vuex store module
    this.store = store
    this.store.registerModule('brain', {
      namespaced: true,
      state: {
        editVertex: 0,
        vertexDocumentIds: [],
        vertexDocumentData: {},
        edgeDocumentIds: [],
        edgeDocumentData: {},
        selectedVertexIds: [],
        selectedEdgeIds: []
      },
      mutations: {
        setEditVertex (state, id) {
          state.editVertex = id
        },
        addVertex (state, documentData) {
          // Push document id
          state.vertexDocumentIds.push(documentData._id)
          // Push document data
          let data = {
            _id: documentData._id,
            _collection: documentData._collection,
            _isOrigin: documentData._isOrigin,
            _x: documentData._x,
            _y: documentData._y
          }
          // Add custom model data
          if(brain.vertexCollections[documentData._collection] !== undefined){
            if(brain.vertexCollections[documentData._collection].models !== undefined){
              for(var i in brain.vertexCollections[documentData._collection].models){
                if(documentData[brain.vertexCollections[documentData._collection].models[i].name] === undefined){
                  if(brain.vertexCollections[documentData._collection].models[i].isMultiLanguage){
                    data[brain.vertexCollections[documentData._collection].models[i].name] = {}
                  }else{
                    data[brain.vertexCollections[documentData._collection].models[i].name] = ''
                  }
                }else{
                  data[brain.vertexCollections[documentData._collection].models[i].name] = documentData[brain.vertexCollections[documentData._collection].models[i].name]
                }
              }
            }
          }
          this._vm.$set(state.vertexDocumentData, documentData._id, data)
        },
        removeVertex (state, vertexId) {
          // Remove id from stack
          state.vertexDocumentIds.splice(state.vertexDocumentIds.indexOf(vertexId), 1)
          // Remove object
          this._vm.$delete(state.vertexDocumentData, vertexId)
        },
        addEdge (state, documentData) {
          // Push document id
          state.edgeDocumentIds.push(documentData._id)
          // Push document data
          let data = {
            _id: documentData._id,
            _collection: documentData._collection,
            _from: documentData._from,
            _to: documentData._to
          }
          this._vm.$set(state.edgeDocumentData, documentData._id, data)
        },
        removeEdge (state, edgeId) {
          // Remove id from stack
          state.edgeDocumentIds.splice(state.edgeDocumentIds.indexOf(edgeId), 1)
          // Remove object
          this._vm.$delete(state.edgeDocumentData, edgeId)
        },
        setVertexDataValue (state, {id, key, value, language}) {
          if(language !== undefined){
            this._vm.$set(state.vertexDocumentData[id][key], language, value)
          }else{
            this._vm.$set(state.vertexDocumentData[id], key, value)
          }
        },
        setSelectedVertexIds (state, verticeIds) {
          // Its important to keep the order of the selected vertics
          // This is the reason why we do not simply replace the array here
          // First add the new vertices that do not exist
          for (let i in verticeIds) {
            if(state.selectedVertexIds.indexOf(verticeIds[i])==-1){
              state.selectedVertexIds.push(verticeIds[i])
            }
          }
          // Than delete the the rest
          for (let i in state.selectedVertexIds) {
            if(verticeIds.indexOf(state.selectedVertexIds[i])==-1){
              state.selectedVertexIds.splice(state.selectedVertexIds.indexOf(state.selectedVertexIds[i]), 1)
            }
          }
        },
        setSelectedEdgeIds (state, edgeIds) {
          state.selectedEdgeIds = edgeIds
        },
        truncate (state) {
          this._vm.$set(state, 'editVertex', 0)
          this._vm.$set(state, 'vertexDocumentIds', [])
          this._vm.$set(state, 'vertexDocumentData', {})
          this._vm.$set(state, 'edgeDocumentIds', [])
          this._vm.$set(state, 'edgeDocumentData', {})
          this._vm.$set(state, 'selectedVertexIds', [])
          this._vm.$set(state, 'selectedEdgeIds', [])
        }
      }
    })

    this.registerVertexCollection('default',{
      label: 'Default',
      color: '#6C757D',
      cytoscapeClasses: 'default-vertex',
      cytoscapeCtxMenuSelector: '.default',
      creatable: false,
      defaultFields: {},
      toCytoscape: function(data){
        return {
          label: 'Default'
        }
      },
    })

    this.registerEdgeCollection('default',{
      label: 'Default',
      color: '#6C757D',
      cytoscapeClasses: 'default-edge',
      creatable: false,
      defaultFields: {},
      toCytoscape: function(data){
        return {
          label: 'Default'
        }
      }
    })

  }

  static use (plugin) {
    plugin.install(this)
  }

  static getEditVertexModel(key, language){
    var brain = this
    return {
      get(){
        if(brain.store.state.brain.editVertex){
          if(brain.store.state.brain.vertexDocumentData[brain.store.state.brain.editVertex] !== undefined){
            if(language !== undefined){
              //console.log(this.$store.state.brain.vertexDocumentData[id][key][language])
              return brain.store.state.brain.vertexDocumentData[brain.store.state.brain.editVertex][key][language]
            }else{
              //console.log(this.$store.state.brain.vertexDocumentData[id][key])
              return brain.store.state.brain.vertexDocumentData[brain.store.state.brain.editVertex][key]
            }
          }
        }
      },
      set(data){
        if(language !== undefined){
          brain.store.commit('brain/setVertexDataValue', {
            id: brain.store.state.brain.editVertex,
            key: key,
            value: data,
            language: language
          })
        }else{
          brain.store.commit('brain/setVertexDataValue', {
            id: brain.store.state.brain.editVertex,
            key: key,
            value: data
          })
        }
      }
    }
  }

  static registerVertexCollection (name, configuration) {
    this.vertexCollections[name] = configuration // Register the collection
  }

  static registerEdgeCollection (name, configuration) {
    this.edgeCollections[name] = configuration // Register the collection
  }

  static getVertexCollection(name){
    if(this.vertexCollections[name] === undefined){
      return this.vertexCollections['default']
    }
    return this.vertexCollections[name]
  }

  static getVertexDataById(id){
    if(this.store.state.brain.vertexDocumentData[id] !== undefined){
      return this.store.state.brain.vertexDocumentData[id]
    }
    return false
  }

  static getVertexCollectionById(id){
    //console.log(id)
    let vertexData = this.getVertexDataById(id)
    if(vertexData){
      return this.getVertexCollection(vertexData._collection)
    }
    return false
  }

  static getEdgeCollection(name){
    if(this.edgeCollections[name] === undefined){
      return this.edgeCollections['default']
    }
    return this.edgeCollections[name]
  }

  // Extra initiation is important because we may have to wait for a dom element if cy runs not headless
  static initCytoscape (config) {

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

      // Select vertices
      this.cy.on('select', 'node', function(evt){
        let lastSelectedVerticesIds = brain.getSelectedVertexIds()
        brain.store.commit('brain/setSelectedVertexIds',lastSelectedVerticesIds);
      });

      // Edit vertex
      this.cy.on('dblclick','node', function(){
        brain.store.commit('brain/setEditVertex',this.id())
      });

      // Unselect vertices
      this.cy.on('unselect', 'node', function(evt){
        let lastSelectedVerticesIds = brain.getSelectedVertexIds()
        brain.store.commit('brain/setSelectedVertexIds',lastSelectedVerticesIds);
      });

      // // Unselect nodes
      // this.cy.on('unselect', 'node', function(evt){
      //   brain.store.commit('brain/setEditVertex',0)
      // });

      // Select edge(s)
      this.cy.on('select', 'edge', function(evt){
        let lastSelectedEdgesIds = brain.getSelectedEdgeIds()
        brain.store.commit('brain/setSelectedEdgeIds',lastSelectedEdgesIds);
      });

      // Unselect edge(s)
      this.cy.on('unselect', 'edge', function(evt){
        let lastSelectedEdgesIds = brain.getSelectedEdgeIds()
        brain.store.commit('brain/setSelectedEdgeIds',lastSelectedEdgesIds);
      });

      // Append event
      this.cy.on('append', 'node', function(evt, {vertexCollectionName, edgeCollectionName}){
        brain.append(this.id(), vertexCollectionName, edgeCollectionName)
      })

      // Implement drop event
      let dropTimer = null;
      this.cy.on('drag', 'node', function(event){
        if(dropTimer){clearTimeout(dropTimer);} // Clear the timeout if set
        // get all grabbed nodes
        var lastGrabbedNodes = brain.cy.$('node:grabbed');
        // Set new timeout
        dropTimer = setTimeout(function(){
          lastGrabbedNodes.forEach(function(vertex){
            vertex.trigger('drop');
          });
        },500);
      });

      // On drop
      this.cy.on('drop','node', function(evt){

        console.log('drop')

        // Check if this is a origin vertex
        // We cannot disable drag for this vertice but we can set it back to 0
        if(brain.store.state.brain.vertexDocumentData[this.id()]._isOrigin){
          this.position({x: 0, y: 0});
        }else{
          let position = this.position(); // get position
          brain.store.commit('brain/setVertexDataValue', {
            id: this.id(),
            key: '_x',
            value: position.x
          })
          brain.store.commit('brain/setVertexDataValue', {
            id: this.id(),
            key: '_y',
            value: position.y
          })
        }
      });

    }
  }

  static getSelectedVertexIds () {
    this.initCytoscape()
    let selectedVertices = this.cy.$('node:selected');
    let selectedVertexIds = [];
    selectedVertices.each(function(vertex){
      selectedVertexIds.push(vertex.id());
    });
    return selectedVertexIds
  }

  static getSelectedEdgeIds() {
    this.initCytoscape()
    let selectedEdges = this.cy.$('edge:selected');
    let selectedEdgeIds = [];
    selectedEdges.each(function(edge){
      selectedEdgeIds.push(edge.id());
    });
    return selectedEdgeIds
  }

  static generateId () {
    return uuidv4();
  }

  static append (cytoscapeNodeId, vertexCollectionName, edgeCollectionName){
    this.initCytoscape()

    // Deep clone the default fields
    let newVertexData = JSON.parse(JSON.stringify(this.vertexCollections[vertexCollectionName].defaultFields))
    let newEdgeData = JSON.parse(JSON.stringify(this.edgeCollections[edgeCollectionName].defaultFields))

    // Get the position of the source vertex
    let position = this.cy.getElementById( cytoscapeNodeId ).position()

    // Add base data
    newVertexData._id = this.generateId()
    newVertexData._collection = vertexCollectionName
    newVertexData._isOrigin = false
    newVertexData._x = position.x + 100
    newVertexData._y = position.y + 100

    newEdgeData._id = this.generateId()
    newEdgeData._from = cytoscapeNodeId
    newEdgeData._to = newVertexData._id
    newEdgeData._collection = edgeCollectionName

    this.addVertex(newVertexData)
    this.addEdge(newEdgeData)

  }

  static isAllowedOutgoingConnection(fromCollectionName, toCollectionName, throughCollectionName = false){
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

  static isAllowedIncommingConnection(toCollectionName, fromCollectionName, throughCollectionName = false){
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

  static getPossibleOutgoingCollections(fromCollectionName){
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

  static destroy () {
    this.initCytoscape()
    this.cy.destroy()
  }

  static addCytoscapeStylesheet(stylesheet){
    this.cytoscapeStylesheets = this.cytoscapeStylesheets.concat(stylesheet)
  }

  static addVertex (vertexData) {
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
    this.store.commit('brain/addVertex', vertexData)

  }

  static removeVertexById (vertexId) {
    let vertex = this.cy.getElementById(vertexId)

    // Remove from cy
    vertex.remove()

    // Remove from store
    this.store.commit('brain/removeVertex', vertexId)

    // Rebuild the selection
    let lastSelectedVerticesIds = this.getSelectedVertexIds()
    this.store.commit('brain/setSelectedVertexIds',lastSelectedVerticesIds);
  }

  static addEdge (edgeData) {

    let collection = this.getEdgeCollection(edgeData._collection)

    this.cy.add({
      data: {
        id: edgeData._id, //Set required cytoscape id
        source: edgeData._from, //Set cytoscape source
        target: edgeData._to //Set cytoscape target
      },
      classes: collection.cytoscapeClasses
    });

    // Add data to store
    this.store.commit('brain/addEdge', edgeData)

  }

  static removeEdgeById (edgeId) {
    let edge = this.cy.getElementById(edgeId)

    // Remove from cy
    edge.remove();

    // Remove from store
    this.store.commit('brain/removeEdge', edgeId)

    // Rebuild the selection
    let lastSelectedEdgesIds = this.getSelectedEdgeIds()
    this.store.commit('brain/setSelectedEdgeIds',lastSelectedEdgesIds);
  }

  static connectById (fromEdgeId, toEdgeId) {
    // Create new edge
    this.addEdge({
      _id: this.generateId(),
      _collection: 'Default',
      _from: fromEdgeId,
      _to: toEdgeId
    });
  }

  static toCytoscape (vertexData) {
    this.initCytoscape()
    let cytoscapeData = {}
    let collection = this.getVertexCollection(vertexData._collection)
    if(collection.toCytoscape !== undefined){
      cytoscapeData = collection.toCytoscape(vertexData)
    }
    cytoscapeData.id = vertexData._id; // You cannot override the id
    let vertex = this.cy.getElementById(vertexData._id)
    vertex.data(cytoscapeData)
  }

}
