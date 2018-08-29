import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import defaultPlugin from 'wanderer-vue-brain-plugin-default'
import Vuex from 'vuex'

cytoscape.use( cxtmenu );

export default class Brain {

  constructor (Vue, options) {
    // this.Vue = Vue;
    this.vertexCollections = {}
    this.edgeCollections = {}
  }

  use (plugin) {
    plugin.install(this)
  }

  // This is a store factory that can be used by brain plugins to create own independent stores
  storeFactory (options) {
    this.Vue.use(Vuex)
    return new Vuex.Store(options)
  }

  registerVertexCollection (name,configuration) {
    this.vertexCollections[name] = configuration // Register the collection
  }

  registerEdgeCollection (name,configuration) {
    this.edgeCollections[name] = configuration // Register the collection
  }

  getVertexCollection(name){
    if(this.vertexCollections[name] === undefined){
      return this.vertexCollections['default']
    }
    return this.vertexCollections[name]
  }

  // Extra initiation is important because we may have to wait for a dom element if cy runs not headless
  initCytoscape (config) {
    this.cy = cytoscape(config)
    this.use(defaultPlugin)

    // Init ctx menu
    for(var fromCollectionName in this.vertexCollections){
      if (this.vertexCollections.hasOwnProperty(fromCollectionName)) {

        let cxtmenuCommands = []; // an array of commands to list in the menu or a function that returns the array

        for(let toCollectionName in this.vertexCollections){
          if (this.vertexCollections.hasOwnProperty(toCollectionName)) {
            if(this.vertexCollections[toCollectionName].createable){
              (function(toCollectionName,parent) {
                cxtmenuCommands.push({
                fillColor: parent.vertexCollections[toCollectionName].color,
                content: 'add '+parent.vertexCollections[toCollectionName].label,
                select: function(vertex){
                  vertex.trigger('append', toCollectionName)
                }
                });
              })(toCollectionName,this);
            }
          }

        }

        // Contextmenu
        var cxtmenuApi = this.cy.cxtmenu( {
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
    this.cy.on('append', 'node', function(evt, newCollectionName){

      // Deep clone the default fields
      let newVertexData = JSON.parse(JSON.stringify(this.vertexCollections[newCollectionName].defaultFields))

      // Get the referer vertex data
      let refererVertexPosition = this.position()

      // Add base data
      // newVertexData._cyid = component.$utils.generateRandomId();
      // newVertexData._collection = newCollectionName;
      // newVertexData._isOrigin = false;

    })

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
    // Apply the style
    this.cy.style(stylesheet)
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
