import WandererStoreSingleton from 'wanderer-store-singleton'
import WandererCytoscapeSingleton from 'wanderer-cytoscape-singleton'
import Mustache from 'mustache'
import Axios from 'axios'

const uuidv4 = require('uuid/v4');

export default (function () {

  // This configurtaion of babel does not support static properties
  // So I switched back to a self executing function class

  var vertexCollections = {}
  var edgeCollections = {}

  var hooks = {}

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
    if(vertexCollection!= undefined) {
      if (vertexCollection.edgeConditions != undefined) {
        for(var conditionName in vertexCollection.edgeConditions) {
          if(vertexCollection.edgeConditions[conditionName].default) {
            return conditionName
          }
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

      // Reset the chat
      // trigger('truncate')

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

      // Start the traversal
      // traverse()
    }

  }

  async function loadJsonRemote (url) {

    return new Promise((resolve, reject) => {

      Axios.get(url).catch((e) => {
        reject('Diese Datei wurde nicht gefunden oder es liegt ein Netzwrkproblem vor: '+e.message);
      }).then((response) => {

        try {
          load(response.data)
          resolve()
        } catch (e) {
          reject(e);
        }

      })

    })

  }

  async function loadJsonFile (file) {

    return new Promise((resolve, reject) => {

      const reader = new FileReader()

      reader.onload = e => {

        try {
          var data = JSON.parse(e.target.result)
          load(data)

        } catch (e) {
          reject('This file is not a wanderer .json file! '+e)
        }

      }

      reader.readAsText(file)

    })

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

  function getLifecycleData (vertexId) {
    if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[vertexId] != undefined) {
      return WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[vertexId];
    }
    return false;
  }

  function getLifecycleValue (vertexId, key) {
    if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[vertexId] != undefined) {
      if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[vertexId][key] != undefined) {
        return WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[vertexId][key];
      }
    }
    return false;
  }

  function setLifecycleValue (vertexId, key, value) {
    WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
      id: vertexId,
      key: key,
      value: value
    })
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

    // Add compound nodes
    if(vertexData._parent != undefined && vertexData._parent) {
      vertex = vertex.move({
        parent: vertexData._parent
      });
    } else {
      // Remove from compound node
      vertex = vertex.move({
        parent: null
      });
    }

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

  function invokeVertexMethod(targetVertexId, methodName) {

      let targetCytoscapeVertex = WandererCytoscapeSingleton.cy.getElementById(targetVertexId)
      let targetVertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[targetVertexId]
      let targetVertexCollection = getVertexCollection(targetVertexData._collection)
      if(targetVertexCollection.edgeMethods != undefined) {
        if(targetVertexCollection.edgeMethods[methodName] != undefined) {
          targetVertexCollection.edgeMethods[methodName].method(targetCytoscapeVertex, targetVertexData)
        }
      }

  }

  var traversedEdges;
  var traversedVertices;
  var animating = false;
  var animateIn = false;

  function traverse (nodeId, recursiveCall, test) {

    // Get the root node
    if (nodeId == undefined) {
      var nodeId = WandererStoreSingleton.store.state.wanderer.vertexDocumentIds[0]
    }

    // This is not an recursive call if undefined
    if (recursiveCall == undefined) {
      recursiveCall = false;
    }

    // Always do a test trip through the graph!
    if (test == undefined) {
      test = true;
    }

    if (!recursiveCall) {

      // console.log('tick');

      // This is the first call of the recursive stack

      // Forget the traversed edges and vertices from the last traversal
      WandererStoreSingleton.store.commit('wanderer/resetTraversal')

      traversedEdges = WandererCytoscapeSingleton.cy.collection();
      traversedVertices = WandererCytoscapeSingleton.cy.collection();

    }

    if (nodeId) {


      // Get node data
      let currentCytoscapeVertex = WandererCytoscapeSingleton.cy.getElementById(nodeId)
      let currentVertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[nodeId]
      let currentVertexCollection = getVertexCollection(currentVertexData._collection)

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
      var vertexTraversable = true
      if (cytoscapeInboundEdges.length) {
        for (let i in cytoscapeInboundEdges) {
          let currentCytoscapeEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[cytoscapeInboundEdges[i].id()]
          let currentCytoscapeEdgeCollection = getEdgeCollection(currentCytoscapeEdgeData._collection)
          if(currentCytoscapeEdgeCollection.allowTargetTraversal !== undefined) {
            vertexTraversable = currentCytoscapeEdgeCollection.allowTargetTraversal(
              currentCytoscapeVertex,
              currentVertexData,
              cytoscapeInboundEdges[i],
              currentCytoscapeEdgeData,
              WandererStoreSingleton.store.state.wanderer.currentLanguage
            )
            // If one of the inbound edges says NO...
            if(!vertexTraversable) {
              break; // Do not check the other edges
            }
          }
        }
      }

      if (vertexTraversable) {
        // Remember this vertex as visited
        WandererStoreSingleton.store.commit('wanderer/rememberTraversedVertex', currentCytoscapeVertex.id())

        traversedVertices = traversedVertices.union(currentCytoscapeVertex);

        // Is there a visitor available for this kind of node?
        // Only execute the visitor if we are not in test mode
        if(!test) {
          if (currentVertexCollection.visitor) {
            currentVertexCollection.visitor(currentCytoscapeVertex, currentVertexData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
          }
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

          var relatedVertexIds = [];

          // expand the edges
          for (let i in expandEdges) {
            var edgeTraversable = true
            let currentCytoscapeEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[expandEdges[i].id()]
            let currentCytoscapeEdgeCollection = getEdgeCollection(currentCytoscapeEdgeData._collection)
            if(currentCytoscapeEdgeCollection.allowTraversal !== undefined) {
              edgeTraversable = currentCytoscapeEdgeCollection.allowTraversal(
                currentCytoscapeVertex,
                currentVertexData,
                expandEdges[i],
                currentCytoscapeEdgeData,
                WandererStoreSingleton.store.state.wanderer.currentLanguage
              )
            }

            if(edgeTraversable) {

              // Remember this edge as visited
              WandererStoreSingleton.store.commit('wanderer/rememberTraversedEdge', expandEdges[i].id())

              traversedEdges = traversedEdges.union(expandEdges[i]);

              // Call the visitor for this edge if present
              // But only if we are not in test mode
              if(test) {
                if (currentCytoscapeEdgeCollection.testVisitor) {
                  currentCytoscapeEdgeCollection.testVisitor(expandEdges[i], currentCytoscapeEdgeData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
                }
              } else {
                if (currentCytoscapeEdgeCollection.visitor) {
                  currentCytoscapeEdgeCollection.visitor(expandEdges[i], currentCytoscapeEdgeData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
                }
              }

              // Call the selected target node edge method
              if(test) {
                if(currentCytoscapeEdgeData.method != undefined) {
                  invokeVertexMethod(expandEdges[i].target().id(), currentCytoscapeEdgeData.method)
                }
              }

              // Traverse the connected node
              // But only visit this node if it was not visited already before in traversal!
              // We dont want to build a unlimited recursion!
              if(WandererStoreSingleton.store.state.wanderer.traversedVertices.indexOf(expandEdges[i].target().id())==-1) {
                traverse(expandEdges[i].target().id(), true, test)
              }

              // Store this into the vuex store
              relatedVertexIds.push(expandEdges[i].target().id());



            }

          } // For each expandable edge

          // Store the possible vertices for each vertex inside vuex
          WandererStoreSingleton.store.commit('wanderer/setVertexRelations', {
            vertexId: nodeId,
            vertexRelations: relatedVertexIds
          })

        } // foreach expand edge

        // Call the finisher method for this vertex
        // That means, that we have now followed all the outgoing edges of this node
        // We are on our way back to the top
        // if(!test) {
        //   if (currentVertexCollection.finisher !== undefined) {
        //     currentVertexCollection.finisher(currentCytoscapeVertex, currentVertexData);
        //   }
        // }

      }

    }

    // Is this the first function call in the recursive stack?
    if (!recursiveCall) {

      if(test) {
        // Now start the real traversal.
        // Without testing the track
        traverse(nodeId, false, false)
      } else {

        // Finish the current traversal by emittig the event
        trigger('traversalFinished')

        // Start a pulsing animation for the traversed path (Fade out)
        if(!animating) {

          // Stop all running animations
          WandererCytoscapeSingleton.cy.nodes().stop();
          WandererCytoscapeSingleton.cy.edges().stop();

          animating = true;
          animateIn = !animateIn;
          var opacity = 0.7;
          var pulseTime = 800;

          if (animateIn) {
            opacity = 1;
            pulseTime = 200;
          }

          traversedEdges.animate({
            style: { 'opacity': opacity },
          }, {
            duration: pulseTime,
          });

          traversedVertices.animate({
            style: { 'background-opacity': opacity },
          }, {
            duration: pulseTime,
          });

          setTimeout(function() {
            animating = false;
          }, pulseTime)

        }

        // Restart the traversal tick
        setTimeout(function() {

          traverse()

        }, 1000)

      }

    }

  }

  var initiated = false;

  function init () {

    // Initiate the wanderer only once
    if(!initiated) {

      // Start traverrsal
      traverse()

      initiated = true
    }
  }

  function setLanguage(language) {
    WandererStoreSingleton.store.commit('wanderer/setCurrentLanguage', language)

    // Rebuild cytoscape data
    for(let i in WandererStoreSingleton.store.state.wanderer.vertexDocumentIds){
      vertexToCytoscape(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[WandererStoreSingleton.store.state.wanderer.vertexDocumentIds[i]])
    }

    for(let i in WandererStoreSingleton.store.state.wanderer.edgeDocumentIds){
      edgeToCytoscape(WandererStoreSingleton.store.state.wanderer.edgeDocumentData[WandererStoreSingleton.store.state.wanderer.edgeDocumentIds[i]])
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
    getLifecycleData: getLifecycleData,
    getLifecycleValue: getLifecycleValue,
    setLifecycleValue: setLifecycleValue,
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
    invokeVertexMethod: invokeVertexMethod,
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
    getLanguages: getLanguages,
    setLanguage: setLanguage,
    init: init
  }

}())
