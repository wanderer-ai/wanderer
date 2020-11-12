import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import WandererNestedData from 'wanderer-nested-data'

export default class Builder {

  constructor (wanderer, vue, store, vueGraph) {
    this.wanderer = wanderer
    this.vue = vue
    this.store = store
    this.vueGraph = vueGraph
    this.cytoscape = undefined

    this.vertexCollectionProps = new WandererNestedData()
    this.edgeCollectionProps = new WandererNestedData()

    this.subscriber = this.wanderer.broadcast.subscribe('builder')

    // Listen for new vertex collection props
    this.subscriber.on('addVertexCollectionProps', ({collectionName, props}) => {
      props = new WandererNestedData(props)
      props.with('builder', (builderProps) => {
        this.vertexCollectionProps.set(collectionName, builderProps)
      })
    })

    // Listen for new edge collection props
    this.subscriber.on('addEdgeCollectionProps', ({collectionName, props}) => {
      props = new WandererNestedData(props)
      props.with('builder', (builderProps) => {
        this.edgeCollectionProps.set(collectionName, builderProps)
      })
    })

    // Set language
    this.subscriber.on('setLanguage', (language) => {
      this.store.commit('wandererBuilder/setCurrentLanguage', language)
      this.rebuildCytoscape()
    })

    // Truncate
    this.subscriber.on('truncate', (vertexData) => {
      this.cytoscape.remove( '*' )
      this.store.commit('wandererBuilder/truncate')
    })

    // Listen for new vertices
    this.subscriber.on('addVertex', (vertexData) => {
      vertexData = new WandererNestedData(vertexData)
      this.addVertexListener(vertexData)
    })

    // Listen for new edges
    this.subscriber.on('addEdge', (edgeData) => {
      edgeData = new WandererNestedData(edgeData)
      this.addEdgeListener(edgeData)
    })

    // Listen for vertex deletions
    this.subscriber.on('removeVertex', (vertexId) => {
      let vertex = this.cytoscape.getElementById(vertexId)
      vertex.remove()
    })

    // Listen for edge deletions
    this.subscriber.on('removeEdge', (edgeId) => {
      let cytoscapeEdge = this.cytoscape.getElementById(edgeId)
      cytoscapeEdge.remove();
    })

    // Listen for vertex data changes
    this.subscriber.on('setVertexDataValue', ({id, key, value, language}) => {

    })

    // Listen for edge data changes
    this.subscriber.on('setEdgeDataValue', ({id, key, value, language}) => {

    })

  }

  setCurrentLanguage (language) {
    this.store.commit('wandererBuilder/setCurrentLanguage', language)
    this.rebuildCytoscape()
    this.subscriber.setLanguage(language);
  }

  getCurrentLanguage () {
    return this.store.state.wandererBuilder.currentLanguage;
  }

  getVertexCollectionPropsById (vertexId) {
    var collection = this.vueGraph.getVertexDataValue(vertexId, '_collection')
    if(this.vertexCollectionProps.has(collection) ) {
      return this.vertexCollectionProps.get(collection)
    }
  }

  getVertexDataValue (key) {
    var editVertexId = this.store.state.wandererBuilder.editVertex
    return this.vueGraph.getVertexDataValue(editVertexId, key)
  }

  getTranslatableVertexDataValue (key) {
    var currentLanguage = this.store.state.wandererBuilder.currentLanguage
    var editVertexId = this.store.state.wandererBuilder.editVertex
    return this.vueGraph.getVertexDataValue(editVertexId, key, currentLanguage)
  }

  setVertexDataValue (key, value) {
    var editVertexId = this.store.state.wandererBuilder.editVertex
    this.vueGraph.setVertexDataValue(editVertexId, key, value)
  }

  setTranslatableVertexDataValue (key, value) {
    var currentLanguage = this.store.state.wandererBuilder.currentLanguage
    var editVertexId = this.store.state.wandererBuilder.editVertex
    this.vueGraph.setVertexDataValue(editVertexId, key, value, currentLanguage)
  }

