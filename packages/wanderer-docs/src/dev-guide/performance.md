# Performance

By dynamically importing further flow parts, the nodes can quickly grow to several thousand within a conversation.

Thanks to the built-in graph database, even very large structures can be traversed in the browser with little performance. This is achieved through web workers and a heavily indexed and  referenced data structure.

Thanks to the fast rendering by Cytoscape.js, very large structures are also possible inside the Builder. Take a closer look to this auto generated flow file. It contains one thousand chained message nodes:

[Super Chat Flow Example](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fsuper_chat_flow.json)

> If you are editing large structures in the builder, the builder can be slow as there is a lot to render. Nevertheless, this should not affect the performance of the chat, as rendering is not required there.
