import PortalVue from 'portal-vue'
import BuilderComponent from './components/Builder'
import Builder from './Builder'

import UiContent from './components/ui/Content.vue'
import UiModal from './components/ui/Modal.vue'
import UiButton from './components/ui/Button.vue'
import UiButtonGroup from './components/ui/ButtonGroup.vue'
import UiCircleButton from './components/ui/CircleButton.vue'
import UiTextInput from './components/ui/TextInput.vue'
import UiTextareaInput from './components/ui/TextareaInput.vue'
import UiSelectInput from './components/ui/SelectInput.vue'
import UiRangeInput from './components/ui/RangeInput.vue'
import UiCheckboxInput from './components/ui/CheckboxInput.vue'
import UiCheckboxGroup from './components/ui/CheckboxGroup.vue'
import VertexCard from './components/ui/VertexCard.vue'

export default {

  install (wanderer) {

    // Require some plugins
    var broadcast = wanderer.require('broadcast')
    var Vue = wanderer.require('vue')
    var store = wanderer.require('store')
    var vueGraph = wanderer.require('vueGraph')
    var worker = wanderer.require('worker')

    // Register some ui components
    Vue.component('builder-content', UiContent)
    Vue.component('builder-modal', UiModal)
    Vue.component('builder-button', UiButton)
    Vue.component('builder-button-group', UiButtonGroup)
    Vue.component('builder-circle-button', UiCircleButton)
    Vue.component('builder-text-input', UiTextInput)
    Vue.component('builder-textarea-input', UiTextareaInput)
    Vue.component('builder-select-input', UiSelectInput)
    Vue.component('builder-range-input', UiRangeInput)
    Vue.component('builder-checkbox-input', UiCheckboxInput)
    Vue.component('builder-checkbox-group', UiCheckboxGroup)
    Vue.component('builder-vertex-card', VertexCard)

    // Extend vuex
    store.registerModule('wandererBuilder', {
      namespaced: true,
      state: {
        debug: false,
        tutorialMode: false,
        currentFlowUrl: '',
        currentLanguage: 'en',
        alerts: [],
        editVertex: 0,
        editEdge: 0,
        selectedVertexIds: [],
        selectedEdgeIds: [],
        showFileTool: true
      },
      mutations: {
        setCurrentLanguage (state, language) {
          state.currentLanguage = language
        },
        setCurrentUrl (state, url) {
          state.currentFlowUrl = url
        },
        setTutorialMode (state, mode) {
          state.tutorialMode = mode
        },
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
        setShowFileTool (state, show) {
          state.showFileTool = show
        },
        truncate (state) {
          this._vm.$set(state, 'alerts', [])
          this._vm.$set(state, 'editVertex', 0)
          this._vm.$set(state, 'editEdge', 0)
          this._vm.$set(state, 'selectedVertexIds', [])
          this._vm.$set(state, 'selectedEdgeIds', [])
          this._vm.$set(state, 'currentFlowUrl', '')
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
    var builder = new Builder(wanderer, broadcast, Vue, store, vueGraph, worker)

    // Push it to Wanderer
    wanderer.provide('builder', builder)

    // Push it to vue
    Vue.prototype.$builder = builder

  }

}
