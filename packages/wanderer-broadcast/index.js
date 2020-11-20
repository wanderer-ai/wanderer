
class WandererBroadcastSubscriber {

  constructor (subscriberName, broadcast) {
    this.broadcast = broadcast
    this.subscriberName = subscriberName
    this.events = {}
  }

  on(eventName, method) {
    if(this.events[eventName] === undefined) {
      this.events[eventName] = []
    }
    this.events[eventName].push(method)
  }

  emit(eventName, eventPayload) {
    this.broadcast.distribute(eventName, eventPayload, this)
  }

  receive(eventName, eventPayload) {
    if(this.events[eventName] !== undefined) {
      for(const i in this.events[eventName]) {
        this.events[eventName][i](eventPayload)
      }
    }
  }

}

class WandererBroadcast {

  constructor () {
    this.subscribers = {}
  }

  distribute (eventName, eventPayload, fromBroadcastSubscriber) {
    for(const s in this.subscribers) {
      // Only distribute this event to other subscribers and not to the sender!
      if(fromBroadcastSubscriber.subscriberName != this.subscribers[s].subscriberName) {
        this.subscribers[s].receive(eventName, eventPayload)
      }
    }
  }

  subscribe (subscriberName) {
    this.subscribers[subscriberName] = new WandererBroadcastSubscriber(subscriberName, this)
    return this.subscribers[subscriberName]
  }

}

module.exports = WandererBroadcast
