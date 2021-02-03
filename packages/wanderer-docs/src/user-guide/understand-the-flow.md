# Understand the flow
In order to build really good bots and to be able to use all features, you have to understand the flow.
Even more. You have to breathe the flow. You have to be the flow.

So that you can imagine everything more easily, we will use the analogy of a `wanderer` who follows paths and crossings on a map in order to reach a certain destination.

## What is a graph?
The flow, our hiking map, is actually a graph. A graph is the combination of many nodes that are connected to one another with edges.
Since this paths between the individual nodes have specific directions, we can also refer to the flow as a `directed graph`.

We store a lot of knowledge in the form of nodes in graph. For example questions and answers. Therefore we can also refer to the graph as a `knowledge graph`.
Because the graph also knows in which context the knowledge is valid, it can also be referred to as a `context graph` or `logic graph`.

## The traversal
The advantage of a logic graph is that we can execute it immediately by walking through it with certain rules. This is not rocket science.

We start our hike at the big yellow node. From there the journey starts. Every flow starts there. This node is called the `origin`.

On our journey we try to explore the whole network of nodes and the paths between them. So we will try to hike it completely.
We call this wandering through the entire structure `graph traversal`.

If we come across a node on our journey, we will fulfill the task stored there. After that, we will gradually traverse all the edges starting from this node and visit the next nodes.

We'll go into depth first. So we only continue with the next edge when all paths below the previous edge have been traversed. We call this hiking strategy `depth first`.

[Depth first example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fdepth_first.json)

## Bigger edges first
Often a node has several outgoing connections. You can choose the strength of most connections separately. So you can make some outgoing paths wider.
The widest paths are always taken first. The narrower ones come last. We call this the `bigger edgest first` principle.

[Bigger edges first example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fbigger_edges_first.json)

## Edge conditions
All nodes have internal states that can be set. For example, a question can have the state "answered", "not answered" or "invalid".
But nodes have no logic. The logic is fully embodied in the edges.
The edges can be configured in such a way that they can only be traversed when a certain state of the source node is met.
Nodes can only change their state. But edges decide whether paths are walkable or not. We call this `edge conditions`.
For example, a question can have different states. Outgoing edges can be crossed when the question has reached the respective state.

[Edges decide example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fedges_decide.json)

## Edge logic
In addition, all incomming edges can also be configured so that they are absolutely necessary for the activation of a target node in combination with other incomming edges or they can suppress the activation of it.

To achieve this, "leads to" type edges can be configured in three ways: `default`, `require` and `forbid`.

* __Default__: If an edge is of type default, it will try to activate the target node. [Look at the example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fdefault_edge_logic.json)
* __Require__: Edges of type require will hold back the activation of the target node until all edges of this type have been traversed. [Look at the example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Frequired_edge_logic.json)
* __Forbid__: However, if a node is reached by a forbidden edge, its activation is always suppressed. [Look at the example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fforbidden_edge_logic.json)

## Beating heart
Some of the trails have conditions and cannot be used immediately. Other paths may close again.
If the chatbot notices, for example, that a currently offered interaction option no longer makes sense in a constantly changing context, another is offered.
Therefore it is necessary to research the paths again and again.

Each of these cycles can be described as a `tick`. This is the heartbeat of the system.
At the moment, the hiker tries to explore all the paths on the map once a second. It always starts with the origin node.

You can see that on the map. The yellow pulsating nodes and connections are currently be traversed.

> Note: Since extremely large structures with thousands of nodes can also be traversed, the traversal animation is only displayed for flows with fewer than 100 nodes in order not to affect performance of the builder.

## The node lifecycle in detail
A node can have different states in the graph. During the traverse, a node can also switch between these states.

### 1. Unconnected nodes
If you create a node it doesn't have to be connected to the flow, a node can just be there. In this way you can isolate individual nodes but larger structures from the flow and simply keep them for later. But they will do just nothing until they get connected.

Check out these unconnected message nodes. They are just there but do nothing: [Unconnected nodes example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Funconnected_nodes.json)

### 2. Nodes connected to the flow
Usually, however, you want your nodes to be part of the flow too. The nodes are part of the flow if they are directly or indirectly connected to the origin node through edges or other nodes.

### 3. Nodes inside the traversal
Only if a node is also part of the flow it can be traversed. When traversing the nodes, all nodes are traversed one by one, thus executing the logic.

### 4. Active nodes
Incoming edges decide whether a node is also active. If a node becomes active, it can fulfill its task. Message nodes then send texts to the chat and question nodes offer the user interaction options.

### 5. Switching node internal states
Only when nodes are active they can get further internal states. A message node can, for example, receive the internal status that it has been sent. A question in turn can be given the status "answered". Further nodes can then be activated based on these states throug edges.
