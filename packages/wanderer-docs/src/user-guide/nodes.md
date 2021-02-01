# Nodes in detail
Different nodes have different tasks. Here you can see the functions in detail.

## Flow
The flow is the heart of every conversation. All nodes that are directly or indirectly connected to this central node are part of the flow. The flow node also contains some information about the subject, the author and the license.

__Fields in detail:__
* __Topic:__ This is the name of your flow. This gives your chat a name and is also used for the file name of the export.
* __Author:__ Der Name des Autors des Flows.
* __License:__ Here you can specify a license (e.g. MIT). So others know that the flow can be forked, further developed or used commercially.

## Message
A message is a simple node. If this is activated, the entered message is sent to the chat.

__Fields in detail:__
* __Message:__ This is the message that will be sent to the chat. Change the language to save it in several languages. This field supports dynamic [mustache.js](https://github.com/janl/mustache.js) templates.
* __Forget on inactive:__ The node will forget that the message has already been sent to the chat if it should become inactive during the course of the conversation.

__Custom internal states:__
* __sent:__ This state is true, if the message was send to chat
* __not sent:__ This state is true, if the message was not send to the chat

[Take a look at the messages example.](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fmessages.json)

## Question
A question is one of the central elements of interaction available. A question can only ever appear together with suggestions. If a question is activated, it is sent to the chat in the form of a message. All active interaction options are then displayed as an interactive form. A question is only shown if it has active suggestions, if it has not yet been answered and if it is active itself.

__Fields in detail:__
* __Question:__ That is the question that is sent to the chat. This field supports dynamic [mustache.js](https://github.com/janl/mustache.js) templates.
* __Hide suggestion messages in chat:__ If activated, the responses will not be displayed as chat messages in the chat after completing the question.
* __Repeatable:__ Questions can be repeated if this option is active and the questions are still active. In this case a small repeat symbol is shown on the answers in the chat. Users can reload the question with one click and change the course of the conversation.
* __Forget on inactive:__ The question will forget all the answers given when it becomes inactive. In this way, questions can be repeated automatically in more complex flows.
* __Show in navigation:__ If active, the question is not shown in the chat but further down in a global navigation and is therefore always visible.
* __Show always:__ Usually only one question is displayed in the chat. If this option is set, this question is always displayed if it is active and has not been answered. So many questions can be displayed at once.

__Custom internal states:__
* __answered:__ This state is true, if the question was answered
* __not answered:__ This state is true, if the question was not answered
* __invalid:__ This state is true, if one of the suggestions is invalid

[Take a look at the question example.](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fquestions.json)

Note: A question and its suggestions are treated as a single super node. Connections can start directly from the question but also from the suggestions.
A possible weighting of the edges therefore applies to all nodes in this micro network.

## Suggestion
A suggestion is an answer to a question. A question can have several suggestions. Suggestions together generate a kind of form for answering a question. Suggestions can be buttons as well as text fields or checkboxes. In order to be able to answer a question, you need at least one button suggestion.

__Fields in detail:__
* __Suggestion:__ That is the suggestion message. This is displayed either in the form of a button or as a label on an INput field. It also appears later in the chat as an answer bubble.  This field supports dynamic [mustache.js](https://github.com/janl/mustache.js) templates.
* __Type:__ The type determines the appearance of the suggestion. You can choose between various input styles. Note: Your suggestion always needs an additional button suggestion if, for example, you have only created a text field as a suggestion. This is the only way you can answer the question.
* __Priority:__ The priority determines in which order the suggestions are shown in the question form. The higher the value, the greater the suggestion is shown on the map and the further it wanders up in the question form.
* __Required:__ If checked, the suggestion must be filled in or checked so that the question can be answered.

__Custom internal states:__
* __answered:__ This state is true, if the suggestion was answered
* __not answered:__ This state is true, if the suggestion was not answered
* __invalid:__ This state is true, if the suggestions is invalid

[Take a look at the suggestion example.](https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fsuggestions.json)

## Conclusion
This node can be used to bundle and simplify logical facts inside the flow. For example, these nodes could only become active when one or more other conditions are met. For example, the node can be set so that it only becomes active when two or three questions have received specific answers. Bundled from this node, further questions can then be asked or messages can be sent. This node can also calculate new values based on incomming data.

__Fields in detail:__
* __Label:__ A label that makes the node on the map easier to identify.
* __Expression:__ Here you can enter a [Jexl](https://github.com/TomFrost/Jexl) expression. This can then calculate a new value based on incoming data.

## Jump
A jump node gives you the opportunity to jump from your current flow into another flow. In this way you can connect flows with each other. This allows you to break your conversation down into smaller chunks that are easier to maintain. It also makes your flows easier to recycle.

__Fields in detail:__
* __Jump Url:__ Enter the full URL of the flow you want to jump to.

> Warning: A jump node jumps immediately as soon as it becomes active. Therefore, you should make sure that the jump is always dependent on a condition. For example, you could ask the user before jumping. A jump cannot currently be undone. You could lose some data!

## Import
An Import node helps you to break down your flow into smaller reusable units, similar to a jump node. But instead of jumping to the target, the target is loaded into the current conversation. In this way you can reload smaller components and connect them to several edges. A flow can be imported multiple times. In this way you can build up several edges and conditions to the imported structure and exchange data between them.

__Fields in detail:__
* __Import URL:__ Enter the full URL of the flow you want to import.
* __Vertex ID:__ Optionally, you can enter the ID of a vertex within the flow to be imported to which you want to connect.

## Language
A language node can change the language of the chat within the conversation. The account changes the set language immediately after it becomes active. This node only changes the language once. If it becomes inactive, it can change the language again.

__Fields in detail:__
* __Language:__ Select the language the node should activate

## Reset
A reset node does what it says. It resets the current chat flow and starts the chat again. This node has no setting options.

> Warning: This node resets the conversation as soon as it becomes active. Therefore, you should make sure that it always dependents on a condition. For example, you could ask the user before resetting. A reset cannot be undone. You will lose your entire lifecycle data!
