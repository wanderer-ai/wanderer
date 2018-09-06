import Brain from './Brain.js'

var brainInstance = null

export default {

    // Vue installer method
    install (Vue, options) {

      brainInstance = new Brain(Vue)

      Vue.prototype.$brain = brainInstance // Push to vue
    },

    // "Use" function for installing new brain plugins
    use (plugin){
      brainInstance.use(plugin)
    }

}
