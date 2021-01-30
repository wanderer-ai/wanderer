# Edge Logic

You cannot store any program code inside nodes. This is because of Wanderer's strict design pattern. Therefore, you cannot use a programming language to describe what should happen when certain nodes are activated or deactivated. You also cannot save program snippets if you want to say that something else should happen after a certain event. The Wanderer system has a specially developed visual programming system: The Edges.

Edges are a very powerful tool. Because with them you can visually describe what should happen when certain events have occurred. For example what message should be sent when a certain question has been answered. Or which question no longer makes sense when certain events have occurred.

## Do something if...
The simplest logic structure you can build is if-then logic. Basically, you're doing this all the time when you're chaining messages together.
Because the next message will only be sent to the chat if the previous one has been sent. This means: IF this message has been sent, THEN send the next. And so on.

Just connect two messages together and double click on the edge between them. You will find that the selected condition is "sent" by default. Therefore, this edge is only traversed when the condition of the previous node has been met. So only when the previous message has been sent. Thats it.

## Do something if...or...
There are situations in which you ask questions and in which certain possible answers should lead to the same action. If answer x or answer y were given, event z should be carried out.
Thats also very simple. Just connect different suggestions to the same message for example. Both edges can now activate the same target node.
If we remember the wanderer, this means: You may have come across this node in one way or another so that it is activated.

## Do something if...and...
Sometimes OR is not enough. Sometimes you may want a particular node to become active only after a combination of certain other events occurs. You then want all of these events to have occurred in order for a certain action to be started. For example, connect different answer options of different questions to one target node. Then click on the incoming edges of that node and select "require" as the type. This means that all events must have occurred before the target node is activated. Or in analogy to a wanderer: All of the required Edges must have been traversed before the node can be activated.
