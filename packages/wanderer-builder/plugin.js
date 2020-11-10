import PortalVue from 'portal-vue'
import BuilderComponent from './components/Builder'
import Builder from './Builder'

import UiModal from './components/ui/Modal.vue'
import UiButton from './components/ui/Button.vue'

export default {

  install (wanderer) {

    // Require some plugins
    var Vue = wanderer.require('vue')
    var store = wanderer.require('store')
    var vueGraph = wanderer.require('vueGraph')

    // Register some ui components
    Vue.component('builder-modal', UiModal)
    Vue.component('builder-button', UiButton)

    // Extend vuex with new namespace
    store.registerModule('wandererBuilder', {
      namespaced: true,
      state: {
        currentLanguage: 'en',
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

    // Use portal plugin
    Vue.use(PortalVue)

    // Register builder component
    Vue.component('wanderer-builder', BuilderComponent)

    // Create the builder instance
    var builder = new Builder(wanderer, Vue, store, vueGraph)

    // Push it to Wanderer
    wanderer.provide('builder', builder)

    // Push it to vue
    Vue.prototype.$builder = builder

  }

}