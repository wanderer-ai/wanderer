import Brain from './Brain.js'

var brainInstance = new Brain()

export default {

    // Vue installer method
    install (Vue, options) {
      Vue.prototype.$brain = brainInstance // Push to vue
    },

    // "Use" function for installing new brain plugins
    use (plugin){
      brainInstance.use(plugin)
    }

}
