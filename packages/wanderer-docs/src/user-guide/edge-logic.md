# 💡 Edge Logic
Perhaps you are wondering why you cannot store program logic in nodes or edge. This is because of Wanderer's strict design pattern. The Wanderer system has a specially developed visual programming system. Thanks to a special traversal algorithm, the system is able to convert your flow into an executable program. All you need is nodes and edges. You don't have to write any code.

## Do something IF ...
The simplest logic structure you can build is if-then logic. Basically, you're doing this all the time when you're chaining messages together.
Because the next message will only be sent to the chat if the previous one has been sent. This means: IF the previous message has been sent, THEN send the next. And so on.

Just connect two messages together and double click on the edge between them. You will find that the selected condition is "message was sent" by default. Therefore, this edge is only traversed when the condition of the previous node has been met. So only when the previous message has been sent. Thats it.

[Look at the example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fif_then.json)

## Do something if ... OR ...
There are situations in which you ask questions and in which certain possible answers should lead to the same action. If answer x or answer y were given, event z should be carried out.
Thats also very simple. Just connect different suggestions to the same message for example. Both edges can now activate the same target node.
If we remember the wanderer, this means: You may have come across this node in one way or another so that it is activated.

[Look at the example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fif_or.json)

## Do something if ... AND ...
Sometimes OR is not enough. Sometimes you may want a particular node to become active only after a combination of certain other events occured. You then want all of these events to have occurred in order for a certain action to be started. For example, connect different answer options of different questions to one target node. Then click on the incoming edges of that node and select "require" as the edge type. This means that all events must have occurred before the target node is activated. Or in analogy to a wanderer: All of the required Edges must have been traversed before the node can be activated.

[Look at the example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fif_and.json)

## Do something NOT if ...
You may want a node NOT to be activated when certain conditions are met. For this purpose there are the "leads to" edges of the `forbid` type. If a target node is reached through this edge, its activation is always prevented.

[Look at the example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fforbid.json)

## Negating nodes
You can also specify that actions should take place if a particular node has not been activated. To do this, select the `inactive` condition for an outgoing edge of the `leads to` type. For this it is important that this node is inactive but still part of the traversal. In order to determine whether a node is inactive, it must have at least one active incoming edge.
