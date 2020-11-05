import WandererSingleton from 'wanderer-singleton'
import StoreSingleton from 'wanderer-store-singleton'
import CytoscapeSingleton from 'wanderer-cytoscape-singleton'

export default class WandererBuilder {

  // static cytoscape = null;
  // static store = null;
  // static wanderer = null;
  //
  // static init (cytoscape, store, wanderer) {
  //   this.cytoscape = cytoscape
  //   this.store = store
  //   this.wanderer = wanderer
  // }

  static getVertexModel(key){
    return {
      get(){
        if(StoreSingleton.store.state.wanderer.builder.editVertex){
          if(StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex] !== undefined){
            return StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex][key]
          }
        }
      },
      set(data){
        if(data != undefined){
          StoreSingleton.store.commit('wanderer/setVertexDataValue', {
            id: StoreSingleton.store.state.wanderer.builder.editVertex,
            key: key,
            value: data
          })
        }
      }
    }
  }

  static getTranslatableVertexModel(key){
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

  static getEdgeModel(key){
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

  static getSelectedVertexIds () {
    let selectedVertices = CytoscapeSingleton.cy.$('node:selected');
    let selectedVertexIds = [];
    selectedVertices.each(function(vertex){
      selectedVertexIds.push(vertex.id());
    });
    return selectedVertexIds
  }

  static getSelectedEdgeIds() {
    let selectedEdges = CytoscapeSingleton.cy.$('edge:selected');
    let selectedEdgeIds = [];
    selectedEdges.each(function(edge){
      selectedEdgeIds.push(edge.id());
    });
    return selectedEdgeIds
  }

  static addVertex (vertexCollectionName, x, y, parent) {

    if(parent == undefined) {
      parent = false
    }

    let vertexCollections = WandererSingleton.getVertexCollections()

    // Deep clone the default fields
    let newVertexData = JSON.parse(JSON.stringify(vertexCollections[vertexCollectionName].builder.defaultFields))

    // Add base data
    newVertexData._id = WandererSingleton.generateId()
    newVertexData._collection = vertexCollectionName
    newVertexData._origin = false
    newVertexData._x = x
    newVertexData._y = y
    newVertexData._parent = parent

    WandererSingleton.addVertex(newVertexData)

    return newVertexData._id
  }

  static addEdge (edgeCollectionName, fromId, toId) {

    let edgeCollections = WandererSingleton.getEdgeCollections()
    // let vertexCollections = WandererSingleton.getVertexCollections()

    // Deep clone the default fields
    // let newEdgeData = JSON.parse(JSON.stringify(edgeCollections[edgeCollectionName].builder.defaultFields))

    let newEdgeData = edgeCollections[edgeCollectionName].builder.defaultFields(WandererSingleton.getVertexCollectionById(fromId), WandererSingleton.getVertexCollectionById(toId));

    // Add base data
    newEdgeData._id = WandererSingleton.generateId()
    newEdgeData._from = fromId
    newEdgeData._to = toId
    newEdgeData._collection = edgeCollectionName

    WandererSingleton.addEdge(newEdgeData)

    return newEdgeData._id
  }

  static appendVertex (cytoscapeNodeId, vertexCollectionName, edgeCollectionName){

    // Get the position of the source vertex
    let position = CytoscapeSingleton.cy.getElementById( cytoscapeNodeId ).position()

    var x = position.x + (Math.floor(Math.random() * (100 - 50 + 1) + 50))
    var y = position.y + (Math.floor(Math.random() * (100 - 50 + 1) + 50))

    var newVertexId = this.addVertex(vertexCollectionName, x, y)
    var newEdgeId = this.addEdge(edgeCollectionName, cytoscapeNodeId, newVertexId)

  }

  // static injectVertex (cytoscapeNodeId, vertexCollectionName){
  //
  //   // Get the position of the source vertex
  //   let position = CytoscapeSingleton.cy.getElementById( cytoscapeNodeId ).position()
  //
  //   var x = position.x + (Math.floor(Math.random() * (100 - 50 + 1) + 50))
  //   var y = position.y + (Math.floor(Math.random() * (100 - 50 + 1) + 50))
  //
  //   var newVertexId = this.addVertex(vertexCollectionName, x, y, cytoscapeNodeId)
  //
  //   // Rebuild the compound structure
  //   WandererSingleton.rebuildCytoscapeCompounds()
  //
  // }

  // Check if an edge is allowed between two vertices
  static isAllowedConnection (fromCollectionName, toCollectionName, throughCollectionName) {
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
  static isAllowedOutgoingConnection (fromCollectionName, toCollectionName, throughCollectionName = false) {
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
  static isAllowedIncommingConnection(toCollectionName, fromCollectionName, throughCollectionName = false) {
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
  static getPossibleOutgoingCollections (fromCollectionName) {
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

  // static getPossibleChildCollections (parentCollectionName) {
  //
  //   let returnChildCollections = []
  //
  //   // Get the parent collection
  //   let parentCollection = WandererSingleton.getVertexCollection(parentCollectionName)
  //
  //   if(parentCollection.builder.canBeParent) {
  //
  //     // Get the possible child collections
  //     let possibleChildCollections = WandererSingleton.getVertexCollections()
  //
  //     // For each collection check if it can used as a child for this parent
  //     for(var possibleChildCollectionName in possibleChildCollections) {
  //       if (possibleChildCollections.hasOwnProperty(possibleChildCollectionName)) {
  //
  //         // Is this possible child vertex creatable?
  //         if(possibleChildCollections[possibleChildCollectionName].builder.creatable) {
  //
  //           if(possibleChildCollections[possibleChildCollectionName].builder.canBeChild) {
  //
  //             // Check if there are possible restrictions of the parent for this node
  //             var parentIsAllowed = true; // Allow this parent if there are no restriction rules
  //             if(possibleChildCollections[possibleChildCollectionName].builder.restrictPossibleParents!=undefined) {
  //               parentIsAllowed = false; // Do not allow this parents in general if rules was found
  //               // Check this restrictions
  //               for(var r in possibleChildCollections[possibleChildCollectionName].builder.restrictPossibleParents) {
  //                 if (possibleChildCollections[possibleChildCollectionName].builder.restrictPossibleParents.hasOwnProperty(r)) {
  //                   if(possibleChildCollections[possibleChildCollectionName].builder.restrictPossibleParents[r] == parentCollectionName) {
  //                     parentIsAllowed = true // Allow this parent if it was found in the rules
  //                     // console.log(possibleChildCollectionName+' can be child of '+possibleChildCollections[possibleChildCollectionName].builder.restrictPossibleParents[r])
  //                     break;
  //                   }
  //                 }
  //               }
  //             }
  //
  //             // Check if there are possible restrictions of childs for this parent node
  //             var childIsAllowed = true; // Allow this child if there are no restriction rules
  //             if(parentCollection.builder.restrictPossibleChildren!=undefined) {
  //               childIsAllowed = false; // Do not allow this child in general if rules was found
  //               // Check this restrictions
  //               for(var r in parentCollection.builder.restrictPossibleChildren) {
  //                 if (parentCollection.builder.restrictPossibleChildren.hasOwnProperty(r)) {
  //                   if(parentCollection.builder.restrictPossibleChildren[r] == possibleChildCollectionName) {
  //                     childIsAllowed = true // Allow this parent if it was found in the rules
  //                     // console.log(parentCollectionName+' can have child '+parentCollection.builder.restrictPossibleChildren[r])
  //                     break;
  //                   }
  //                 }
  //               }
  //             }
  //
  //             // If both is allowed (If this parent can have this child and if this child can have this parent)
  //             if(parentIsAllowed&&childIsAllowed) {
  //               returnChildCollections.push(possibleChildCollections[possibleChildCollectionName])
  //             }
  //           }
  //         }
  //       }
  //     }
  //
  //   }
  //
  //   return returnChildCollections
  //
  // }

  // This method will return all possible edges between two vertex collections
  static getPossibleEdgeCollections (fromCollectionName, toCollectionName) {
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

  static updateVertexStorePosition (cyVertex) {
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

  static initCytoscape (config) {

    CytoscapeSingleton.init(config)

    // Lets define a variable that will hold the parent scope
    let builder = this;

    let vertexCollections = WandererSingleton.getVertexCollections()
    let edgeCollections = WandererSingleton.getEdgeCollections()

    // Apply the collection styles
    let cytoscapeStylesheets = []
    for(var fromCollectionName in vertexCollections){
      if(vertexCollections[fromCollectionName].builder.cytoscapeStyles !== undefined){
        cytoscapeStylesheets = cytoscapeStylesheets.concat(vertexCollections[fromCollectionName].builder.cytoscapeStyles)
      }
    }
    for(var fromCollectionName in edgeCollections){
      if(edgeCollections[fromCollectionName].builder.cytoscapeStyles !== undefined){
        cytoscapeStylesheets = cytoscapeStylesheets.concat(edgeCollections[fromCollectionName].builder.cytoscapeStyles)
      }
    }

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

    CytoscapeSingleton.cy.style().fromJson(cytoscapeStylesheets).update();

    // Init ctx menus for the different types of vertices
    // For each vertex collection
    for(var fromCollectionName in vertexCollections) {
      if (vertexCollections.hasOwnProperty(fromCollectionName)) {

        let cxtmenuCommands = []; // an array of commands to list in the menu or a function that returns the array

        let possibleOutgoingCollections = this.getPossibleOutgoingCollections(fromCollectionName)
        for(let i in possibleOutgoingCollections) {
          for(let t in possibleOutgoingCollections[i].through) {
            (function(possibleOutgoingVertexCollection, possibleOutgoingEdgeCollection) {

              if(possibleOutgoingVertexCollection.builder.appendableViaCxtMenu) {

                if(possibleOutgoingVertexCollection.builder.ctxMenuAllowedEdge&&possibleOutgoingVertexCollection.builder.ctxMenuAllowedEdge==possibleOutgoingEdgeCollection.name){
                  cxtmenuCommands.push({
                    fillColor: possibleOutgoingVertexCollection.builder.color,
                    content: possibleOutgoingEdgeCollection.builder.label+' '+possibleOutgoingVertexCollection.builder.label,
                    select: function(vertex){
                      vertex.trigger('append', {
                        vertexCollectionName: possibleOutgoingVertexCollection.name,
                        edgeCollectionName: possibleOutgoingEdgeCollection.name
                      })
                    }
                  });
                }
              }

            })(possibleOutgoingCollections[i].to, possibleOutgoingCollections[i].through[t]);
          }
        }

        // let possibleChildCollections = this.getPossibleChildCollections(fromCollectionName)
        // for(let i in possibleChildCollections) {
        //   (function(possibleChildCollections) {
        //
        //     if(possibleChildCollections.builder.injectableViaCxtMenu) {
        //
        //       cxtmenuCommands.push({
        //         fillColor: possibleChildCollections.builder.color,
        //         content: 'inject '+possibleChildCollections.builder.label,
        //         select: function(vertex){
        //           vertex.trigger('inject', {
        //             vertexCollectionName: possibleChildCollections.name
        //           })
        //         }
        //       });
        //
        //     }
        //
        //   })(possibleChildCollections[i]);
        // }

        // Add general "add more" function
        // cxtmenuCommands.push({
        //   fillColor: '#6C757D',
        //   content: 'More',
        //   select: function(vertex){
        //
        //   }
        // });

        // Add new context menu
        CytoscapeSingleton.cy.cxtmenu( {
          menuRadius: 150, // the radius of the circular menu in pixels
          selector: vertexCollections[fromCollectionName].builder.cytoscapeCxtMenuSelector, // elements matching this Cytoscape.js selector will trigger cxtmenus
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
    CytoscapeSingleton.cy.on('click', function(event) {
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
    CytoscapeSingleton.cy.on('select', 'node', function(evt){
      let lastSelectedVerticesIds = builder.getSelectedVertexIds()
      StoreSingleton.store.commit('wanderer/builder/setSelectedVertexIds',lastSelectedVerticesIds);
    });

    // Edit vertex
    CytoscapeSingleton.cy.on('dblclick','node', function(){
      StoreSingleton.store.commit('wanderer/builder/setEditVertex',this.id())
    });

    // Unselect vertices
    CytoscapeSingleton.cy.on('unselect', 'node', function(evt){
      let lastSelectedVerticesIds = builder.getSelectedVertexIds()
      StoreSingleton.store.commit('wanderer/builder/setSelectedVertexIds',lastSelectedVerticesIds);
    });

    // // Unselect nodes
    // this.cy.on('unselect', 'node', function(evt){
    //   brain.store.commit('editor/setEditVertex',0)
    // });

    // Select edge(s)
    CytoscapeSingleton.cy.on('select', 'edge', function(evt) {
      let lastSelectedEdgesIds = builder.getSelectedEdgeIds()
      StoreSingleton.store.commit('wanderer/builder/setSelectedEdgeIds',lastSelectedEdgesIds)
    })

    // Edit edge
    CytoscapeSingleton.cy.on('dblclick','edge', function() {
      StoreSingleton.store.commit('wanderer/builder/setEditEdge',this.id())
    })

    // Unselect edge(s)
    CytoscapeSingleton.cy.on('unselect', 'edge', function(evt) {
      let lastSelectedEdgesIds = builder.getSelectedEdgeIds()
      StoreSingleton.store.commit('wanderer/builder/setSelectedEdgeIds',lastSelectedEdgesIds)
    })

    // Append event
    CytoscapeSingleton.cy.on('append', 'node', function(evt, {vertexCollectionName, edgeCollectionName}) {
      builder.appendVertex(this.id(), vertexCollectionName, edgeCollectionName)
    })

    // // Inject event
    // CytoscapeSingleton.cy.on('inject', 'node', function(evt, {vertexCollectionName}) {
    //   builder.injectVertex(this.id(), vertexCollectionName)
    // })

    // Implement drop event
    let dropTimer = null;
    CytoscapeSingleton.cy.on('drag', 'node', function(event) {
      if(dropTimer){clearTimeout(dropTimer);} // Clear the timeout if set
      // get all grabbed nodes
      var lastGrabbedNodes = CytoscapeSingleton.cy.$('node:grabbed');
      // Set new timeout
      dropTimer = setTimeout(function(){
        lastGrabbedNodes.forEach(function(vertex){
          vertex.trigger('drop');
        });
      },500);
    });

    // On drop
    CytoscapeSingleton.cy.on('drop','node', function(evt) {

      // Check if this is a origin vertex
      // We cannot disable drag for this vertex but we can set it back to coordinates 0,0
      if(StoreSingleton.store.state.wanderer.vertexDocumentData[this.id()]._origin) {
        this.position({x: 0, y: 0});
        StoreSingleton.store.dispatch('wanderer/builder/addAlert',{message:'You cannot move the origin node',type:'warning'})
      } else {

        // Update the vertex position in store
        builder.updateVertexStorePosition(this)

        // Also find all compound children and their child childs and update the positions
        let childrens = this.descendants();
        childrens.forEach((child) => {
          builder.updateVertexStorePosition(child)
        })

      }
    });

  }

}
