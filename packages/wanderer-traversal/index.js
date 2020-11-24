
class Traversal {

  constructor (graph, subscriber) {
    this.graph = graph
    this.subscriber = subscriber
    this.traversing = false
    this.traversedVerticeIds = []
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

        this.subscriber.emit('traversalStart')

        // traversedEdges = WandererCytoscapeSingleton.cy.collection()
        // traversedVertices = WandererCytoscapeSingleton.cy.collection()
        // traversedEdgeIds = []
        this.traversedVerticeIds = []

      }

      if (this.isVertexTraversable(vertex)) {

        // Remember this vertex as reachable in the current traversal
        // reachableVerticeIds.push(currentCytoscapeVertex.id())

        // Check if the node was also reachable within the last traversal
        // if(lastReachableVerticeIds.indexOf(currentCytoscapeVertex.id())==-1) {
        //   // If this node was not reachable during the last traversal...
        //   if (currentVertexCollection.becomeReachable) {
        //     currentVertexCollection.becomeReachable(currentCytoscapeVertex, currentVertexData, WandererStoreSingleton.store.state.wanderer.currentLanguage)
        //   }
        // }

        // Remember this vertex as visited
        // traversedVertices = traversedVertices.union(currentCytoscapeVertex);
        this.traversedVerticeIds.push(vertex.data.get('_id'))

        // Is there a visitor available for this kind of node?
        // Only execute the visitor if we are not in test mode
        if (!explore) {
          vertex.collection.with('visitor', (visitor) => {
            visitor(vertex)
          })
        }

        // Is there a expander available for this kind of node which will alter the expand edges?
        // if (currentVertexCollection.expander) {
        //   expandEdges = currentVertexCollection.expander(currentCytoscapeVertex, currentVertexData, cytoscapeTraversableOutboundEdges)
        // }

        // Sort the outbound edges
        // vertex.outboundEdges.sort('priority')

        // For each outbound edge
        vertex.getOutboundEdges().each((edge) => {

          if(this.isEdgeTraversable(edge, vertex)) {

            // Remember this edge
            // traversedEdges = traversedEdges.union(expandEdges[i]);
            // traversedEdgeIds.push(expandEdges[i].id())
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
            if(this.traversedVerticeIds.indexOf(targetVertex.data.get('_id')) == -1) {
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

        console.log('Traversed '+this.traversedVerticeIds.length+' vertices')

        // Update the last reachable vertices
        // lastReachableVerticeIds = [...reachableVerticeIds]
        // reachableVerticeIds = []

        // console.log(lastReachableVerticeIds)

        // Finish the current traversal by emittig the event
        this.subscriber.emit('traversalFinished')

        // Animate the traversed edges and vertices
        // animateTraversal(traversedEdges, traversedVertices)

        // Forget the traversed edges and vertices from the last traversal
        // WandererStoreSingleton.store.commit('wanderer/resetTraversal')

        // I dont want do this inside the traversal because it generates a blinking effect for elements that are using this information
        // Send all traversed edges and vertices in store
        // WandererStoreSingleton.store.commit('wanderer/rememberTraversedVertices', traversedVerticeIds)

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
