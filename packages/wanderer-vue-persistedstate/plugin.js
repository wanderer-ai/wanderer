import createPersistedState from "vuex-persistedstate";

export default {

  install (wanderer) {

    // Require some other plugins
    var broadcast = wanderer.require('broadcast')
    var store = wanderer.require('store')

    var subscriber = broadcast.subscribe('vuePersistedstate')

    // Wait untill all plugins are ready before we can start the rehydration
    subscriber.on('pluginsReady', function () {

      // Connect the store persistor to the store and rehydrate the whole system
      createPersistedState({
        key: 'wanderer',
        rehydrated: function () {
          subscriber.emit('storeRehydrated')
        }
      })(store)

    })

  }

}
