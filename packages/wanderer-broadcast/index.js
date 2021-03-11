
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

  await(consensusName) {
    this.broadcast.await(consensusName, this.subscriberName)
  }

  consent(consensusName) {
    this.broadcast.consent(consensusName, this.subscriberName)
  }

}

class WandererBroadcast {

  constructor () {
    this.subscribers = {}
    this.consensus = {}
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

  await (consensusName, subscriberName) {

    // Create this consensus object
    if(this.consensus[consensusName] === undefined) {
      this.consensus[consensusName] = {}
    }

    // This subscriber will prevent the consensus by default
    this.consensus[consensusName][subscriberName] = false

  }

  consent (consensusName, subscriberName) {

    // This subscriber will consent
    this.consensus[consensusName][subscriberName] = true

    var consensus = true

    // Check, if all subscribers has agreed to this
    for (const [key, value] of Object.entries(this.consensus[consensusName])) {
      if(!value) {
        // I disagreeing!
        consensus = false
        break
      }
    }

    // If all partys have agreed to this
    if(consensus) {
      // Distribute this to all
      this.distribute(consensusName, {}, 'broadcast')
    }

  }

}

export default WandererBroadcast
