import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import Vuex from 'vuex'

cytoscape.use( cxtmenu );

export default class Brain {

  constructor () {
    // this.Vue = Vue;
    this.vertexCollections = {
      unknown: {
        //store: store,
        label: 'Unknown',
        color: '#6C757D',
        cytoscapeClasses: 'unknown',
        cytoscapeCtxMenuSelector: '.unknown',
        createable: false,
        toCytoscape: function(data){
          return {
            label: 'Unknown'
          }
        },
        // editorComponent: Editor
        // chatComponent:
      }
    }
    this.edgeCollections = {}
    this.cytoscapeStylesheets = []

  }

  use (plugin) {
    plugin.install(this)
  }

  // This is a store factory that can be used by brain plugins to create own independent stores
  storeFactory (options) {
    // this.Vue.use(Vuex)
    // return new Vuex.Store(options)
  }

  registerVertexCollection (name,configuration) {
    this.vertexCollections[name] = configuration // Register the collection
  }

  registerEdgeCollection (name,configuration) {
    this.edgeCollections[name] = configuration // Register the collection
  }

  getVertexCollection(name){
    if(this.vertexCollections[name] === undefined){
      return this.vertexCollections['unknown']
    }
    return this.vertexCollections[name]
  }

  // Extra initiation is important because we may have to wait for a dom element if cy runs not headless
  initCytoscape (config) {
    this.cy = cytoscape(config)

    // Apply the style
    this.cy.style(this.cytoscapeStylesheets)

    // Init ctx menus for the different types of vertices
    // For each vertex collection
    for(var fromCollectionName in this.vertexCollections){
      if (this.vertexCollections.hasOwnProperty(fromCollectionName)) {

        let cxtmenuCommands = []; // an array of commands to list in the menu or a function that returns the array

        let possibleOutgoingCollectionNames = this.getPossibleOutgoingVertexCollections(fromCollectionName)
        for(let i in possibleOutgoingCollectionNames){
          if (this.vertexCollections.hasOwnProperty(possibleOutgoingCollectionNames[i])) {
            if(this.vertexCollections[possibleOutgoingCollectionNames[i]].createable){
              (function(possibleToCollectionName,parent) {
                cxtmenuCommands.push({
                  fillColor: parent.vertexCollections[possibleToCollectionName].color,
                  content: 'add '+parent.vertexCollections[possibleToCollectionName].label,
                  select: function(vertex){
                    vertex.trigger('append', possibleToCollectionName)
                  }
                });
              })(possibleOutgoingCollectionNames[i],this);
            }
          }

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

    // Append event
    var that = this
    this.cy.on('append', 'node', function(evt, newCollectionName){

      that.append(this.id(),newCollectionName)

    })

  }

  append(cytoscapeNodeId, newCollectionName){
    // Deep clone the default fields
    let newVertexData = JSON.parse(JSON.stringify(this.vertexCollections[newCollectionName].defaultFields))

    // Add base data
    //newVertexData._cyid = component.$utils.generateRandomId();
    newVertexData._collection = newCollectionName;
    newVertexData._isOrigin = false;

    this.addVertex(newVertexData)

    // Get the referer vertex data
    // let refererVertexPosition = this.position()


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

  getPossibleOutgoingVertexCollections(fromCollectionName){
    var possibleOutgoingCollections = []
    // For each possible target node
    for(var toCollectionName in this.vertexCollections){
      if (this.vertexCollections.hasOwnProperty(toCollectionName)) {
        if(this.isAllowedOutgoingConnection(fromCollectionName,toCollectionName)&&this.isAllowedIncommingConnection(toCollectionName,fromCollectionName)){
          possibleOutgoingCollections.push(toCollectionName)
        }
        // if(this.isAllowedOutgoingConnection(fromCollectionName,toCollectionName)){
        //   console.log(fromCollectionName+' allows connection to '+toCollectionName)
        // }
        // if(this.isAllowedIncommingConnection(fromCollectionName,toCollectionName)){
        //   console.log(toCollectionName+' allows connection from '+fromCollectionName)
        // }
      }
    }
    return possibleOutgoingCollections
  }

  // Cytoscape is required for many methods. This method will check the initiation state
  checkCytoscape () {
    if(typeof this.cy === 'undefined'){
      throw 'Cytoscape is not initiated. Use initiate() method first.'
    }
  }

  destroy () {
    this.checkCytoscape()
    this.cy.destroy()
  }

  addCytoscapeStylesheet(stylesheet){
    this.cytoscapeStylesheets = this.cytoscapeStylesheets.concat(stylesheet)
  }

  addVertex(vertexData){
    this.checkCytoscape()

    let collection = this.getVertexCollection(vertexData._collection)

    var data = {
      id:vertexData._cyid, // Set required cytoscape id
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

    let newCyVertex = this.cy.add({
      data: data,
      position: position,
      classes: collection.cytoscapeClasses
    });

    this.toCytoscape(vertexData)

  }

  toCytoscape(vertexData){
    this.checkCytoscape()
    let cytoscapeData = {}
    let collection = this.getVertexCollection(vertexData._collection);
    if(collection.toCytoscape !== undefined){
      cytoscapeData = collection.toCytoscape(vertexData);
    }
    cytoscapeData.id = vertexData._cyid; // You cannot override the id
    let vertex = this.cy.getElementById(vertexData._cyid);
    vertex.data(cytoscapeData);
  }

}