  // getVertexDataValueModel (key) {
  //   var currentLanguage = this.store.state.wandererBuilder.currentLanguage
  //   var editVertexId = this.store.state.wandererBuilder.editVertex
  //   return this.vueGraph.getVertexDataValueModel(editVertexId, key, currentLanguage)
  // }

  // getTranslatableVertexDataValueModel(key) {
  //   var currentLanguage = this.store.state.wandererBuilder.currentLanguage
  //   var editVertexId = this.store.state.wandererBuilder.editVertex
  //   return this.vueGraph.getVertexDataValueModel(editVertexId, key, currentLanguage)
  // }
  //
  // getEdgeDataValueModel (key) {
  //   var editEdgeId = this.store.state.wandererBuilder.editEdge
  //   return this.vueGraph.getEdgeDataValueModel(editEdgeId, key)
  // }
  //
  // getTranslateableEdgeDataValueModel (key) {
  //   var currentLanguage = this.store.state.wandererBuilder.currentLanguage
  //   var editEdgeId = this.store.state.wandererBuilder.editEdge
  //   return this.vueGraph.getEdgeDataValueModel(editEdgeId, key, currentLanguage)
  // }

  getSelectedCytoscapeVertexIds () {
    let selectedVertices = this.cytoscape.$('node:selected')
    let selectedVertexIds = []
    selectedVertices.each(function(vertex){
      selectedVertexIds.push(vertex.id())
    })
    return selectedVertexIds
  }

