// import {WandererGraph} from 'wanderer-graph'
const uuidv4 = require('uuid/v4')
// import WandererNestedData from 'wanderer-nested-data'
import WandererBroadcast from 'wanderer-broadcast'
// import Mustache from 'mustache'
// import Axios from 'axios'
//
// var md = require('markdown-it')({
//   html:         false,       // Enable HTML tags in source
//   breaks:       true,        // Convert '\n' in paragraphs into <br>
//   linkify:      false        // Autoconvert URL-like text to links
// });
// const jexl = require('jexl')
// const uuidv4 = require('uuid/v4');

export default class Wanderer {

  constructor() {
    this.dependencies = {}
    this.broadcast = new WandererBroadcast ({

      addVertexCollectionProps: function (collectionName, props) {
        this.emit('addVertexCollectionProps', {
          collectionName: collectionName,
          props: props
        })
      },

      addEdgeCollectionProps: function (collectionName, props) {
        this.emit('addEdgeCollectionProps', {
          collectionName: collectionName,
          props: props
        })
      },

      setLanguage: function (language) {
        this.emit('setLanguage', language)
      },

      truncate: function () {
        this.emit('truncate')
      },

      addVertexFromData: function (vertexData) {
        this.emit('addVertex', vertexData)
      },

      addEdgeFromData: function (edgeData) {
        this.emit('addEdge', edgeData)
      },

      removeVertex: function (vertexId) {
        this.emit('removeVertex', vertexId)
      },

      removeEdge: function (edgeId) {
        this.emit('removeEdge', edgeId)
      },

      setVertexDataValue: function (id, key, value, language) {
        this.emit('setVertexDataValue', {
          id: id,
          key: key,
          value: value,
          language: language
        })
      },

      setEdgeDataValue: function (id, key, value, language) {
        this.emit('setEdgeDataValue', {
          id: id,
          key: key,
          value: value,
          language: language
        })
      }

    })

    this.subscriber = this.broadcast.subscribe('wanderer')

  }

  use(plugin) {
    if(plugin.install !== undefined) {
      plugin.install(this)
    }
  }

  provide(key, value) {
    this.dependencies[key] = value
  }

  require(key) {
    if(this.dependencies[key] !== undefined) {
      return this.dependencies[key]
    }
    throw 'The dependency "'+key+'" is required! Please provide it first!';
  }

  regenerateJsonDataIds (data) {

    let dataString = JSON.stringify(data);

    for(let i in data.vertices){
      let oldId = data.vertices[i]._id
      let newId = uuidv4()
      var re = new RegExp(oldId, 'g')
      dataString = dataString.replace(re,newId)
    }

    for(let i in data.edges){
      let oldId = data.edges[i]._id
      let newId = uuidv4()
      var re = new RegExp(oldId, 'g')
      dataString = dataString.replace(re,newId)
    }

    return JSON.parse(dataString)
  }

  checkImportData (data) {
    // Search for the origin node
    for (var key in data.vertices) {
      if(data.vertices[key]['_collection'] == 'flow') {
        if(data.vertices[key]['builder'] == 'wanderer.ai') {
          return true;
        }
      }
    }
    // throw('This data does not look like a wanderer flow :-(')
  }

  loadFromData (data) {

    // Check the import data
    this.checkImportData(data)

    // Emit truncate event
    this.subscriber.truncate()

    // Load vertices
    for (var key in data.vertices) {
      this.subscriber.addVertexFromData(data.vertices[key])
    }

    // Load edges
    for (var key in data.edges) {
      this.subscriber.addEdgeFromData(data.edges[key])
    }

  }

  async loadFromFile (file) {

    return new Promise((resolve, reject) => {

      const reader = new FileReader()

      reader.onload = e => {

        // try {
          var data = JSON.parse(e.target.result)
          this.loadFromData(data)
          resolve()

        // } catch (e) {
          reject('This file is not a wanderer .json file! '+e)
        // }

      }

      reader.readAsText(file)

    })

  }

