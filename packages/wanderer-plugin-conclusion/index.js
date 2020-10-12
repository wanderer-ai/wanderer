import ConclusionEditor from './components/ConclusionEditor.vue'
// import ReportEditor from './components/ReportEditor.vue'
// import ConclusionMessage from './components/ConclusionMessage.vue'
// import ReportMessage from './components/ReportMessage.vue'

import WandererSingleton from 'wanderer-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'

export default {

  install (Vue) {

    Vue.component('wanderer-conclusion-editor', ConclusionEditor)
    // Vue.component('wanderer-report-editor', ReportEditor)
    // Vue.component('wanderer-conclusion-message', ConclusionMessage)
    // Vue.component('wanderer-report-message', ReportMessage)

    // var transferedConclusions = [];
    // var transferedReports = [];

    // Register the conclusion vertex
    WandererSingleton.registerVertexCollection({
      name: 'conclusion',
      builder: {
        label: 'Conclusion',
        color: '#FEC106',
        cytoscapeClasses: 'conclusion',
        cytoscapeCxtMenuSelector: '.conclusion',
        creatable: true,
        appendableViaCxtMenu: true,
        ctxMenuAllowedEdge: 'leadsTo',
        defaultFields: {
          label: "New conclusion"
        },
        cytoscapeStyles: [{
          selector: '.conclusion',
          style: {
            'height': '50px',
            'width': '50px',
            'font-size': '20px',
            'background-color': '#FEC106',
            'border-color': '#FEC106',
            'border-width': '5px',
            'label': 'data(label)'
          }
        }],
        component: 'wanderer-conclusion-editor'
      },
      toCytoscape: function(data, language){
        if(data.label){
          return {
            label: data.label
          }
        }
        return {
          label: 'Conclusion'
        }
      },
      visitor: function (cytoscapeVertex, vertexData, language) {



      }
    })

    // WandererSingleton.registerVertexCollection({
    //   name: 'report',
    //   builder: {
    //     label: 'Report',
    //     color: '#FEC106',
    //     cytoscapeClasses: 'report',
    //     cytoscapeCxtMenuSelector: '.report',
    //     creatable: true,
    //     defaultFields: {
    //       title: {
    //         en: 'New report',
    //         de: 'Neuer Report'
    //       },
    //       report: {
    //         en: '',
    //         de: ''
    //       }
    //     },
    //     cytoscapeStyles: [{
    //       selector: '.report',
    //       style: {
    //         'height': '100px',
    //         'width': '100px',
    //         'font-size': '20px',
    //         'background-color': '#FEC106',
    //         'label': 'data(label)'
    //       }
    //     }],
    //     component: 'wanderer-report-editor'
    //   },
    //   toCytoscape: function(data, language){
    //     if(data.title != undefined && data.title[language] != undefined){
    //       return {
    //         label: data.title[language]
    //       }
    //     }
    //     return {
    //       label: 'Report'
    //     }
    //   },
    //   visitor: function (cytoscapeVertex, vertexData, language) {
    //
    //     if(transferedReports.indexOf(cytoscapeVertex.id())==-1){
    //
    //       transferedReports.push(cytoscapeVertex.id())
    //
    //       // Add the conclusion message
    //       WandererStoreSingleton.store.commit('wanderer/chat/addMessage', {
    //         // id: traversalResult.lastFoundConclusionIds[i],
    //         component: 'wanderer-report-message',
    //         backgroundColor: '#FEC106',
    //         vertexId: cytoscapeVertex.id(),
    //         delay: 1000
    //       })
    //
    //     }
    //
    //   }
    // })

    WandererSingleton.on('truncate', function() {
      // console.log('resetting conclusion messages')
      // transferedConclusions = []
      // transferedReports = []
    })

  }

}
