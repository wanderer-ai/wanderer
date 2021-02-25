
class Traversal {

  constructor (graph, subscriber) {
    this.graph = graph
    this.subscriber = subscriber
    this.traversing = false

    this.activatedEdgeIds = []

    this.traversedVertexIds = []
    this.lastTraversedVertexIds = []

    this.lastActivatedVertexIds = []
    this.activatedVertexIds = []

    this.traversedRequiredEdgeIds = []
    this.traversedForbiddenEdgeIds = []

    this.lastTraversedRequiredEdgeIds = []
    this.lastTraversedForbiddenEdgeIds = []

    // this.pendingNodes = graph.createItemList();

    subscriber.on('truncateLifecycle', () => {
      this.truncate()
    })

    subscriber.on('truncate', () => {
      this.truncate()
    })
  }

  truncate () {
    // Reset vertex information
    this.traversedVertexIds = []
    this.lastTraversedVertexIds = []

    this.lastActivatedVertexIds = []
    this.activatedVertexIds = []

    // Reset the edge information
    this.traversedRequiredEdgeIds = []
    this.traversedForbiddenEdgeIds = []

    this.lastTraversedRequiredEdgeIds = []
    this.lastTraversedForbiddenEdgeIds = []
  }

  // Check for a given node, if all inbound edges will allow to execute the vertex action
  getVertexStateFromEdges (vertex) {

    // console.log('checking edges of vertex', vertex.data.get('_id'))

    var state = 'active'

    var isPending = false

    // Get the inbound edges
    var inboundEdges = vertex.getInboundEdges()

    // For each inbound edge
    inboundEdges.each((edge) => {

      // console.log('checking edge', edge.data.get('_id'))

      if (edge.data.has('type')) {

        if (edge.data.get('type') == 'and') {

          isPending = true

          // If this required edge was not visited during the last traversal...
          if (
            this.lastTraversedRequiredEdgeIds.indexOf(edge.data.get('_id')) === -1 &&
            this.traversedRequiredEdgeIds.indexOf(edge.data.get('_id')) === -1
          ) {
            // Than this node is definitly inactive
            state = 'inactive'
          }

        }

        if (edge.data.get('type') == 'not') {

          isPending = true

          // Have I visited this forbidden edge before?
          // Note check if the edges have been travered in the current traversal or in the last traversal
          // Because maybe the structure blocks itself
          if (
            this.lastTraversedForbiddenEdgeIds.indexOf(edge.data.get('_id')) !== -1 ||
            this.traversedForbiddenEdgeIds.indexOf(edge.data.get('_id')) !== -1
          ) {
            state = 'inactive'
          }

        }

      }

      // If one of the inbound edges says NO...
      // Break the loop by returning false to the each callback
      if(state == 'inactive') {
        return false
      }


    })

    // Is this node pending?
    if(isPending) {

      // If this node was not disabled before
      if(state != 'inactive') {

        // Set it only active if it was traversed in the traversal before too
        // Because only in this case the state of all pending edges is known
        if(this.lastTraversedVertexIds.indexOf(vertex.data.get('_id')) !== -1) {
          state = 'active'
        } else {
          // Keep it pending
          state = 'pending'
        }
        
      }

    } else {
      state = 'active'
    }

    return state

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
      if(vertex.lifecycle.get('state') != 'active') {
        allow = false
      }
    }

    // Check inactive condition
    if(condition=='inactive') {
      if(vertex.lifecycle.get('state') != 'inactive') {
        allow = false
      }
    }

    // Check custom vertex conditions
    vertex.collection.with('edgeConditions.'+condition, (condition) => {
      // Check the custom conditions only if the vertex is active!
      if(vertex.lifecycle.get('state') == 'active') {
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

  traverse (vertex, recursive) {

    // Break the current traversal if it was stopped
    if(!this.traversing) {
      return
    }

    // This is not an recursive call if undefined
    if (recursive == undefined) {
      recursive = false
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

      }

      // Remember this vertex as part of the current traversal
      this.traversedVertexIds.push(vertex.data.get('_id'))

      // Set the initial lifecycle state if this state is not there
      // This state is always undefined until the node gets activated or "officially" inactive
      if(vertex.lifecycle.isEmpty('state')) {
        vertex.setLifecycleValue('state', 'pending')
        // console.log(vertex.data.get('_id'), state, 'initial')
      }

      // Calculate the current state based on the incomming edges
      var state = this.getVertexStateFromEdges(vertex)

      // console.log(vertex.data.get('_id'), state, 'traversal')

      if (state == 'active') {
        vertex.setLifecycleValue('state', 'active')
      }

      if (state == 'inactive') {
        vertex.setLifecycleValue('state', 'inactive')
      }

      if (state == 'pending') {
        vertex.setLifecycleValue('state', 'pending')
      }

      // Run the vertex action
      if (vertex.lifecycle.get('state') == 'active') {

        // Remember this vertex as activated in the current traversal
        this.activatedVertexIds.push(vertex.data.get('_id'))

        // Check if the node was also reachable within the last traversal
        if(this.lastActivatedVertexIds.indexOf(vertex.data.get('_id'))==-1) {
          // If this node was not reachable during the last traversal...
          vertex.collection.with('activator', (activator) => {
            activator(vertex)
          })
        }

        // Is there a action available for this kind of node?
        // Only execute the action if we are not in exploration mode
        vertex.collection.with('action', (action) => {
          action(vertex, this)
        })

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
            this.traverse(targetVertex, true)
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

        // Finish the current traversal by emittig the event
        this.subscriber.emit('traversalFinished', {
          activatedVertexIds: this.activatedVertexIds,
          activatedEdgeIds: this.activatedEdgeIds
        })

        // Update the last reachable vertices
        this.lastTraversedVertexIds = [...this.traversedVertexIds]

        // Update the last activated vertices
        this.lastActivatedVertexIds = [...this.activatedVertexIds]

        // Remember the pending edges for the next traversal
        this.lastTraversedForbiddenEdgeIds = [...this.traversedForbiddenEdgeIds]
        this.lastTraversedRequiredEdgeIds = [...this.traversedRequiredEdgeIds]

        // We are at the end of the live-tick. So clear now the forbidden edges
        this.traversedForbiddenEdgeIds = []
        this.traversedRequiredEdgeIds = []

        // Also clear the traversed vertices
        this.traversedVertexIds = []

        // Start the next traversal tick
        setTimeout(() => {
          this.traverse()
        }, 1000)


      //}

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