  getSelectedCytoscapeEdgeIds() {
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

  edgeDataToCytoscape (edgeData) {
    var cytoscapeData = {}
    this.edgeCollectionProps.with(edgeData.get('_collection')+'.toCytoscape', (toCytoscape) => {
      cytoscapeData = toCytoscape(edgeData, this.store.state.wandererBuilder.currentLanguage)
    })
    // You cannot override the id
    cytoscapeData.id = edgeData.get('_id')
    this.cytoscape.getElementById(edgeData.get('_id')).data(cytoscapeData)
  }

  rebuildCytoscape () {
    var vertices = this.vueGraph.getAllVertexData()
    vertices = new WandererNestedData(vertices)
    vertices.each((vertex) => {
      this.vertexDataToCytoscape(vertex)
    })

    var edges = this.vueGraph.getAllEdgeData()
    edges = new WandererNestedData(edges)
    edges.each((edge) => {
      this.edgeDataToCytoscape(edge)
    })
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

      // Center cytoscape to origin
      vertexData.with('_origin', () => {
        this.cytoscape.center(vertexData.get('_id'))
        this.cytoscape.zoom(1)
      })

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

  addEdgeListener (edgeData) {

    var cyData = {
      data: {
        id: edgeData.get('_id'),
        source: edgeData.get('_from'),
        target: edgeData.get('_to')
      }
    }

    // Add styles from props
    this.edgeCollectionProps.with(edgeData.get('_collection')+'.cytoscapeClasses', (cytoscapeClasses) => {
      cyData.classes = cytoscapeClasses
    })

    // Convert data to Cytoscape if needed
    this.edgeDataToCytoscape(edgeData)

    try {
      let cytoscapeEdge = this.cytoscape.add(cyData)
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

    // Without any restrictions the from and to collections will be accepted
    var fromCollectionNameAllowed = true
    var toCollectionNameAllowed = true

    // Are there any from-restrictions?
    this.edgeCollectionProps.with(throughCollectionName+'.restrictSourceVertices', (restrictSourceVertices) => {
      // Ok. We have to check if the fromCollection is allowed
      fromCollectionNameAllowed = false
      restrictSourceVertices.each((restrictSourceVertex) => {
        if (restrictSourceVertex == fromCollectionName) {
          fromCollectionNameAllowed = true
        }
      })
    })

    // Are there any to-restrictions?
    this.edgeCollectionProps.with(throughCollectionName+'.restrictTargetVertices', (restrictTargetVertices) => {
      // Ok. We have to check if the toCollection is allowed
      toCollectionNameAllowed = false
      restrictTargetVertices.each((restrictTargetVertex) => {
        if (restrictTargetVertex == toCollectionName) {
          toCollectionNameAllowed = true
        }
      })
    })

    if (fromCollectionNameAllowed && toCollectionNameAllowed) {
      return true
    }

    return false
  }

  // Check if a node can be connected to a given vertex collection throug an outgoing edge
  isAllowedOutgoingConnection (fromCollectionName, toCollectionName, throughCollectionName = false) {

    this.vertexCollectionProps.with(fromCollectionName+'.restrictOutgoingConnections', (restrictOutgoingConnections) => {

      restrictOutgoingConnections.each((restrictOutgoingConnection) => {

        restrictOutgoingConnection.with('to', (to) => {
          if(to == toCollectionName) {

            // Check the edge too
            if(throughCollectionName) {

              restrictOutgoingConnection.with('through', (through) => {
                if(through == throughCollectionName) {
                  // Return true if the to collection and the edge are allowed
                  return true
                }
              })

            // Drop the edge check
            }else{
              // Return true if the target collection is allowed
              return true;
            }
          }
        })

      })

      // Always return false if the outgoing connections are restricted and no rule matches
      return false;

    })

    // Always return true if the outgoing connections are not restricted
    return true;

  }

  // Check if a node can be connected to a given collection name through an incomming edge
  isAllowedIncommingConnection(toCollectionName, fromCollectionName, throughCollectionName = false) {

    this.vertexCollectionProps.with(toCollectionName+'.restrictIncommingConnections', (restrictIncommingConnections) => {

      restrictIncommingConnections.each((restrictIncommingConnection) => {

        restrictIncommingConnection.with('from', (from) => {
          if(from == fromCollectionName) {

            // Check the edge too
            if(throughCollectionName) {

              restrictIncommingConnection.with('through', (through) => {
                if(through == throughCollectionName) {
                  // Return true if the to collection and the edge are allowed
                  return true
                }
              })

            // Drop the edge check
            }else{
              // Return true if the target collection is allowed
              return true;
            }
          }
        })

      })

      // Always return false if the incomming connections are restricted and no rule matches
      return false;

    })

    // Always return true if the incomming connections are not restricted
    return true;

  }

  // This method collects all possible outgoing edge and vertex combinations for a given vertex collection type
  // This is usefull for example to draw the circular menu in the editor
  getPossibleOutgoingCollections (fromCollectionName) {

    var possibleOutgoingCollections = []

    // For each vertex collection
    this.vertexCollectionProps.each((vertexCollection, toCollectionName) => {
      if(vertexCollection.is('creatable')) {

        var possibleOutgoingCollection = {
          to: vertexCollection,
          through: []
        }

        // For each edge collection
        this.edgeCollectionProps.each((edgeCollection, throughCollectionName) => {

          if(edgeCollection.is('creatable')) {
            if(
              this.isAllowedOutgoingConnection(fromCollectionName, toCollectionName, throughCollectionName) &&
              this.isAllowedIncommingConnection(toCollectionName, fromCollectionName, throughCollectionName) &&
              this.isAllowedConnection(fromCollectionName, toCollectionName, throughCollectionName)
            ){
              possibleOutgoingCollection.through.push(edgeCollection)
            }
          }

        })

        // If this possible outgoing connection has a possible edge
        if(possibleOutgoingCollection.through.length){
          possibleOutgoingCollections.push(possibleOutgoingCollection)
        }

      }
    })

    return new WandererNestedData(possibleOutgoingCollections)

  }

  // This method will return all possible edges between two vertex collections
  getPossibleEdgeCollectionNames (fromCollectionName, toCollectionName) {

    var possibleEdgeCollections = []

    this.edgeCollectionProps.each((edgeCollection, throughCollectionName) => {
      if(edgeCollection.is('creatable')) {
        if(
          this.isAllowedOutgoingConnection(fromCollectionName, toCollectionName, throughCollectionName) &&
          this.isAllowedIncommingConnection(toCollectionName, fromCollectionName, throughCollectionName) &&
          this.isAllowedConnection(fromCollectionName, toCollectionName, throughCollectionName)
        ){
          possibleEdgeCollections.push(throughCollectionName)
        }
      }
    })

    return possibleEdgeCollections
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
        cytoscapeStylesheets = cytoscapeStyles.plain().concat(cytoscapeStylesheets)
      })
    })

