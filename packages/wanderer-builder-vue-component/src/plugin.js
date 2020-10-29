import BuilderComponent from './App'
import WandererBuilderSingleton from 'wanderer-builder-singleton'
import WandererStoreSingleton from 'wanderer-store-singleton'
import WandererSingleton from 'wanderer-singleton'
// import cxtmenu from 'cytoscape-cxtmenu';
// import Wanderer from 'wanderer'

export default {

  install (Vue) {

    // Register visual cytoscape plugins
    // cytoscape.use( cxtmenu )

    // Init WandererBuilder
    // We have to inject these props
    // WandererBuilder.init(cytoscape, store, wanderer)

    // Register builder component
    Vue.component('wanderer-builder', BuilderComponent)

    // Extend vuex with new namespace
    WandererStoreSingleton.store.registerModule(['wanderer', 'builder'], {
      namespaced: true,
      state: {
        alerts: [],
        editVertex: 0,
        editEdge: 0,
        selectedVertexIds: [],
        selectedEdgeIds: []
      },
      mutations: {
        setEditVertex (state, id) {
          state.editVertex = id
        },
        setEditEdge (state, id) {
          state.editEdge = id
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
          // Then delete the the rest
          for (let i in state.selectedVertexIds) {
            if(verticeIds.indexOf(state.selectedVertexIds[i])==-1){
              state.selectedVertexIds.splice(state.selectedVertexIds.indexOf(state.selectedVertexIds[i]), 1)
            }
          }
        },
        setSelectedEdgeIds (state, edgeIds) {
          state.selectedEdgeIds = edgeIds
        },
        addAlert(state,{message,type}){
          if(type == undefined){
            type = 'primary'
          }
          state.alerts.push({message:message,type:type});
        },
        removeFirstAlert(state){
          state.alerts.shift();
        },
        truncate (state) {
          this._vm.$set(state, 'alerts', [])
          this._vm.$set(state, 'editVertex', 0)
          this._vm.$set(state, 'editEdge', 0)
          this._vm.$set(state, 'selectedVertexIds', [])
          this._vm.$set(state, 'selectedEdgeIds', [])
        }
      },
      actions: {
        async addAlert(context,{message,type}) {
          context.commit('addAlert',{message:message,type:type})
          setTimeout(function(){
              context.commit('removeFirstAlert')
          }, 5000);
        }
      }
    })

    // Add cytoscape to instance
    // Vue.prototype.$wandererCytoscape = class {

    // console.log(WandererSingleton)

    // Add wanderer builder events
    WandererSingleton.on('afterRemoveVertex',function() {
      // Rebuild the selection
      let lastSelectedVerticesIds = WandererBuilderSingleton.getSelectedVertexIds()
      WandererStoreSingleton.store.commit('wanderer/builder/setSelectedVertexIds',lastSelectedVerticesIds);
    })

    WandererSingleton.on('afterRemoveEdge',function() {
      // Rebuild the selection
      let lastSelectedEdgesIds = WandererBuilderSingleton.getSelectedEdgeIds()
      WandererStoreSingleton.store.commit('wanderer/builder/setSelectedEdgeIds',lastSelectedEdgesIds);
    })

    // Add instance methods
    Vue.prototype.$wandererBuilder = WandererBuilderSingleton

  }

}
