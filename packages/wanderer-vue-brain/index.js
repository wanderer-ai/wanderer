import Brain from './Brain.js'
export default {
  install (Vue, options) {
    Vue.prototype.$brain = new Brain(Vue, options)
  }
}
