
class Traversal {

  constructor (graph, subscriber) {
    this.graph = graph
    this.subscriber = subscriber
    this.traversing = false

    this.activatedEdgeIds = []

    this.lastActivatedVertexIds = []
    this.activatedVertexIds = []

    this.traversedRequiredEdgeIds = []
    this.traversedForbiddenEdgeIds = []

    subscriber.on('truncateLifecycle', () => {
      this.truncate()
    })

    subscriber.on('truncate', () => {
      this.truncate()
    })
  }

  truncate () {
    // Reset the edge information
    this.traversedRequiredEdgeIds = []
    this.traversedForbiddenEdgeIds = []
  }

  // Check for a given node, if all inbound edges will allow to execute the vertex action
  isVertexActionAllowed (vertex) {

    // Check for every edge if there is a allowTargetTraversal function that would allow or restrict the traversal of the current vertex
    var actionAllowed = true

    var inboundEdges = vertex.getInboundEdges()

    inboundEdges.each((edge) => {

      if (edge.data.has('type')) {
        if (edge.data.get('type') == 'and') {
          // Have I already visited this required edge?
          if (this.traversedRequiredEdgeIds.indexOf(edge.data.get('_id')) === -1) {
            actionAllowed = false
          }
        }
        if (edge.data.get('type') == 'not') {

          // Have I not visited this forbidden edge before?
          if (this.traversedForbiddenEdgeIds.indexOf(edge.data.get('_id')) !== -1) {
            actionAllowed = false
          }

        }
      }

      // If one of the inbound edges says NO...
      // Break the loop by returning false to the each callback
      return actionAllowed

    })

    return actionAllowed

  }

  isEdgeTraversable (edge, vertex) {
    var allow = true

    var condition = edge.data.get('condition')

    // The default condition is always 'active' in case there is no condition set
    if(condition === undefined) {
      condition = 'active'
    }

    // Check active condition
    if(condition=='active') {
      if(!vertex.lifecycle.is('active')) {
        allow = false
      }
    }

    // Check inactive condition
    if(condition=='inactive') {
      if(vertex.lifecycle.is('active')) {
        allow = false
      }
    }

    // Check custom vertex conditions
    vertex.collection.with('edgeConditions.'+condition, (condition) => {
      // Check the custom conditions only if the vertex is active!
      if(vertex.lifecycle.is('active')) {
        allow = condition(vertex)
      } else {
        // The custom condition cannot be true if the vertex is inactive
        allow = false
      }
    })

    return allow
  }

  start () {
    if(!this.traversing) {
      this.traversing = true
      this.traverse()
    }
  }

  stop () {
    this.traversing = false
  }

  traverse (vertex, recursive, explore) {

    // Break the current traversal if it was stopped
    if(!this.traversing) {
      return
    }

    // This is not an recursive call if undefined
    if (recursive == undefined) {
      recursive = false
    }

    // This is an test call if undefined
    if (explore == undefined) {
      explore = true
    }

    // Get the origin vertex
    if(vertex == undefined) {
      vertex = this.graph.getOrigin()
    }

    if(vertex != undefined) {

      // This is the first call of the recursive stack
      if (!recursive) {

        this.subscriber.emit('traversalStarted')

        this.activatedVertexIds = []

        this.activatedEdgeIds = []

        this.traversedRequiredEdgeIds = []

      }

      // Check if this vertex can be activated by checking the incomming edges
      if (this.isVertexActionAllowed(vertex)) {

        // Remember this vertex as activated in the current traversal
        this.activatedVertexIds.push(vertex.data.get('_id'))

        // Check if the node was also reachable within the last traversal
        if(this.lastActivatedVertexIds.indexOf(vertex.data.get('_id'))==-1) {
          // If this node was not reachable during the last traversal...
          vertex.collection.with('activator', (activator) => {
            activator(vertex)
          })
        }

        // This value is important because all outgoing edes will check it later
        vertex.setLifecycleValue('active', true)

        // Is there a action available for this kind of node?
        // Only execute the action if we are not in exploration mode
        if (!explore) {
          vertex.collection.with('action', (action) => {
            action(vertex, this)
          })
        }

      } else {
        // This value is important because all outgoing edes will check it later
        vertex.setLifecycleValue('active', false)
      }

      // Get outbound edges of the current node
      var outboundEdges = vertex.getOutboundEdges()

      // Is there a expander available for this kind of node which will alter the expand edges?
      vertex.collection.with('expander', (expander) => {
        outboundEdges = expander(vertex, this)
        if(!outboundEdges) {
          outboundEdges = this.graph.createItemList()
        }
      })

      // Sort the outbound edges
      outboundEdges = outboundEdges.sort('priority')

      // For each outbound edge
      outboundEdges.each((edge) => {

        // Check if the edge is traversable
        if(this.isEdgeTraversable(edge, vertex)) {

          // Remember this edges in case they have defined types
          this.activatedEdgeIds.push(edge.data.get('_id'))

          if(edge.data.has('type')) {
            // Just remember this edges
            if (edge.data.get('type') == 'and') {
              this.traversedRequiredEdgeIds.push(edge.data.get('_id'))
            }
            // Build a list of all the NOT edges
            if (edge.data.get('type') == 'not') {
              this.traversedForbiddenEdgeIds.push(edge.data.get('_id'))
            }
          }

          // Get the source expose data and copy it to the target lifecycle
          edge.data.with('expose', (exposeKey) => {
            if(edge.sourceVertex.lifecycle.has(exposeKey)) {

              // Get the expose value
              let exposeValue = edge.sourceVertex.lifecycle.get(exposeKey)

              // Set alias
              if(!edge.data.isEmpty('name')) {
                exposeKey = edge.data.get('name')
              }

              // Set target lifecycle value
              edge.targetVertex.setLifecycleValue(exposeKey, exposeValue)
            }
          })

          // Traverse the connected node
          // But only visit this node if it was not visited already before in traversal!
          // We don't want to build a infinite recursion!
          var targetVertex = edge.getTargetVertex()
          if(this.activatedVertexIds.indexOf(targetVertex.data.get('_id')) == -1) {
            // Traverse into deep
            this.traverse(targetVertex, true, explore)
          }

        }

      }) // each outbound edge


    } else {

      // console.log('nothing to traverse')

    }

    // Is this the first function call in the recursive stack?
    // That means that we have now followed all the outgoing edges of the origin node
    // This is the finish of one cycle
    if (!recursive) {

      if(explore) {
        // Now start the real traversal.
        // Without testing the track
        this.traverse(vertex, false, false)
      } else {

        // Finish the current traversal by emittig the event
        this.subscriber.emit('traversalFinished', {
          activatedVertexIds: this.activatedVertexIds,
          activatedEdgeIds: this.activatedEdgeIds
        })

        // Update the last reachable vertices
        this.lastActivatedVertexIds = [...this.activatedVertexIds]

        // We are at the end of the live-tick. So clear now the forbidden edges
        this.traversedForbiddenEdgeIds = []

        // Start the next traversal tick
        setTimeout(() => {
          this.traverse()
        }, 1000)


      }

    }

  }

}

export default {
  install (wanderer) {

    // Require the broadcast
    var broadcast = wanderer.require('broadcast')

    // Require the graph
    var graph = wanderer.require('graph')

    // Register a subscriber
    var subscriber = broadcast.subscribe('traversal')

    // Create a new graph instance
    var traversal = new Traversal(graph, subscriber)

    // Provide the traversal
    wanderer.provide('traversal', traversal)

    traversal.start()

  }
}
