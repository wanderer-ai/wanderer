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
* __Message:__ This is the message that will be sent to the chat. Change the language to save it in several languages.
* __Forget on inactive:__ The node will forget that the message has already been sent to the chat if it should become inactive during the course of the conversation.

## Question
A question is one of the central elements of interaction available. A question can only ever appear together with suggestions. If a question is activated, it is sent to the chat in the form of a message. All active interaction options are then displayed as an interactive form. A question is only shown if it has active suggestions, if it has not yet been answered and if it is active itself.

__Fields in detail:__
* __Question:__ That is the question that is sent to the chat
* __Hide suggestion messages in chat:__ If activated, the responses will not be displayed as chat messages in the chat after completing the question.
* __Repeatable:__ Questions can be repeated if this option is active and the questions are still active. In this case a small repeat symbol is shown on the answers in the chat. Users can reload the question with one click and change the course of the conversation.
* __Forget on inactive:__ The question will forget all the answers given when it becomes inactive. In this way, questions can be repeated automatically in more complex flows.
* __Show in navigation:__ If active, the question is not shown in the chat but further down in a global navigation and is therefore always visible.
* __Show always:__ Usually only one question is displayed in the chat. If this option is set, this question is always displayed if it is active and has not been answered. So many questions can be displayed at once.

## Suggestion
A suggestion is an answer to a question. A question can have several suggestions. SUggestions together generate a kind of form for answering a question. Suggestions can be buttons as well as text fields or checkboxes. In order to be able to answer a question, you need at least one button suggestion.

__Fields in detail:__
* __Suggestion:__ That is the suggestion message. This is displayed either in the form of a button or as a label on an INput field. It also appears later in the chat as an answer bubble.
* __Type:__ The type determines the appearance of the suggestion. You can choose between various input styles. Note: Your suggestion always needs an additional button suggestion if, for example, you have only created a text field as a suggestion. This is the only way you can answer the question.
* __Priority:__ The priority determines in which order the suggestions are shown in the question form. The higher the value, the greater the suggestion is shown on the map and the further it wanders up in the question form.
* __Required:__ If checked, the suggestion must be filled in or checked so that the question can be answered.

## Conclusion
A conclusion has no special setting options. This node can be used to bundle and simplify logical facts in the flow. For example, these nodes could only become active when one or more other conditions are met. For example, the node can be set so that it only becomes active when two or three questions have received specific answers. Bundled from this node, further questions can then be asked or messages sent.
