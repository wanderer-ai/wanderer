import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import WandererNestedData from 'wanderer-nested-data'

export default class Builder {

  constructor (wanderer, vue, store) {
    this.wanderer = wanderer
    this.vue = vue
    this.store = store
    this.cytoscape = undefined

    this.vertexCollectionProps = new WandererNestedData()
    this.edgeCollectionProps = new WandererNestedData()

    // Listen for new vertex collection props
    this.wanderer.on('addVertexCollectionProps', ({collectionName, props}) => {
      props.with('builder', (builderProps) => {
        this.vertexCollectionProps.set(collectionName, builderProps)
      })
    })

    // Listen for new edge collection props
    this.wanderer.on('addEdgeCollectionProps', ({collectionName, props}) => {
      props.with('builder', (builderProps) => {
        this.edgeCollectionProps.set(collectionName, builderProps)
      })
    })

    // Listen for new vertices
    this.wanderer.on('addVertex', (vertexData) => {
      this.addVertexListener(vertexData)
    })

  }

  getVertexModel (key) {
    return {
      get() {
        if(StoreSingleton.store.state.wanderer.builder.editVertex) {
          if(StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex] !== undefined) {
            return StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex][key]
          }
        }
      },
      set(data) {
        if(data != undefined) {
          StoreSingleton.store.commit('wanderer/setVertexDataValue', {
            id: StoreSingleton.store.state.wanderer.builder.editVertex,
            key: key,
            value: data
          })
        }
      }
    }
  }

  getTranslatableVertexModel(key) {
    return {
      get(){
        if(StoreSingleton.store.state.wanderer.builder.editVertex){
          if(StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex] !== undefined){
            if(StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex][key] !== undefined){
              return StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex][key][StoreSingleton.store.state.wanderer.currentLanguage]
            }
          }
        }
      },
      set(data){
        if(data != undefined){
          StoreSingleton.store.commit('wanderer/setVertexDataValue', {
            id: StoreSingleton.store.state.wanderer.builder.editVertex,
            key: key,
            value: data,
            language: StoreSingleton.store.state.wanderer.currentLanguage
          })
        }
      }
    }
  }

  getEdgeModel(key) {
    return {
      get(){
        if(StoreSingleton.store.state.wanderer.builder.editEdge){
          if(StoreSingleton.store.state.wanderer.edgeDocumentData[StoreSingleton.store.state.wanderer.builder.editEdge] !== undefined){
            return StoreSingleton.store.state.wanderer.edgeDocumentData[StoreSingleton.store.state.wanderer.builder.editEdge][key]
          }
        }
      },
      set(data){
        if(data != undefined){
          StoreSingleton.store.commit('wanderer/setEdgeDataValue', {
            id: StoreSingleton.store.state.wanderer.builder.editEdge,
            key: key,
            value: data
          })
        }
      }
    }
  }

  getSelectedVertexIds () {
    let selectedVertices = this.cytoscape.$('node:selected')
    let selectedVertexIds = []
    selectedVertices.each(function(vertex){
      selectedVertexIds.push(vertex.id())
    })
    return selectedVertexIds
  }

  getSelectedEdgeIds() {
    let selectedEdges = this.cytoscape.$('edge:selected')
    let selectedEdgeIds = []
    selectedEdges.each(function(edge){
      selectedEdgeIds.push(edge.id())
    })
    return selectedEdgeIds
  }

  vertexDataToCytoscape (vertexData) {
    var cytoscapeData = {}

    this.vertexCollectionProps.with(vertexData.get('_collection')+'.toCytoscape', (toCytoscape) => {
      cytoscapeData = toCytoscape(vertexData, this.store.state.wandererBuilder.currentLanguage)
    })

    // You cannot override the id
    cytoscapeData.id = vertexData.get('_id')

    this.cytoscape.getElementById(vertexData.get('_id')).data(cytoscapeData)

  }

  addVertexListener (vertexData) {

    // Create the cytoscape node data
    var cyData = {
      data: {
        id:vertexData.get('_id') // Set required cytoscape id
      },
      position: {
        x: vertexData.get('_x'),
        y: vertexData.get('_y')
      }
    }

    // Add styles from props
    this.vertexCollectionProps.with(vertexData.get('_collection')+'.cytoscapeClasses', (cytoscapeClasses) => {
      cyData.classes = cytoscapeClasses
    })

    try {

      // Add vertex to Cytoscape
      let cyVertex = this.cytoscape.add(cyData)

      // Convert data to Cytoscape if needed
      this.vertexDataToCytoscape(vertexData)

    } catch (e) {

    }

    // let vertexCollections = WandererSingleton.getVertexCollections()
    //
    // // Deep clone the default fields
    // let newVertexData = JSON.parse(JSON.stringify(vertexCollections[vertexCollectionName].builder.defaultFields))
    //
    // // Add base data
    // newVertexData._id = WandererSingleton.generateId()
    // newVertexData._collection = vertexCollectionName
    // newVertexData._origin = false
    // newVertexData._x = x
    // newVertexData._y = y
    // newVertexData._parent = parent
    //
    // WandererSingleton.addVertex(newVertexData)
    //
    // return newVertexData._id
  }

  addEdgeListener (edge) {

    var cyData = {
      data: {
        id: vertex.data.get('_id'),
        source: vertex.data.get('_from'),
        target: vertex.data.get('_to')
      }
    }

    // Add styles from props
    edge.collection.with('builder.cytoscapeClasses', (cytoscapeClasses) => {
      cyData.classes = cytoscapeClasses
    })

    // Convert data to Cytoscape if needed
    this.edgeToCytoscape(edge)

    try {
      let cytoscapeEdge = WandererCytoscapeSingleton.cy.add(cyData)

      // Add vertex to cyVertex
      cytoscapeEdge.wandererVertex = edge

      // Store the cytoscape handel inside the vertex
      edge.cytoscapeEdge = cytoscapeEdge

    } catch (e) {

    }
  }

  // addEdge (edgeCollectionName, fromId, toId) {
  //
  //   let edgeCollections = WandererSingleton.getEdgeCollections()
  //   // let vertexCollections = WandererSingleton.getVertexCollections()
  //
  //   // Deep clone the default fields
  //   // let newEdgeData = JSON.parse(JSON.stringify(edgeCollections[edgeCollectionName].builder.defaultFields))
  //
  //   let newEdgeData = edgeCollections[edgeCollectionName].builder.defaultFields(WandererSingleton.getVertexCollectionById(fromId), WandererSingleton.getVertexCollectionById(toId));
  //
  //   // Add base data
  //   newEdgeData._id = WandererSingleton.generateId()
  //   newEdgeData._from = fromId
  //   newEdgeData._to = toId
  //   newEdgeData._collection = edgeCollectionName
  //
  //   WandererSingleton.addEdge(newEdgeData)
  //
  //   return newEdgeData._id
  // }

  appendVertex (cytoscapeNodeId, vertexCollectionName, edgeCollectionName){

    // Get the position of the source vertex
    let position = CytoscapeSingleton.cy.getElementById( cytoscapeNodeId ).position()

    var x = position.x + (Math.floor(Math.random() * (100 - 50 + 1) + 50))
    var y = position.y + (Math.floor(Math.random() * (100 - 50 + 1) + 50))

    var newVertexId = this.addVertex(vertexCollectionName, x, y)
    var newEdgeId = this.addEdge(edgeCollectionName, cytoscapeNodeId, newVertexId)

  }

  // Check if an edge is allowed between two vertices
  isAllowedConnection (fromCollectionName, toCollectionName, throughCollectionName) {
    let edgeCollections = WandererSingleton.getEdgeCollections()

    // Without any restrictions the from and to collections will be accepted
    var fromCollectionNameAllowed = true
    var toCollectionNameAllowed = true

    // Are there any from-restrictions?
    if (edgeCollections[throughCollectionName].builder.restrictSourceVertices !== undefined) {
      // Ok. We have to check if the fromCollection is allowed
      fromCollectionNameAllowed = false
      for (var i in edgeCollections[throughCollectionName].builder.restrictSourceVertices) {
        if (edgeCollections[throughCollectionName].builder.restrictSourceVertices[i] == fromCollectionName) {
          fromCollectionNameAllowed = true
        }
      }
    }

    // Are there any to-restrictions?
    if (edgeCollections[throughCollectionName].builder.restrictTargetVertices !== undefined) {
      // Ok. We have to check if the toCollection is allowed
      toCollectionNameAllowed = false
      for (var i in edgeCollections[throughCollectionName].builder.restrictTargetVertices) {
        if (edgeCollections[throughCollectionName].builder.restrictTargetVertices[i] == toCollectionName) {
          toCollectionNameAllowed = true
        }
      }
    }

    if (fromCollectionNameAllowed && toCollectionNameAllowed) {
      return true
    }

    return false
  }

  // Check if a node can be connected to a given vertex collection throug an outgoing edge
  isAllowedOutgoingConnection (fromCollectionName, toCollectionName, throughCollectionName = false) {
    let vertexCollections = WandererSingleton.getVertexCollections()

    // If the from collection restricts the outgoing connections
    if(vertexCollections[fromCollectionName].builder.restrictOutgoingConnections !== undefined) {
      // Search for the requested connection in the allowed connections of the collection
      for(var i in vertexCollections[fromCollectionName].builder.restrictOutgoingConnections) {
        if(vertexCollections[fromCollectionName].builder.restrictOutgoingConnections[i].to == toCollectionName) {
          // Check the edge too
          if(throughCollectionName){
            if(vertexCollections[fromCollectionName].builder.restrictOutgoingConnections[i].through == throughCollectionName) {
              // Return true if the to collection and the edge are allowed
              return true
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

  // Check if a node can be connected to a given collection name through an incomming edge
  isAllowedIncommingConnection(toCollectionName, fromCollectionName, throughCollectionName = false) {
    let vertexCollections = WandererSingleton.getVertexCollections()

    // If the to collection restricts the incomming connections
    if(vertexCollections[toCollectionName].builder.restrictIncommingConnections !== undefined) {
      // Search for the requested connection in the allowed connections of the collection
      for(var i in vertexCollections[toCollectionName].builder.restrictIncommingConnections) {
        if(vertexCollections[toCollectionName].builder.restrictIncommingConnections[i].from == fromCollectionName) {
          // Check the edge too
          if(throughCollectionName){
            if(vertexCollections[toCollectionName].builder.restrictIncommingConnections[i].through == throughCollectionName) {
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

  // This method collects all possible outgoing edge and vertex combinations for a given vertex collection type
  // This is usefull for example to draw the circular menu in the editor
  getPossibleOutgoingCollections (fromCollectionName) {
    let vertexCollections = WandererSingleton.getVertexCollections()
    let edgeCollections = WandererSingleton.getEdgeCollections()

    var possibleOutgoingCollections = []
    // For each possible target node
    for(var toCollectionName in vertexCollections) {
      if (vertexCollections.hasOwnProperty(toCollectionName)) {
        if(vertexCollections[toCollectionName].builder.creatable) {

          var possibleOutgoingCollection = {
            to: vertexCollections[toCollectionName],
            through: []
          }

          for(var throughCollectionName in edgeCollections) {
            if (edgeCollections.hasOwnProperty(throughCollectionName)) {
              if(edgeCollections[throughCollectionName].builder.creatable) {
                if(
                  this.isAllowedOutgoingConnection(fromCollectionName, toCollectionName, throughCollectionName) &&
                  this.isAllowedIncommingConnection(toCollectionName, fromCollectionName, throughCollectionName) &&
                  this.isAllowedConnection(fromCollectionName, toCollectionName, throughCollectionName)
                ){
                  possibleOutgoingCollection.through.push(edgeCollections[throughCollectionName])
                }
              }
            }
          }

          // If this possible outgoing connection has possible edge
          if(possibleOutgoingCollection.through.length){
            possibleOutgoingCollections.push(possibleOutgoingCollection)
          }
        }
      }
    }
    return possibleOutgoingCollections
  }

  // This method will return all possible edges between two vertex collections
  getPossibleEdgeCollections (fromCollectionName, toCollectionName) {
    let edgeCollections = WandererSingleton.getEdgeCollections()
    var possibleEdgeCollections = []

    for(var throughCollectionName in edgeCollections) {
      if (edgeCollections.hasOwnProperty(throughCollectionName)) {
        if(edgeCollections[throughCollectionName].builder.creatable) {
          if(
            this.isAllowedOutgoingConnection(fromCollectionName, toCollectionName, throughCollectionName) &&
            this.isAllowedIncommingConnection(toCollectionName, fromCollectionName, throughCollectionName) &&
            this.isAllowedConnection(fromCollectionName, toCollectionName, throughCollectionName)
          ){
            possibleEdgeCollections.push(throughCollectionName)
          }
        }
      }
    }
    return possibleEdgeCollections
  }

  updateVertexStorePosition (cyVertex) {
    let position = cyVertex.position(); // get position
    StoreSingleton.store.commit('wanderer/setVertexDataValue', {
      id: cyVertex.id(),
      key: '_x',
      value: position.x
    })
    StoreSingleton.store.commit('wanderer/setVertexDataValue', {
      id: cyVertex.id(),
      key: '_y',
      value: position.y
    })
  }

  initCytoscape (config) {

    cytoscape.use( cxtmenu )

    this.cytoscape = cytoscape(config)

    // Lets define a variable that will hold the parent scope
    let builder = this;

    // let vertexCollections = WandererSingleton.getVertexCollections()
    // let edgeCollections = WandererSingleton.getEdgeCollections()
    //

    let cytoscapeStylesheets = []

    // Add system styles
    cytoscapeStylesheets.push(
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'text-wrap': 'ellipsis',
          'text-max-width': '500px',
          'border-width': 5,
          'transition-property': 'border-color',
          'transition-duration': '0.5s',
        }
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'source-arrow-shape': 'circle',
          'text-rotation': 'autorotate',
          'transition-property': 'line-color',
          'transition-duration': '0.5s'
        }
      },
      {
        selector: 'node.pulse',
        style: {
          'border-color': '#FF8800'
        }
      },
      {
        selector: 'edge.pulse',
        style: {
          'line-color': '#FF8800'
        }
      },
      {
        selector: 'node:selected',
        style: {
          'border-color': 'black'
        }
      },
      {
        selector: 'edge:selected',
        style: {
          'line-color': 'black',
          'target-arrow-color': 'black',
          'source-arrow-color': 'black'
        }
      }
    )

    // Apply the collection styles
    this.vertexCollectionProps.each((item) => {
      // console.log(item.data.data)
      item.with('cytoscapeStyles', (cytoscapeStyles) => {
        cytoscapeStylesheets = cytoscapeStylesheets.concat(cytoscapeStyles.plain())
      })
    })

    this.cytoscape.style().fromJson(cytoscapeStylesheets).update();

    // // Init ctx menus for the different types of vertices
    // // For each vertex collection
    // for(var fromCollectionName in vertexCollections) {
    //   if (vertexCollections.hasOwnProperty(fromCollectionName)) {
    //
    //     let cxtmenuCommands = []; // an array of commands to list in the menu or a function that returns the array
    //
    //     let possibleOutgoingCollections = this.getPossibleOutgoingCollections(fromCollectionName)
    //     for(let i in possibleOutgoingCollections) {
    //       for(let t in possibleOutgoingCollections[i].through) {
    //         (function(possibleOutgoingVertexCollection, possibleOutgoingEdgeCollection) {
    //
    //           if(possibleOutgoingVertexCollection.builder.appendableViaCxtMenu) {
    //
    //             if(possibleOutgoingVertexCollection.builder.ctxMenuAllowedEdge&&possibleOutgoingVertexCollection.builder.ctxMenuAllowedEdge==possibleOutgoingEdgeCollection.name){
    //               cxtmenuCommands.push({
    //                 fillColor: possibleOutgoingVertexCollection.builder.color,
    //                 content: possibleOutgoingEdgeCollection.builder.label+' '+possibleOutgoingVertexCollection.builder.label,
    //                 select: function(vertex){
    //                   vertex.trigger('append', {
    //                     vertexCollectionName: possibleOutgoingVertexCollection.name,
    //                     edgeCollectionName: possibleOutgoingEdgeCollection.name
    //                   })
    //                 }
    //               });
    //             }
    //           }
    //
    //         })(possibleOutgoingCollections[i].to, possibleOutgoingCollections[i].through[t]);
    //       }
    //     }
    //
    //     // Add new context menu
    //     CytoscapeSingleton.cy.cxtmenu( {
    //       menuRadius: 150, // the radius of the circular menu in pixels
    //       selector: vertexCollections[fromCollectionName].builder.cytoscapeCxtMenuSelector, // elements matching this Cytoscape.js selector will trigger cxtmenus
    //       commands: cxtmenuCommands, // function( ele ){ return [ /*...*/ ] }, // example function for commands
    //       fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
    //       activeFillColor: 'rgba(92, 194, 237, 0.75)', // the colour used to indicate the selected command
    //       activePadding: 20, // additional size in pixels for the active command
    //       indicatorSize: 24, // the size in pixels of the pointer to the active command
    //       separatorWidth: 3, // the empty spacing in pixels between successive commands
    //       spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
    //       minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
    //       maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
    //       openMenuEvents: 'cxttapstart', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
    //       //openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
    //       itemColor: 'black', // the colour of text in the command's content
    //       //itemTextShadowColor: 'black', // the text shadow colour of the command's content
    //       zIndex: 9999, // the z-index of the ui div
    //       atMouse: false // draw menu at mouse position
    //     });
    //
    //   }
    // }

    // Implement dbl click
    var clickedBefore;
    var clickedTimeout;
    this.cytoscape.on('click', function(event) {
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
    this.cytoscape.on('select', 'node', function(evt){
      let lastSelectedVerticesIds = builder.getSelectedVertexIds()
      builder.store.commit('wandererBuilder/setSelectedVertexIds',lastSelectedVerticesIds);
    });

    // Edit vertex
    this.cytoscape.on('dblclick','node', function(){
      builder.store.commit('wandererBuilder/setEditVertex',this.id())
    });

    // Unselect vertices
    this.cytoscape.on('unselect', 'node', function(evt){
      let lastSelectedVerticesIds = builder.getSelectedVertexIds()
      builder.store.commit('wandererBuilder/setSelectedVertexIds',lastSelectedVerticesIds);
    });

    // Select edge(s)
    this.cytoscape.on('select', 'edge', function(evt) {
      let lastSelectedEdgesIds = builder.getSelectedEdgeIds()
      builder.store.commit('wandererBuilder/setSelectedEdgeIds',lastSelectedEdgesIds)
    })

    // Edit edge
    this.cytoscape.on('dblclick','edge', function() {
      builder.store.commit('wandererBuilder/setEditEdge',this.id())
    })

    // Unselect edge(s)
    this.cytoscape.on('unselect', 'edge', function(evt) {
      let lastSelectedEdgesIds = builder.getSelectedEdgeIds()
      builder.store.commit('wandererBuilder/setSelectedEdgeIds',lastSelectedEdgesIds)
    })

    // Append event
    this.cytoscape.on('append', 'node', function(evt, {vertexCollectionName, edgeCollectionName}) {
      builder.appendVertex(this.id(), vertexCollectionName, edgeCollectionName)
    })

    // Implement drop event
    let dropTimer = null;
    this.cytoscape.on('drag', 'node', function(event) {
      if(dropTimer){clearTimeout(dropTimer);} // Clear the timeout if set
      // get all grabbed nodes
      var lastGrabbedNodes = this.cytoscape.$('node:grabbed');
      // Set new timeout
      dropTimer = setTimeout(function(){
        lastGrabbedNodes.forEach(function(vertex){
          vertex.trigger('drop');
        });
      },500);
    });

    // On drop
    this.cytoscape.on('drop','node', function(evt) {

      // Check if this is a origin vertex
      // We cannot disable drag for this vertex but we can set it back to coordinates 0,0
      if(this.wandererVertex.data.get('_origin')) {
        this.position({x: 0, y: 0});
        this.store.dispatch('wandererBuilder/addAlert', {
          message:'You cannot move the origin node',
          type:'warning'
        })
      } else {

        // Update the vertex position in store
        // builder.updateVertexStorePosition(this)

        // // Also find all compound children and their child childs and update the positions
        // let childrens = this.descendants();
        // childrens.forEach((child) => {
        //   builder.updateVertexStorePosition(child)
        // })

      }
    });

  }

}