  getLanguages() {
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

  // addEdge (edgeData) {
  //
  //   let collection = getEdgeCollection(edgeData._collection)
  //
  //   // Make the edge immutable if on of the connected nodes are also immutable
  //   if(
  //     getVertexValue(edgeData._from, '_immutable') ||
  //     getVertexValue(edgeData._to, '_immutable')
  //   ) {
  //     edgeData['_immutable'] = true
  //   }
  //
  //   if(collection) {
  //
  //     try {
  //
  //       let cytoscapeEdge = WandererCytoscapeSingleton.cy.add({
  //         data: {
  //           id: edgeData._id, //Set required cytoscape id
  //           source: edgeData._from, //Set cytoscape source
  //           target: edgeData._to //Set cytoscape target
  //         },
  //         classes: collection.builder.cytoscapeClasses
  //       });
  //
  //       // Convert data to Cytoscape if needed
  //       edgeToCytoscape(edgeData)
  //
  //       // Add data to store
  //       WandererStoreSingleton.store.commit('wanderer/addEdge', edgeData)
  //
  //       // Call the collections afterCreate Hook
  //       if(collection.afterCreate) {
  //         collection.afterCreate(cytoscapeEdge, edgeData);
  //       }
  //
  //       // Trigger afterAddEdge event
  //       trigger('afterAddEdge');
  //
  //     } catch (e) {
  //
  //       console.log(e);
  //
  //     }
  //
  //   }
  //
  // }
  //


}
//
// export default (function () {
//
//   // This configurtaion of babel does not support static properties
//   // So I switched back to a self executing function class
//
//   var vertexCollections = {}
//   var edgeCollections = {}
//
//
//   function registerVertexCollection (configuration) {
//     vertexCollections[configuration.name] = configuration // Register the collection
//   }
//
//   function registerEdgeCollection (configuration) {
//     edgeCollections[configuration.name] = configuration // Register the collection
//   }
//
//   function getVertexCollections () {
//     return vertexCollections
//   }
//
//   function getEdgeCollections () {
//     return edgeCollections
//   }
//
//   function getVertexCollection(name) {
//     if(vertexCollections[name] === undefined) {
//       return vertexCollections['default']
//     }
//     return vertexCollections[name]
//   }
//
//   function getVertexCollectionById(id) {
//     let vertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[id]
//     if(vertexData) {
//       return getVertexCollection(vertexData._collection)
//     }
//     return false
//   }
//
//   function getEdgeCollectionById(id) {
//     let edgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[id]
//     if(edgeData) {
//       return getEdgeCollection(edgeData._collection)
//     }
//     return false
//   }
//
//   function getVertexCollectionDefaultExposeField(name) {
//     var vertexCollection = getVertexCollection(name)
//     if (vertexCollection.lifecycleData != undefined) {
//       for(var dataName in vertexCollection.lifecycleData) {
//         if(vertexCollection.lifecycleData[dataName].exposeDefault) {
//           return dataName
//         }
//       }
//     }
//     return false
//   }
//
//   function getVertexCollectionDefaultEdgeCondition(name) {
//     var vertexCollection = getVertexCollection(name)
//     if(vertexCollection!= undefined) {
//       if (vertexCollection.edgeConditions != undefined) {
//         for(var conditionName in vertexCollection.edgeConditions) {
//           if(vertexCollection.edgeConditions[conditionName].default) {
//             return conditionName
//           }
//         }
//       }
//     }
//     return false
//   }
//
//   function getEdgeCollection(name) {
//     if(edgeCollections[name] === undefined) {
//       return edgeCollections['default']
//     }
//     return edgeCollections[name]
//   }
//
//
//   function removeImmutableData () {
//
//     let edges = WandererStoreSingleton.store.state.wanderer.edgeDocumentData
//     let vertices = WandererStoreSingleton.store.state.wanderer.vertexDocumentData
//
//     for(var i in edges) {
//       if(edges.hasOwnProperty(i)) {
//         if(edges[i]._immutable) {
//           removeEdge(edges[i]._id);
//         }
//       }
//     }
//
//     for(var i in vertices) {
//       if(vertices.hasOwnProperty(i)) {
//         if(vertices[i]._immutable) {
//           removeVertex(vertices[i]._id);
//         }
//       }
//     }
//
//   }
//
//   function checkImportData (data) {
//     // Search for the origin node
//     for (var key in data.vertices) {
//       if(data.vertices[key]['_collection'] == 'flow') {
//         if(data.vertices[key]['builder'] == 'wanderer.ai') {
//           return true;
//         }
//       }
//     }
//     return false;
//   }
//
//   function importData (data, parentVertexId) {
//     if(!checkImportData(data)) {
//       throw('This data does not look like a wanderer flow :-(')
//     } else {
//
//       // Add the parent position to the children positions
//       let parentPosition = {
//         x: 0,
//         y: 0
//       }
//       if(parentVertexId) {
//         parentPosition = WandererCytoscapeSingleton.cy.getElementById( parentVertexId ).position()
//       }
//
//       let importFlowId = null;
//
//       // Load vertices
//       for (var key in data.vertices) {
//
//         // Do not import the flow vertex
//         if(data.vertices[key]['_collection'] != 'flow') {
//
//           // If we must import this data relative to a parent
//           if(parentVertexId) {
//             // Update the positions of the imported nodes
//             data.vertices[key]['_x'] = data.vertices[key]['_x'] + parentPosition.x
//             data.vertices[key]['_y'] = data.vertices[key]['_y'] + parentPosition.y
//           }
//
//           // Mark the data as immutable before loading
//           data.vertices[key]['_immutable'] = true
//
//           // Add the new vertex
//           let cyVertex = addVertex(data.vertices[key], true)
//
//           // if(parentVertexId) {
//           //
//           //   // Move the newly created vertex optically to the parent node
//           //   cyVertex.move({
//           //     parent: WandererCytoscapeSingleton.cy.getElementById( parentVertexId )
//           //   });
//           //
//           // }
//
//         } else {
//           // Remember the flow id
//           importFlowId = data.vertices[key]['_id']
//         }
//
//       }
//
//       // Load edges
//       for (var key in data.edges) {
//
//         // Mark the data as immutable before loading
//         data.edges[key]['_immutable'] = true
//
//         // Replace the flow vertex id
//         if(data.edges[key]['_from'] == importFlowId) {
//           data.edges[key]['_from'] = parentVertexId
//         }
//
//         if(data.edges[key]['_to'] == importFlowId) {
//           data.edges[key]['_to'] = parentVertexId
//         }
//
//         addEdge(data.edges[key], true)
//       }
//
//     }
//   }
//
//   async function importJsonRemote (url, vertexId) {
//     return new Promise((resolve, reject) => {
//       Axios.get(url).catch((e) => {
//         reject('Diese Datei wurde nicht gefunden oder es liegt ein Netzwrkproblem vor: '+e.message);
//       }).then((response) => {
//         try {
//           importData(response.data, vertexId)
//           resolve()
//         } catch (e) {
//           reject(e);
//         }
//       })
//     })
//   }
//

//
//   async function loadJsonRemote (url) {
//     return new Promise((resolve, reject) => {
//       Axios.get(url).catch((e) => {
//         reject('Diese Datei wurde nicht gefunden oder es liegt ein Netzwrkproblem vor: '+e.message);
//       }).then((response) => {
//         try {
//           load(response.data)
//           resolve()
//         } catch (e) {
//           reject(e);
//         }
//       })
//     })
//   }
//

//
//   function findNodeIdByName (name) {
//     for (var key in WandererStoreSingleton.store.state.wanderer.vertexDocumentData) {
//       if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData.hasOwnProperty(key)){
//         if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[key].name === name) {
//           return WandererStoreSingleton.store.state.wanderer.vertexDocumentData[key]._id
//         }
//       }
//     }
//     return false;
//   }
//
//   function getLifecycleData (vertexId) {
//     if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[vertexId] != undefined) {
//       return WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[vertexId];
//     }
//     return false;
//   }
//
//   function getLifecycleValue (vertexId, key) {
//     if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[vertexId] != undefined) {
//       if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[vertexId][key] != undefined) {
//         return WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[vertexId][key];
//       }
//     }
//     return false;
//   }
//
//   function setLifecycleValue (vertexId, key, value) {
//     WandererStoreSingleton.store.commit('wanderer/setVertexLifecycleData', {
//       id: vertexId,
//       key: key,
//       value: value
//     })
//   }
//
//   function getIncommingLifecycleData (contextVertexId) {
//
//     // Get all incomming edges that was already traversed from the contextVertexId
//     var cytoscapeVertex = WandererCytoscapeSingleton.cy.getElementById(contextVertexId)
//
//     // Get all edges from this vertex
//     var cytoscapeEdges = cytoscapeVertex.connectedEdges()
//
//     // Collect the template data from the inbound edges and their source vertices
//     var templateData = {}
//
//     cytoscapeEdges.forEach(function(currentCytoscapeEdge) {
//       // Filter inbound edges
//       if(cytoscapeVertex.id()==currentCytoscapeEdge.data('target')) {
//         // Check if these edges had been traversed
//         if(traversedEdgeIds.indexOf(currentCytoscapeEdge.id())!=-1) {
//
//           // If this edge exists in the data store
//           if(WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()] != undefined) {
//             // Check if these edges have a name
//             // if(WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].name) {
//
//               // If this edge exposes data from the source vertex
//               if(WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].expose) {
//                 // Get the data from the vertex
//                 if(WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[currentCytoscapeEdge.data('source')] != undefined) {
//
//                   // the name of the expose is the default name for the variable
//                   var exposeAs = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].expose;
//
//                   // If there is a name defined take the name as the variable name
//                   if(WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].name) {
//                     exposeAs = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].name
//                   }
//
//                   var data = WandererStoreSingleton.store.state.wanderer.vertexLifecycleData[currentCytoscapeEdge.data('source')][WandererStoreSingleton.store.state.wanderer.edgeDocumentData[currentCytoscapeEdge.id()].expose]
//
//                   // If the data is numeric
//                   if(!isNaN(data)) {
//                     // Convert it to int
//                     data = parseInt(data)
//                   }
//
//                   templateData[exposeAs] = data
//                 }
//               }
//
//           }
//         }
//       }
//     })
//
//     return templateData;
//
//   }
//
//   function evaluateVertexTemplate (template, vertexId) {
//     if(typeof template !== 'string') {
//       return template
//     }
//
//     var data = getIncommingLifecycleData(vertexId)
//
//     try {
//       return Mustache.render(template, data);
//     } catch {
//
//     }
//   }
//
//   function evaluateVertexExpression (expression, vertexId) {
//
//     var data = getIncommingLifecycleData(vertexId)
//
//     try {
//       return jexl.evalSync(expression, data)
//     } catch {
//
//     }
//   }
//
//   function markdown2html (template) {
//     try {
//       return md.render(template)
//     } catch {
//
//     }
//   }
//
//   function getVertexValue (vertexId, key) {
//     if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId] !== undefined){
//       return WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key]
//     }
//     return undefined
//   }
//
//   function getEdgeValue (edgeId, key) {
//     if(WandererStoreSingleton.store.state.wanderer.edgeDocumentData[edgeId] !== undefined){
//       return WandererStoreSingleton.store.state.wanderer.edgeDocumentData[edgeId][key]
//     }
//     return undefined
//   }
//
//   function getTranslatableVertexValue (vertexId, key) {
//     if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId] !== undefined){
//       if(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key] !== undefined){
//         return WandererStoreSingleton.store.state.wanderer.vertexDocumentData[vertexId][key][WandererStoreSingleton.store.state.wanderer.currentLanguage]
//       }
//     }
//   }
//
//   function vertexToCytoscape (vertexData) {
//     let cytoscapeData = {}
//     let collection = getVertexCollection(vertexData._collection)
//     if(collection.toCytoscape !== undefined){
//       cytoscapeData = collection.toCytoscape(vertexData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
//     }
//     cytoscapeData.id = vertexData._id; // You cannot override the id
//     let vertex = WandererCytoscapeSingleton.cy.getElementById(vertexData._id)
//     vertex.data(cytoscapeData)
//
//     // rebuildCytoscapeCompounds()
//
//   }
//
//   function edgeToCytoscape (edgeData) {
//
//     let cytoscapeData = {}
//     let collection = getEdgeCollection(edgeData._collection)
//     if(collection.toCytoscape !== undefined){
//       cytoscapeData = collection.toCytoscape(edgeData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
//     }
//     cytoscapeData.id = edgeData._id; // You cannot override the id
//     let cyEdge = WandererCytoscapeSingleton.cy.getElementById(edgeData._id)
//     cyEdge.data(cytoscapeData)
//   }
//
//   // This function rebuilds the cytoscape compound tree
//   // We have to execute this function for example if a parent data has changed or if we have reloaded all the data
//   // The parent tree can only rebuild if all nodes are present
//   // function rebuildCytoscapeCompounds () {
//   //
//   //   let vertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData
//   //
//   //   for(let i in vertexData) {
//   //     if(vertexData.hasOwnProperty(i)) {
//   //
//   //       let vertex = WandererCytoscapeSingleton.cy.getElementById(vertexData[i]._id)
//   //
//   //       if(vertexData[i]._parent != undefined && vertexData[i]._parent) {
//   //         vertex = vertex.move({
//   //           parent: vertexData[i]._parent
//   //         });
//   //       } else {
//   //         // Remove from compound node
//   //         vertex = vertex.move({
//   //           parent: null
//   //         });
//   //       }
//   //
//   //     }
//   //   }
//   //
//   // }
//
//   function generateId () {
//     return uuidv4()
//   }
//
//   function invokeVertexMethod(targetVertexId, methodName) {
//
//       let targetCytoscapeVertex = WandererCytoscapeSingleton.cy.getElementById(targetVertexId)
//       let targetVertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[targetVertexId]
//       let targetVertexCollection = getVertexCollection(targetVertexData._collection)
//       if(targetVertexCollection.edgeMethods != undefined) {
//         if(targetVertexCollection.edgeMethods[methodName] != undefined) {
//           targetVertexCollection.edgeMethods[methodName].method(targetCytoscapeVertex, targetVertexData)
//         }
//       }
//
//   }
//
//   function isEdgeTraversable(cytoscapeEdge, cytoscapeVertex) {
//     var edgeTraversable = true
//     let cytoscapeEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[cytoscapeEdge.id()]
//     let cytoscapeEdgeCollection = getEdgeCollection(cytoscapeEdgeData._collection)
//     let vertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[cytoscapeVertex.id()]
//     if(cytoscapeEdgeCollection.allowTraversal !== undefined) {
//       edgeTraversable = cytoscapeEdgeCollection.allowTraversal(
//         cytoscapeVertex,
//         vertexData,
//         cytoscapeEdge,
//         cytoscapeEdgeData,
//         WandererStoreSingleton.store.state.wanderer.currentLanguage
//       )
//     }
//     return edgeTraversable
//   }
//
//   function getOutboundCytoscapeEdges(cytoscapeVertex) {
//     // Get edges
//     let cytoscapeEdges = cytoscapeVertex.connectedEdges()
//
//     // Get outbound edges
//     let cytoscapeOutboundEdges = []
//     cytoscapeEdges.forEach(function(currentCytoscapeEdge) {
//       if(cytoscapeVertex.id()==currentCytoscapeEdge.data('source')) {
//         cytoscapeOutboundEdges.push(currentCytoscapeEdge);
//       }
//     })
//
//     return cytoscapeOutboundEdges
//   }
//
//   function getInboundCytoscapeEdges(cytoscapeVertex) {
//     let cytoscapeEdges = cytoscapeVertex.connectedEdges()
//
//     // Get inbound edges
//     let cytoscapeInboundEdges = []
//     cytoscapeEdges.forEach(function(currentCytoscapeEdge) {
//       if(cytoscapeVertex.id()==currentCytoscapeEdge.data('target')) {
//         cytoscapeInboundEdges.push(currentCytoscapeEdge);
//       }
//     })
//     return cytoscapeInboundEdges
//   }
//
//   // Check for a given node, if all inbound edges will allow to enter this node
//   function isVertexTraversable(cytoscapeVertex, vertexData) {
//
//     // Get inbound edges
//     let cytoscapeInboundEdges = getInboundCytoscapeEdges(cytoscapeVertex)
//
//     // Check for every edge if there is a allowTargetTraversal function that would allow or restrict the traversal of the current vertex
//     var vertexTraversable = true
//     if (cytoscapeInboundEdges.length) {
//       for (let i in cytoscapeInboundEdges) {
//         let currentCytoscapeEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[cytoscapeInboundEdges[i].id()]
//         let currentCytoscapeEdgeCollection = getEdgeCollection(currentCytoscapeEdgeData._collection)
//         if(currentCytoscapeEdgeCollection.allowTargetTraversal !== undefined) {
//           vertexTraversable = currentCytoscapeEdgeCollection.allowTargetTraversal(
//             cytoscapeVertex,
//             vertexData,
//             cytoscapeInboundEdges[i],
//             currentCytoscapeEdgeData,
//             WandererStoreSingleton.store.state.wanderer.currentLanguage
//           )
//           // If one of the inbound edges says NO...
//           if(!vertexTraversable) {
//             break; // We dont have to check the other edges
//           }
//         }
//       }
//     }
//
//     return vertexTraversable
//
//   }
//
//   var traversedEdges
//   var traversedVertices
//   var traversedEdgeIds = []
//   var traversedVerticeIds = []
//   var animateIn = false
//   var traversing = false
//   var reachableVerticeIds = []
//   var lastReachableVerticeIds = []
//
//   function startTraversal () {
//     // Initiate the traversal only once!
//     if(!traversing) {
//       traversing = true
//       traverse()
//     }
//   }
//
//   function stopTraversal () {
//     traversing = false
//   }
//
//   function truncate () {
//     // Clean store
//     WandererStoreSingleton.store.commit('wanderer/truncate')
//
//     // Emit the truncate event
//     trigger('truncate')
//
//     // Reset traversal variables
//     lastReachableVerticeIds = []
//   }
//
//   async function traverse (currentCytoscapeVertex, recursiveCall, test) {
//
//     // Break the current traversal if it was stopped
//     if(!traversing) {
//       return
//     }
//
//     // Get the root node
//     if (currentCytoscapeVertex == undefined) {
//       var nodeId = WandererStoreSingleton.store.state.wanderer.vertexDocumentIds[0]
//       currentCytoscapeVertex = WandererCytoscapeSingleton.cy.getElementById(nodeId)
//     }
//
//     // This is not an recursive call if undefined
//     if (recursiveCall == undefined) {
//       recursiveCall = false;
//     }
//
//     // This is an test call if undefined
//     if (test == undefined) {
//       test = true;
//     }
//
//     // This is the first call of the recursive stack
//     if (!recursiveCall) {
//
//       trigger('traversalStart')
//
//       traversedEdges = WandererCytoscapeSingleton.cy.collection()
//       traversedVertices = WandererCytoscapeSingleton.cy.collection()
//       traversedEdgeIds = []
//       traversedVerticeIds = []
//
//     }
//
//     if (currentCytoscapeVertex) {
//
//       // Get node data
//       let currentVertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[currentCytoscapeVertex.id()]
//       if(currentVertexData) {
//
//         let currentVertexCollection = getVertexCollection(currentVertexData._collection)
//
//         if (isVertexTraversable(currentCytoscapeVertex, currentVertexData)) {
//
//           // Is the vertex reachable?
//           // Remember this vertex as reachable in the current traversal
//           reachableVerticeIds.push(currentCytoscapeVertex.id())
//
//           // Check if the node was also reachable within the last traversal
//           if(lastReachableVerticeIds.indexOf(currentCytoscapeVertex.id())==-1) {
//             // If this node was not reachable during the last traversal...
//             if (currentVertexCollection.becomeReachable) {
//               currentVertexCollection.becomeReachable(currentCytoscapeVertex, currentVertexData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
//             }
//           }
//
//           // Remember this vertex as visited
//           traversedVertices = traversedVertices.union(currentCytoscapeVertex);
//           traversedVerticeIds.push(currentCytoscapeVertex.id())
//
//           // Is there a visitor available for this kind of node?
//           // Only execute the visitor if we are not in test mode
//           if (!test) {
//             if (currentVertexCollection.visitor) {
//               currentVertexCollection.visitor(currentCytoscapeVertex, currentVertexData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
//             }
//           }
//
//           // Get outbound edges
//           let cytoscapeOutboundEdges = getOutboundCytoscapeEdges(currentCytoscapeVertex)
//
//           // Now get all the traversable outbound edges
//           let cytoscapeTraversableOutboundEdges = []
//           for(let i in cytoscapeOutboundEdges) {
//             if(isEdgeTraversable(cytoscapeOutboundEdges[i], currentCytoscapeVertex)) {
//               cytoscapeTraversableOutboundEdges.push(cytoscapeOutboundEdges[i])
//             }
//           }
//
//           // // Get the children if present
//           // var cytoscapeChildren = currentCytoscapeVertex.children();
//           // if(!cytoscapeChildren.empty()) {
//           //
//           //   // Run the child expander
//           //   if (currentVertexCollection.childExpander) {
//           //     cytoscapeChildren = currentVertexCollection.childExpander(currentCytoscapeVertex, currentVertexData, cytoscapeChildren)
//           //   }
//           //
//           //   var childIds = []
//           //
//           //   // For each child
//           //   cytoscapeChildren.forEach((childCytoscapeVertex) => {
//           //     let childVertexData = WandererStoreSingleton.store.state.wanderer.vertexDocumentData[childCytoscapeVertex.id()]
//           //     let childVertexCollection = getVertexCollection(childVertexData._collection)
//           //     // Check if the child is traversable
//           //     if (isVertexTraversable(childCytoscapeVertex, childVertexData)) {
//           //       // Get the child edges
//           //       let childOutboundEdges = getOutboundCytoscapeEdges(childCytoscapeVertex)
//           //       // Merge the edges together with the parent
//           //       cytoscapeOutboundEdges = cytoscapeOutboundEdges.concat(childOutboundEdges)
//           //       // Mark this child node as visited
//           //       WandererStoreSingleton.store.commit('wanderer/rememberTraversedVertex', childCytoscapeVertex.id())
//           //       traversedVertices = traversedVertices.union(childCytoscapeVertex);
//           //       // Add it to the children array of this vertex
//           //       childIds.push(childCytoscapeVertex.id())
//           //     }
//           //   })
//           //
//           //   // Store the childrens of each node in the VueX store
//           //   WandererStoreSingleton.store.commit('wanderer/setVertexChildren', {
//           //     vertexId: nodeId,
//           //     vertexChildren: childIds
//           //   })
//           //
//           // }
//
//           // Are there outbound edges?
//           if (cytoscapeTraversableOutboundEdges.length) {
//
//             let expandEdges = cytoscapeTraversableOutboundEdges
//
//             // Is there a expander available for this kind of node which will alter the expand edges?
//             if (currentVertexCollection.expander) {
//               expandEdges = currentVertexCollection.expander(currentCytoscapeVertex, currentVertexData, cytoscapeTraversableOutboundEdges)
//             }
//
//             // Sort the outbound edges
//             expandEdges = expandEdges.sort(function(a, b) {
//                 return WandererStoreSingleton.store.state.wanderer.edgeDocumentData[b.id()]['priority']-WandererStoreSingleton.store.state.wanderer.edgeDocumentData[a.id()]['priority']
//             })
//
//             var relatedVertexIds = [];
//
//             // expand the edges
//             for (let i in expandEdges) {
//
//
//               // if(edgeTraversable) {
//
//                 // Remember this edge as visited
//                 // WandererStoreSingleton.store.commit('wanderer/rememberTraversedEdge', expandEdges[i].id())
//
//                 traversedEdges = traversedEdges.union(expandEdges[i]);
//                 traversedEdgeIds.push(expandEdges[i].id())
//
//                 let currentCytoscapeEdgeData = WandererStoreSingleton.store.state.wanderer.edgeDocumentData[expandEdges[i].id()]
//
//                 if(currentCytoscapeEdgeData){
//                   let currentCytoscapeEdgeCollection = getEdgeCollection(currentCytoscapeEdgeData._collection)
//
//                   // Call the visitor for this edge if present
//                   if(test) {
//                     if (currentCytoscapeEdgeCollection.testVisitor) {
//                       currentCytoscapeEdgeCollection.testVisitor(expandEdges[i], currentCytoscapeEdgeData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
//                     }
//                   } else {
//                     if (currentCytoscapeEdgeCollection.visitor) {
//                       currentCytoscapeEdgeCollection.visitor(expandEdges[i], currentCytoscapeEdgeData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
//                     }
//                   }
//
//                   // Call the selected target node edge method
//                   // Do this for the test track too. So both ways would be the same if the further way depends on this methods
//                   if (test) {
//                     if(currentCytoscapeEdgeData.method != undefined) {
//                       invokeVertexMethod(expandEdges[i].target().id(), currentCytoscapeEdgeData.method)
//                     }
//                   }
//
//                   // Traverse the connected node
//                   // But only visit this node if it was not visited already before in traversal!
//                   // We dont want to build a unlimited recursion!
//                   if(traversedVerticeIds.indexOf(expandEdges[i].target().id()) == -1) {
//                     // Give the browser some time to react
//                     await wait(1)
//                     // Traverse into deep
//                     await traverse(expandEdges[i].target(), true, test)
//                   }
//
//                   // Store this into the vuex store
//                   relatedVertexIds.push(expandEdges[i].target().id());
//
//                 }
//               //}
//
//             } // For each expandable edge
//
//
//           } // foreach expand edge
//
//
//
//         } // vertex traversable
//
//       }
//
//     }
//
//     // Is this the first function call in the recursive stack?
//     if (!recursiveCall) {
//
//       if(test) {
//         // Now start the real traversal.
//         // Without testing the track
//         // Give the browser some time to react
//         await wait(1)
//         await traverse(currentCytoscapeVertex, false, false)
//       } else {
//
//         // Update the last reachable vertices
//         lastReachableVerticeIds = [...reachableVerticeIds]
//         reachableVerticeIds = []
//
//         // console.log(lastReachableVerticeIds)
//
//         // Finish the current traversal by emittig the event
//         trigger('traversalFinished')
//
//         // Animate the traversed edges and vertices
//         animateTraversal(traversedEdges, traversedVertices)
//
//         // Forget the traversed edges and vertices from the last traversal
//         WandererStoreSingleton.store.commit('wanderer/resetTraversal')
//
//         // I dont want do this inside the traversal because it generates a blinking effect for elements that are using this information
//         // Send all traversed edges and vertices in store
//         WandererStoreSingleton.store.commit('wanderer/rememberTraversedVertices', traversedVerticeIds)
//
//         // Restart the traversal tick
//         // Give the browser some time to react
//         await wait(1000)
//         await traverse()
//
//       }
//
//     }
//
//   }
//
//   var animating = false
//   function animateTraversal (traversedEdges, traversedVertices) {
//
//     if(!animating) {
//
//       animating = true
//
//       // Stop all animations
//       // WandererCytoscapeSingleton.cy.nodes().stop();
//       // WandererCytoscapeSingleton.cy.edges().stop();
//
//       traversedEdges.addClass('pulse');
//       traversedVertices.addClass('pulse');
//
//       setTimeout(function() {
//
//         traversedEdges.removeClass('pulse');
//         traversedVertices.removeClass('pulse');
//
//         animating = false
//
//       }, 1000)
//
//     }
//
//   }
//
//   function isVertexInTraversal (vertexId) {
//     if(WandererStoreSingleton.store.state.wanderer.traversedVertices.indexOf(vertexId) != -1) {
//       return true
//     }
//     return false
//   }
//
//   function setLanguage(language) {
//     WandererStoreSingleton.store.commit('wanderer/setCurrentLanguage', language)
//
//     // Rebuild cytoscape data
//     for(let i in WandererStoreSingleton.store.state.wanderer.vertexDocumentIds){
//       vertexToCytoscape(WandererStoreSingleton.store.state.wanderer.vertexDocumentData[WandererStoreSingleton.store.state.wanderer.vertexDocumentIds[i]])
//     }
//
//     for(let i in WandererStoreSingleton.store.state.wanderer.edgeDocumentIds){
//       edgeToCytoscape(WandererStoreSingleton.store.state.wanderer.edgeDocumentData[WandererStoreSingleton.store.state.wanderer.edgeDocumentIds[i]])
//     }
//   }
//
//
//
//   return {
//     on: on,
//     trigger: trigger,
//     getLifecycleData: getLifecycleData,
//     getLifecycleValue: getLifecycleValue,
//     setLifecycleValue: setLifecycleValue,
//     registerVertexCollection: registerVertexCollection,
//     registerEdgeCollection: registerEdgeCollection,
//     getVertexCollections: getVertexCollections,
//     getEdgeCollections: getEdgeCollections,
//     getVertexCollection: getVertexCollection,
//     getVertexCollectionDefaultEdgeCondition: getVertexCollectionDefaultEdgeCondition,
//     getVertexCollectionDefaultExposeField: getVertexCollectionDefaultExposeField,
//     getVertexCollectionById: getVertexCollectionById,
//     getEdgeCollection: getEdgeCollection,
//     addVertex: addVertex,
//     addEdge: addEdge,
//     invokeVertexMethod: invokeVertexMethod,
//     // rebuildCytoscapeCompounds: rebuildCytoscapeCompounds,
//     load: load,
//     loadJsonRemote: loadJsonRemote,
//     loadJsonFile: loadJsonFile,
//     importJsonRemote: importJsonRemote,
//     importData: importData,
//     removeImmutableData: removeImmutableData,
//     removeVertex: removeVertex,
//     removeEdge: removeEdge,
//     getVertexValue: getVertexValue,
//     getEdgeValue: getEdgeValue,
//     getTranslatableVertexValue: getTranslatableVertexValue,
//     vertexToCytoscape: vertexToCytoscape,
//     edgeToCytoscape: edgeToCytoscape,
//     isVertexTraversable: isVertexTraversable,
//     isEdgeTraversable: isEdgeTraversable,
//     getOutboundCytoscapeEdges: getOutboundCytoscapeEdges,
//     getInboundCytoscapeEdges: getInboundCytoscapeEdges,
//     generateId: generateId,
//     traverse: traverse,
//     isVertexInTraversal: isVertexInTraversal,
//     getLanguages: getLanguages,
//     setLanguage: setLanguage,
//     startTraversal: startTraversal,
//     stopTraversal: stopTraversal,
//     markdown2html: markdown2html,
//     evaluateVertexExpression: evaluateVertexExpression,
//     evaluateVertexTemplate: evaluateVertexTemplate,
//   }
//
// }())
