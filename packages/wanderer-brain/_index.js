import Brain from './Brain.js'

var plugins = []

// var store = null

export default {

  // Vue installer method
  install (Vue, options) {

    Vue.mixin({
      beforeCreate: function () {
        //console.log('running before create for '+this.$options._componentTag+'...')
        var options = this.$options;
        // brain injection
        if (options.brain) {
          this.$brain = options.brain;
          //console.log('injecting brain from options')
        }else if (options.parent && options.parent.$brain) {
          //console.log('injecting brain from parent')
          this.$brain = options.parent.$brain;
        } else {
          //console.log(':-(')
        }
      }
    });

    // console.log('installing brain')

    // Vue.prototype.$brain = brainInstance // Push to vue

  },

  init(store) {
    return new Brain(store)
    //return Brain;
    //var brainInstance = new Brain(store)
    //for(var i in plugins){
      //console.log('installing brain plugin')
      //brainInstance.use(plugins[i])
    //}
  },

  // setStore(s){
  //   store = s
  // },

  //use (plugin) {
    //plugins.push(plugin)
  //}

}
