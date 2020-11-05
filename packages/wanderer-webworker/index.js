
module.exports = {

  client: {
    install (Wanderer) {

      var worker = Wanderer.require('worker')

      console.log('Hello from worker')

    }
  },

  thread: {
    install (Wanderer) {

      var thread = Wanderer.require('thread')

      setInterval(function() {
        console.log('Hello from worker thread')
      }, 1000)

    }
  }

}
