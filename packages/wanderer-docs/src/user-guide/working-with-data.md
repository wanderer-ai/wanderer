# Working with data

There are two basic forms of data in this system. Static data and lifecycle data.

`Static data` is all of the data that you can create and maintain with the builder. This includes the nodes with all their values ​​and all edges with all their values. It is all data that exist in a finished flow file.

`Lifecycle data`, on the other hand, is all data that is generated automatically and dynamically when the bot is running. This can be the user's answers to questions but also the different states of nodes during the conversation. Only this data can be exchanged between nodes.

Since only lifecycle data can be used dynamically inside nodes, this chapter is all about that.

## Exchange lifecycle data
Certain nodes generate certain data. In order to be able to use this data in other nodes, this `data must first be sent there`. You cannot access all data of the flow within a node. This is important to understand as it is a fundamental part of the strict design pattern. Data can only be transferred from one node to another within "leads to" edges. Access is not possible without this transfer.

For example, if you want to use the value of an input field of a suggestion inside a message node, you have to connect both nodes together. The edge must point from the suggestion to the message and the data must be exposed within the edge. Each edge can only transmit one value at a time. If you want to transfer several values, use several edges in parallel.

You can also give the transferred values ​​a different name. This will help you keep them apart in the destination node.

## Data reactivity
If you edit fields in the Builder, you will find that the output of the chat also changes immediately in most cases. That's because `the data is reactive`. For example, if you are editing the text of a message, you can see how the text changes in chat.

Static data is always reactive. This means that you will always see changes to static data immediately inside the builder. However, this only makes sense inside the Builder. People who only use the finished chat cannot change this data.

Lifecycle data generated during the chat, on the other hand, is not always reactive because that doesn't always make sense. So you don't want the chat history to change, for example, if the user repeats a question and answers it differently. That is why the lifecycle data is frozen during the chat for each message. Active questions and suggested answers, however, remain fully reactive. For example, questions can change their text while an interaction is offered because the underlying lifecycle data has changed.
