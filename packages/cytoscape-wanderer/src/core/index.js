module.exports = function({
  startId,
  preExpander,
  expander,
  visitor
}){

  // Define defaults
  if(typeof preExpander === 'undefined'){
    preExpander = function(edges){
      edges = edges.sort(function(a, b){
        return true
      })
      return edges
    }
  }

  if(typeof expander === 'undefined'){
    expander = function({edge, source, target}){
      return true
    }
  }

  if(typeof visitor === 'undefined'){
    visitor = function({edge, vertex}){
      return vertex
    }
  }

  let cy = this;

  let visitedEdges = [];
  let visitedVertices = [];

  // Traverse function
  let traverse = function(currentVertex,referringEdge){

    visitedVertices.push(currentVertex.id()) // Remember this vertex as visited

    // Run the visitor function
    visitor({
      referringEdge: referringEdge, // May undefined
      currentVertex: currentVertex
    })

    // Get the edges of the current vertex
    let edges = currentVertex.connectedEdges();

    // Run the preExpander function
    edges = preExpander(edges)

    // For each connected edge
    edges.forEach(function(edge){

      let target = edge.target()

      if(
        currentVertex.id()==edge.data('source') // Follow only outbound edges
        // &&visitedEdges.indexOf(edge.id())==-1 // Visit edge only if it was not visited before
        // &&visitedVertices.indexOf(target.id())==-1 // Visit vertex only if it was not visited before
      ){

        // Run expander for each edge
        // And check if the target should be traversed
        if(expander({
          edge: edge,
          source: edge.source(),
          target: target
        })){

          // Remember this edge as visited
          visitedEdges.push(edge.id())

          // Go into deep first
          traverse(target,edge)

        }
      }

    })

  }

  // Find the start vertex
  let startVertex = cy.getElementById( startId );

  // Expand the edges and get the next vertices to visit
  traverse(startVertex);

};
