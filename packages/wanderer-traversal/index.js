
class Traversal {

  constructor (graph, subscriber) {
    this.graph = graph
    this.subscriber = subscriber
    this.traversing = false
    this.traversedVertexIds = []
    this.traversedEdgeIds = []
    this.lastReachableVertexIds = []
    this.reachableVertexIds = []
  }

  // Check for a given vertex, if all inbound edges will allow to enter this vertex
  isVertexTraversable (vertex) {

    // Check for every edge if there is a allowTargetTraversal function that would allow or restrict the traversal of the current vertex
    var vertexTraversable = true

    var inboundEdges = vertex.getInboundEdges()

    inboundEdges.each((edge) => {
      edge.collection.with('allowTargetTraversal', (allowTargetTraversal) => {

        vertexTraversable = allowTargetTraversal(
          vertex,
          edge
        )
        // If one of the inbound edges says NO...
        return vertexTraversable

      })
    })

    return vertexTraversable

  }

  isEdgeTraversable (edge, vertex) {
    var edgeTraversable = true
    edge.collection.with('allowTraversal', (allowTraversal) => {
      edgeTraversable = allowTraversal(
        edge,
        vertex
      )
    })
    return edgeTraversable
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

      // console.log((explore?'exploring':'traversing')+' vertex '+vertex.data.get('_id'))

      // This is the first call of the recursive stack
      if (!recursive) {

        this.subscriber.emit('traversalStarted')

        // traversedEdges = WandererCytoscapeSingleton.cy.collection()
        // traversedVertices = WandererCytoscapeSingleton.cy.collection()
        this.traversedEdgeIds = []
        this.traversedVertexIds = []

      }

      if (this.isVertexTraversable(vertex)) {

        // Remember this vertex as reachable in the current traversal
        this.reachableVertexIds.push(vertex.data.get('_id'))

        // Check if the node was also reachable within the last traversal
        if(this.lastReachableVertexIds.indexOf(vertex.data.get('_id'))==-1) {
          // If this node was not reachable during the last traversal...
          vertex.collection.with('becomeReachable', (becomeReachable) => {
            becomeReachable(vertex)
          })
        }

        // Remember this vertex as visited
        // traversedVertices = traversedVertices.union(currentCytoscapeVertex);
        this.traversedVertexIds.push(vertex.data.get('_id'))

        // Is there a visitor available for this kind of node?
        // Only execute the visitor if we are not in test mode
        if (!explore) {
          vertex.collection.with('visitor', (visitor) => {
            visitor(vertex)
          })
        }

        var outboundEdges = vertex.getOutboundEdges()

        // Is there a expander available for this kind of node which will alter the expand edges?
        vertex.collection.with('expander', (expander) => {
          outboundEdges = expander(vertex)
          if(typeof outboundEdges != 'WandererItemList') {
            outboundEdges = this.graph.createItemList()
          }
        })

        // Sort the outbound edges
        outboundEdges = outboundEdges.sort('priority')

        // For each outbound edge
        outboundEdges.each((edge) => {

          if(this.isEdgeTraversable(edge, vertex)) {

            // Remember this edge
            // traversedEdges = traversedEdges.union(expandEdges[i]);
            this.traversedEdgeIds.push(edge.data.get('_id'))
            // WandererStoreSingleton.store.commit('wanderer/rememberTraversedEdge', expandEdges[i].id())

            // Call the visitor for this edge if present
            if(explore) {
              edge.collection.with('explorer', (explorer) => {
                explorer(edge)
              })
            } else {
              edge.collection.with('visitor', (visitor) => {
                visitor(edge)
              })
            }

            // Call the selected target node edge method
            if (explore) {
              // edge.collection.with('method', (method) => {
              //   this.invokeVertexMethod(edge, method)
              // })
            }

            // Traverse the connected node
            // But only visit this node if it was not visited already before in traversal!
            // We don't want to build a infinite recursion!
            var targetVertex = edge.getTargetVertex()
            if(this.traversedVertexIds.indexOf(targetVertex.data.get('_id')) == -1) {
              // Traverse into deep
              this.traverse(targetVertex, true, explore)
            }

            // Store this into the vuex store
            // relatedVertexIds.push(expandEdges[i].target().id());

          }

        })

      }

    } else {

      console.log('nothing to traverse')

    }

    // Is this the first function call in the recursive stack?
    if (!recursive) {

      if(explore) {
        // Now start the real traversal.
        // Without testing the track
        this.traverse(vertex, false, false)
      } else {

        console.log('Traversed '+this.traversedVertexIds.length+' vertices')

        // Update the last reachable vertices
        this.lastReachableVertexIds = [...this.reachableVertexIds]
        this.reachableVertexIds = []

        // console.log(lastReachableVertexIds)

        // Finish the current traversal by emittig the event
        this.subscriber.emit('traversalFinished', {
          traversedVertexIds: this.traversedVertexIds,
          traversedEdgeIds: this.traversedEdgeIds
        })

        // Restart the traversal tick
        setTimeout(() => {
          this.traverse(vertex)
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
