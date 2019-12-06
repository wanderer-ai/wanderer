import WandererStoreSingleton from 'wanderer-store-singleton'
import WandererCytoscapeSingleton from 'wanderer-cytoscape-singleton'
import Mustache from 'Mustache'
import Axios from 'axios'

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

  function registerVertexCollection (configuration) {
    vertexCollections[configuration.name] = configuration // Register the collection
  }

  function registerEdgeCollection (configuration) {
    edgeCollections[configuration.name] = configuration // Register the collection
  }

  function getVertexCollections () {
    return vertexCollections
  }

  function getEdgeCollections () {
    return edgeCollections
  }

  function getVertexCollection(name) {
    if(vertexCollections[name] === undefined) {
      return vertexCollections['default']
    }
    return vertexCollections[name]
  }

  function getVertexCollectionById(id) {
    let vertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[id]
    if(vertexData) {
      return getVertexCollection(vertexData._collection)
    }
    return false
  }

  function getVertexCollectionDefaultExposeField(name) {
    var vertexCollection = getVertexCollection(name)
    if (vertexCollection.lifecycleData != undefined) {
      for(var dataName in vertexCollection.lifecycleData) {
        if(vertexCollection.lifecycleData[dataName].exposeDefault) {
          return dataName
        }
      }
    }
    return false
  }

  function getVertexCollectionDefaultEdgeCondition(name) {
    var vertexCollection = getVertexCollection(name)
    if (vertexCollection.edgeConditions != undefined) {
      for(var conditionName in vertexCollection.edgeConditions) {
        if(vertexCollection.edgeConditions[conditionName].default) {
          return conditionName
        }
      }
    }
    return false
  }

  function getEdgeCollection(name) {
    if(edgeCollections[name] === undefined) {
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

    if (vertexData._origin) {

      var position = {
        x: 0,
        y: 0
      }

      // Remember the origin node id
      WandererStoreSingleton.store.commit('wanderer/setOriginVertex', vertexData._id)

    }

    // Add vertex to Cytoscape
    let newCyVertex = WandererCytoscapeSingleton.cy.add({
      data: data,
      position: position,
      classes: collection.builder.cytoscapeClasses
    })

    // Convert data to Cytoscape if needed
    vertexToCytoscape(vertexData)

    // Add the default lifecycledata to the vertex by deep cloning it
    // let lifecycleData = {}
    // if(collection.defaultLifecycleData!=undefined) {
    //   lifecycleData = JSON.parse(JSON.stringify(collection.defaultLifecycleData))
    // }

    // Add data to store
    // WandererStoreSingleton.store.commit('wanderer/addVertex', {vertexData: vertexData, lifecycleData: lifecycleData})
    WandererStoreSingleton.store.commit('wanderer/addVertex', {vertexData: vertexData})

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

    // Convert data to Cytoscape if needed
    edgeToCytoscape(edgeData)

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

    if(data.wanderer == undefined) {
      throw('This data does not look like a wanderer flow :-(')
    } else {
      // Load the data

      // Clean cy
      WandererCytoscapeSingleton.cy.remove( '*' )

      // Clean store
      WandererStoreSingleton.store.commit('wanderer/truncate')

      // Emit the truncate event
      trigger('truncate')

      // Load vertices
      for (var key in data.vertices) {
        addVertex(data.vertices[key])
      }

      // Load edges
      for (var key in data.edges) {
        addEdge(data.edges[key])
      }

      // Center cytoscape to the flow vertex
      // This should be the first vertex is list
      WandererCytoscapeSingleton.cy.center(WandererCytoscapeSingleton.cy.$id(data.vertices[0]._id))
      WandererCytoscapeSingleton.cy.zoom(1)
    }

  }

  async function loadJsonRemote (url) {

    const response = await Axios.get(url);
    load(response.data)

  }

  async function loadJsonFile (file) {

    const reader = new FileReader()

    reader.onload = e => {

      try {

        var data = JSON.parse(e.target.result)

        load(data)

      } catch (e) {
        // console.log('Schlimme Dinge')
        throw('This file is not a wanderer .json file!')
      }


    }

    reader.readAsText(file)

  }

  function findNodeIdByName (name) {
    for (var key in WandererStoreSingleton.store.state.wanderer.vertexDocumentData) {
      if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData.hasOwnProperty(key)){
        if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[key].name === name) {
          return WandererStoreSingleton.store.state.wanderer.vertexDocumentData[key]._id
        }
      }
    }
    return false;
  }

  function replaceWithLifecycleData (value, contextVertexId) {

    if(typeof value !== 'string') {
      return value
    }

    // Get all incomming edges that was already traversed from the contextVertexId
    let cytoscapeVertex = WandererCytoscapeSingleton.cy.getElementById(contextVertexId)

    // Get all edges from this vertex
    let cytoscapeEdges = cytoscapeVertex.connectedEdges()

    // Collect the template data from the inbound edges and their source vertices
    let templateData = {}
    cytoscapeEdges.forEach(function(currentCytoscapeEdge) {
      // Filter inbound edges
      if(cytoscapeVertex.id()==currentCytoscapeEdge.data('target')) {
        // Check if these edges had been traversed
        if(WandererStoreSingleton.store.state.wanderer.traversedEdges.indexOf(currentCytoscapeEdge.id())!=-1) {
          // Check if these edges have a name
          if(WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()] != undefined) {
            if(WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].name) {

              // If this edge exposes data from the source vertex
              if(WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].expose) {
                // Get the data from the vertex
                if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[currentCytoscapeEdge.data('source')] != undefined) {
                  var data = WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[currentCytoscapeEdge.data('source')][WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].expose]
                  templateData[WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].name] = data
                }
              } else {
                // We have no exposed variable but we have a name
                // So lets set this data to true
                templateData[WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].name] = true
              }
            }
          }
        }
      }
    })

    try {
      value = Mustache.render(value, templateData);
    } catch {

    }

    return value;

  }

  function getVertexValue (vertexId, key) {
    if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId] !== undefined){
      return replaceWithLifecycleData(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key], vertexId)
    }
  }

  function getTranslatableVertexValue (vertexId, key) {
    if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId] !== undefined){
      if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key] !== undefined){
        return replaceWithLifecycleData(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key][WandererStoreSingleton.store.state.wanderer.currentLanguage], vertexId)
      }
    }
  }

  function vertexToCytoscape (vertexData) {
    let cytoscapeData = {}
    let collection = getVertexCollection(vertexData._collection)
    if(collection.toCytoscape !== undefined){
      cytoscapeData = collection.toCytoscape(vertexData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
    }
    cytoscapeData.id = vertexData._id; // You cannot override the id
    let vertex = WandererCytoscapeSingleton.cy.getElementById(vertexData._id)
    vertex.data(cytoscapeData)
  }

  function edgeToCytoscape (edgeData) {
    let cytoscapeData = {}
    let collection = getEdgeCollection(edgeData._collection)
    if(collection.toCytoscape !== undefined){
      cytoscapeData = collection.toCytoscape(edgeData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
    }
    cytoscapeData.id = edgeData._id; // You cannot override the id
    let edge = WandererCytoscapeSingleton.cy.getElementById(edgeData._id)
    edge.data(cytoscapeData)
  }

  function generateId () {
    return uuidv4()
  }

  /*function getValueModel(key){
    return {
      get(){
        if(StoreSingleton.store.state.wanderer.collectedValues){
          if(StoreSingleton.store.state.wanderer.collectedValues[StoreSingleton.store.state.wanderer.builder.editVertex] !== undefined){
            return StoreSingleton.store.state.wanderer.vertexDocumentData[StoreSingleton.store.state.wanderer.builder.editVertex][key]
          }
        }
      },
      set(data){
        StoreSingleton.store.commit('wanderer/setVertexDataValue', {
          id: StoreSingleton.store.state.wanderer.builder.editVertex,
          key: key,
          value: data
        })
      }
    }
  }*/

  function traverse (nodeId, recursiveCall) {
    if (nodeId == undefined) {
      var nodeId = WandererStoreSingleton.store.state.wanderer.vertexDocumentIds[0]
    }

    // Get node data
    let currentCytoscapeVertex = WandererCytoscapeSingleton.cy.getElementById(nodeId)
    let currentVertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[nodeId]
    let currentVertexCollection = getVertexCollection(currentVertexData._collection)

    if (recursiveCall == undefined) {

      // This is the first call of the recursive stack

      // Forget the traversed edges and vertices from the last traversal
      WandererStoreSingleton.store.commit('wanderer/resetTraversal')


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

    // if(currentVertexData._collection=='conclusion'){
    //   console.log('found conclusion')
    //   console.log(cytoscapeInboundEdges)
    // }

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
          // If one of the inbound edges says NO...
          if(!traversable) {
            break; // Do not check the other edges
          }
        }
      }
    }

    if (traversable) {
      // Remember this vertex as visited
      // visitorData._visitedVertices.push(currentCytoscapeVertex.id())
      WandererStoreSingleton.store.commit('wanderer/rememberTraversedVertex', currentCytoscapeVertex.id())

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
        // Sort the outbound edges
        expandEdges = expandEdges.sort(function(a, b) {
            return WandererStoreSingleton.store.state.wanderer.edgeDocumentData[b.id()]['priority']-WandererStoreSingleton.store.state.wanderer.edgeDocumentData[a.id()]['priority']
        })

        // console.log('expanding edges')
        //
        // for (let i in expandEdges) {
        //   console.log(expandEdges[i].id());
        // }

        // expand the edges
        for (let i in expandEdges) {
          var traversable = true
          let currentCytoscapeEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[expandEdges[i].id()]
          let currentCytoscapeEdgeCollection = getEdgeCollection(currentCytoscapeEdgeData._collection)
          if(currentCytoscapeEdgeCollection.allowTraversal !== undefined) {
            traversable = currentCytoscapeEdgeCollection.allowTraversal(
              currentCytoscapeVertex,
              currentVertexData,
              expandEdges[i],
              currentCytoscapeEdgeData,
              WandererStoreSingleton.store.state.wanderer.currentLanguage
            )
          }

          if(traversable){

            // Remember this edge as visited
            // visitorData._visitedEdges.push(expandEdges[i].id())
            WandererStoreSingleton.store.commit('wanderer/rememberTraversedEdge', expandEdges[i].id())

            // Get edge information
            // let EdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[expandEdges[i].id()]
            // let EdgeCollection = getEdgeCollection(EdgeData._collection)

            // Call the visitor for this edge if present
            if (currentCytoscapeEdgeCollection.visitor) {
              currentCytoscapeEdgeCollection.visitor(expandEdges[i], currentCytoscapeEdgeData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
            }

            // traverse the node
            traverse(expandEdges[i].target().id(), true)

          }

        }
      }
    }

    // Is this the first function call in the recursive stack?
    if (recursiveCall == undefined) {
      // That means we have reached the end of the traversal
      // Check the finisher function for all vertices
      // This function gets executed if all vertice collections decide not to repeat the traversal for the flow
      // This means the program is finaly over
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

      // Finish the current traversal by emittig the event
      trigger('traversalFinished')

      if (flowFinished) {
        trigger('flowFinished')
      }
    }

  }

  function getLanguages() {
    return {
      aa: {name: 'Afar'},
      ab: {name: 'Abkhazian'},
      af: {name: 'Afrikaans'},
      am: {name: 'Amharic'},
      ar: {name: 'Arabic'},
      as: {name: 'Assamese'},
      ay: {name: 'Aymara'},
      az: {name: 'Azerbaijani'},
      ba: {name: 'Bashkir'},
      be: {name: 'Byelorussian'},
      bg: {name: 'Bulgarian'},
      bh: {name: 'Bihari'},
      bi: {name: 'Bislama'},
      bn: {name: 'Bengali'},
      bo: {name: 'Tibetan'},
      br: {name: 'Breton'},
      ca: {name: 'Catalan'},
      co: {name: 'Corsican'},
      cs: {name: 'Czech'},
      cy: {name: 'Welch'},
      da: {name: 'Danish'},
      de: {name: 'German'},
      dz: {name: 'Bhutani'},
      el: {name: 'Greek'},
      en: {name: 'English'},
      eo: {name: 'Esperanto'},
      es: {name: 'Spanish'},
      et: {name: 'Estonian'},
      eu: {name: 'Basque'},
      fa: {name: 'Persian'},
      fi: {name: 'Finnish'},
      fj: {name: 'Fiji'},
      fo: {name: 'Faeroese'},
      fr: {name: 'French'},
      fy: {name: 'Frisian'},
      ga: {name: 'Irish'},
      gd: {name: 'Scots Gaelic'},
      gl: {name: 'Galician'},
      gn: {name: 'Guarani'},
      gu: {name: 'Gujarati'},
      ha: {name: 'Hausa'},
      hi: {name: 'Hindi'},
      he: {name: 'Hebrew'},
      hr: {name: 'Croatian'},
      hu: {name: 'Hungarian'},
      hy: {name: 'Armenian'},
      ia: {name: 'Interlingua'},
      id: {name: 'Indonesian'},
      ie: {name: 'Interlingue'},
      ik: {name: 'Inupiak'},
      in: {name: 'former Indonesian'},
      is: {name: 'Icelandic'},
      it: {name: 'Italian'},
      iu: {name: 'Inuktitut (Eskimo)'},
      iw: {name: 'former Hebrew'},
      ja: {name: 'Japanese'},
      ji: {name: 'former Yiddish'},
      jw: {name: 'Javanese'},
      ka: {name: 'Georgian'},
      kk: {name: 'Kazakh'},
      kl: {name: 'Greenlandic'},
      km: {name: 'Cambodian'},
      kn: {name: 'Kannada'},
      ko: {name: 'Korean'},
      ks: {name: 'Kashmiri'},
      ku: {name: 'Kurdish'},
      ky: {name: 'Kirghiz'},
      la: {name: 'Latin'},
      ln: {name: 'Lingala'},
      lo: {name: 'Laothian'},
      lt: {name: 'Lithuanian'},
      lv: {name: 'Latvian, Lettish'},
      mg: {name: 'Malagasy'},
      mi: {name: 'Maori'},
      mk: {name: 'Macedonian'},
      ml: {name: 'Malayalam'},
      mn: {name: 'Mongolian'},
      mo: {name: 'Moldavian'},
      mr: {name: 'Marathi'},
      ms: {name: 'Malay'},
      mt: {name: 'Maltese'},
      my: {name: 'Burmese'},
      na: {name: 'Nauru'},
      ne: {name: 'Nepali'},
      nl: {name: 'Dutch'},
      no: {name: 'Norwegian'},
      oc: {name: 'Occitan'},
      om: {name: '(Afan) Oromo'},
      or: {name: 'Oriya'},
      pa: {name: 'Punjabi'},
      pl: {name: 'Polish'},
      ps: {name: 'Pashto, Pushto'},
      pt: {name: 'Portuguese'},
      qu: {name: 'Quechua'},
      rm: {name: 'Rhaeto-Romance'},
      rn: {name: 'Kirundi'},
      ro: {name: 'Romanian'},
      ru: {name: 'Russian'},
      rw: {name: 'Kinyarwanda'},
      sa: {name: 'Sanskrit'},
      sd: {name: 'Sindhi'},
      sg: {name: 'Sangro'},
      sh: {name: 'Serbo-Croatian'},
      si: {name: 'Singhalese'},
      sk: {name: 'Slovak'},
      sl: {name: 'Slovenian'},
      sm: {name: 'Samoan'},
      sn: {name: 'Shona'},
      so: {name: 'Somali'},
      sq: {name: 'Albanian'},
      sr: {name: 'Serbian'},
      ss: {name: 'Siswati'},
      st: {name: 'Sesotho'},
      su: {name: 'Sudanese'},
      sv: {name: 'Swedish'},
      sw: {name: 'Swahili'},
      ta: {name: 'Tamil'},
      te: {name: 'Tegulu'},
      tg: {name: 'Tajik'},
      th: {name: 'Thai'},
      ti: {name: 'Tigrinya'},
      tk: {name: 'Turkmen'},
      tl: {name: 'Tagalog'},
      tn: {name: 'Setswana'},
      to: {name: 'Tonga'},
      tr: {name: 'Turkish'},
      ts: {name: 'Tsonga'},
      tt: {name: 'Tatar'},
      tw: {name: 'Twi'},
      ug: {name: 'Uigur'},
      uk: {name: 'Ukrainian'},
      ur: {name: 'Urdu'},
      uz: {name: 'Uzbek'},
      vi: {name: 'Vietnamese'},
      vo: {name: 'Volapuk'},
      wo: {name: 'Wolof'},
      xh: {name: 'Xhosa'},
      yi: {name: 'Yiddish'},
      yo: {name: 'Yoruba'},
      za: {name: 'Zhuang'},
      zh: {name: 'Chinese'},
      zu: {name: 'Zulu'},
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
    getVertexCollectionDefaultEdgeCondition: getVertexCollectionDefaultEdgeCondition,
    getVertexCollectionDefaultExposeField: getVertexCollectionDefaultExposeField,
    getVertexCollectionById: getVertexCollectionById,
    getEdgeCollection: getEdgeCollection,
    addVertex: addVertex,
    addEdge: addEdge,
    load: load,
    loadJsonRemote: loadJsonRemote,
    loadJsonFile: loadJsonFile,
    removeVertex: removeVertex,
    removeEdge: removeEdge,
    getVertexValue: getVertexValue,
    getTranslatableVertexValue: getTranslatableVertexValue,
    vertexToCytoscape: vertexToCytoscape,
    edgeToCytoscape: edgeToCytoscape,
    generateId: generateId,
    traverse: traverse,
    getLanguages: getLanguages
  }

}())
