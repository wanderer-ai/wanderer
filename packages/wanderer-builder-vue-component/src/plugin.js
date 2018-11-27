import BuilderComponent from './App'
import WandererBuilder from 'wanderer-builder-singleton'
// import cxtmenu from 'cytoscape-cxtmenu';
// import Wanderer from 'wanderer'

export default {

  install (Vue, {store, cytoscape, wanderer, wandererPlugins}) {

    // Register visual cytoscape plugins
    // cytoscape.use( cxtmenu )

    // Init WandererBuilder
    // We have to inject these props
    WandererBuilder.init(cytoscape, store, wanderer)

    // Register builder component
    Vue.component('wanderer-builder', BuilderComponent)

    // Extend vuex with new namespace
    store.registerModule(['wanderer', 'builder'], {
      namespaced: true,
      state: {
        editVertex: 0,
        selectedVertexIds: [],
        selectedEdgeIds: []
      },
      mutations: {
        setEditVertex (state, id) {
          state.editVertex = id
        },
        setSelectedVertexIds (state, verticeIds) {
          // It's important to keep the order of the selected vertics
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
          this._vm.$set(state, 'selectedVertexIds', [])
          this._vm.$set(state, 'selectedEdgeIds', [])
        }
      }
    })

    // Add cytoscape to instance
    // Vue.prototype.$wandererCytoscape = class {

    // Add wanderer builder events
    wanderer.on('afterRemoveVertex',function(){
      // Rebuild the selection
      let lastSelectedVerticesIds = WandererBuilder.getSelectedVertexIds()
      store.commit('wanderer/builder/setSelectedVertexIds',lastSelectedVerticesIds);
    })

    wanderer.on('afterRemoveEdge',function(){
      // Rebuild the selection
      let lastSelectedEdgesIds = WandererBuilder.getSelectedEdgeIds()
      store.commit('wanderer/builder/setSelectedEdgeIds',lastSelectedEdgesIds);
    })

    // Add instance methods
    Vue.prototype.$wandererBuilder = WandererBuilder

  }

}