    this.cytoscape.style().fromJson(cytoscapeStylesheets).update();

    // Init ctx menus for the different types of vertices
    // For each vertex collection
    this.vertexCollectionProps.each((fromCollection, fromCollectionName) => {

      let cxtmenuCommands = []; // an array of commands to list in the menu or a function that returns the array
      let possibleOutgoingCollections = this.getPossibleOutgoingCollections(fromCollectionName)

      possibleOutgoingCollections.each((possibleOutgoingCollection) => {

        possibleOutgoingCollection.with('to', (possibleOutgoingVertexCollection) => {

          possibleOutgoingCollection.with('through', (possibleOutgoingEdgeCollections) => {

            possibleOutgoingEdgeCollections.each((possibleOutgoingEdgeCollection) => {

              if(possibleOutgoingVertexCollection.appendableViaCxtMenu) {

                if(possibleOutgoingVertexCollection.ctxMenuAllowedEdge&&possibleOutgoingVertexCollection.ctxMenuAllowedEdge==possibleOutgoingEdgeCollection.name) {
                  cxtmenuCommands.push({
                    fillColor: possibleOutgoingVertexCollection.color,
                    content: possibleOutgoingEdgeCollection.label+' '+possibleOutgoingVertexCollection.label,
                    select: function(vertex){
                      vertex.trigger('append', {
                        vertexCollectionName: possibleOutgoingVertexCollection.name,
                        edgeCollectionName: possibleOutgoingEdgeCollection.name
                      })
                    }
                  })
                }
              }

            })

          })

        })

      })

      // Add new context menu
      this.cytoscape.cxtmenu( {
        menuRadius: 150, // the radius of the circular menu in pixels
        selector: fromCollection.get('cytoscapeCxtMenuSelector'), // elements matching this Cytoscape.js selector will trigger cxtmenus
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

    })

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
      let lastSelectedVerticesIds = builder.getSelectedCytoscapeVertexIds()
      builder.store.commit('wandererBuilder/setSelectedVertexIds',lastSelectedVerticesIds);
    });

    // Edit vertex
    this.cytoscape.on('dblclick','node', function(){
      builder.store.commit('wandererBuilder/setEditVertex',this.id())
    });

    // Unselect vertices
    this.cytoscape.on('unselect', 'node', function(evt){
      let lastSelectedVerticesIds = builder.getSelectedCytoscapeVertexIds()
      builder.store.commit('wandererBuilder/setSelectedVertexIds',lastSelectedVerticesIds);
    });

    // Select edge(s)
    this.cytoscape.on('select', 'edge', function(evt) {
      let lastSelectedEdgesIds = builder.getSelectedCytoscapeEdgeIds()
      builder.store.commit('wandererBuilder/setSelectedEdgeIds',lastSelectedEdgesIds)
    })

    // Edit edge
    this.cytoscape.on('dblclick','edge', function() {
      builder.store.commit('wandererBuilder/setEditEdge',this.id())
    })

    // Unselect edge(s)
    this.cytoscape.on('unselect', 'edge', function(evt) {
      let lastSelectedEdgesIds = builder.getSelectedCytoscapeEdgeIds()
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
      var lastGrabbedNodes = builder.cytoscape.$('node:grabbed');
      // Set new timeout
      dropTimer = setTimeout(function() {
        lastGrabbedNodes.forEach(function(vertex) {
          vertex.trigger('drop');
        });
      }, 500);
    });

    // On drop
    this.cytoscape.on('drop','node', function(evt) {
      // Check if this is a origin vertex
      // We cannot disable drag for this vertex but we can set it back to coordinates 0,0
      if(builder.vueGraph.getVertexDataValue(this.id(), '_origin') == true) {
        this.position({x: 0, y: 0});
        builder.store.dispatch('wandererBuilder/addAlert', {
          message:'You cannot move the origin node',
          type:'warning'
        })
      }
    });

  }

}
