# The node lifecycle
A node can have different states in the graph. During the traverse, a node can also switch between these states.

## 1. Unconnected nodes
If you create a node it doesn't have to be connected to the flow, a node can just be there. In this way you can isolate individual nodes but larger structures from the flow and simply keep them for later. But they will do just nothing.

## 2. Nodes connected to the flow
Usually, however, you want your nodes to be part of the flow too. The nodes are part of the flow if they are directly or indirectly connected to the origin node through edges or other nodes.

## 3. Nodes inside the traversal
Only if a node is also part of the flow it can be traversed. When traversing the nodes, all nodes are traversed one by one, thus executing the logic.

## 4. Active nodes
Incoming edges decide whether a node is also active. If a node becomes active, it can fulfill its task. Message nodes then send texts to the chat and question nodes offer the user interaction options.

## 5. Switching node internal states
Only when nodes are active they can get further internal states. A message node can, for example, receive the internal status that it has been sent. A question in turn can be given the status "answered". Further nodes can then be activated based on these states throug edges.
