# Understand the flow
In order to build really good bots and to be able to use all features, you have to understand the flow.
Even more. You have to breathe the flow. You have to be the flow.

So that you can imagine everything more easily, we will use the analogy of a `wanderer` who follows paths and crossings on a map in order to reach a certain destination.

## What is a graph?
The flow, our hiking map, is actually a graph. A graph is the combination of many nodes that are connected to one another with edges.
Since the paths between the individual nodes have specific directions, we can also refer to the flow as a `directed graph`.

## The traversal
We start our hike at the big yellow node. From there the journey starts. Every flow starts there. This node is called the `origin`.

On our journey we try to explore the whole network of nodes and the paths between them. So we will try to hike it completely.
We call this wandering through the entire structure `graph traversal`.

If we come across a node on our journey, we will fulfill the task stored there. After that, we will gradually traverse all the edges starting from this node and visit the next nodes.

We'll go into depth first. So we only continue with the next edge when all paths below the previous edge have been traversed. We call this hiking strategy `depth first`.

## Beating heart
Some of the trails have conditions and cannot be used immediately. Other paths may close again. Therefore it is necessary to research the paths again and again.

Each cycle can be described as a `tick`. This is the heartbeat of the system.

At the moment, the hiker tries to explore all the paths on the map once a second. It always starts with the origin node.

You can see that on the map. The yellow pulsating nodes and connections are currently be traversed.

Note: Since extremely large structures with thousands of nodes can also be traversed, the traversal animation is only displayed for flows with fewer than 100 nodes in order not to affect performance.

## Bigger edges first
Often a node has several outgoing connections. You can choose the strength of most connections separately. So you can make some outgoing paths wider.
The widest paths are always taken first. The narrower ones come last.
