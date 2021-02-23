(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{376:function(e,t,s){"use strict";s.r(t);var a=s(42),n=Object(a.a)({},(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("h1",{attrs:{id:"🔍-nodes-in-detail"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#🔍-nodes-in-detail"}},[e._v("#")]),e._v(" 🔍 Nodes in detail")]),e._v(" "),s("p",[e._v("Different nodes have different tasks. Here you can see the functions in detail.")]),e._v(" "),s("h2",{attrs:{id:"flow"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#flow"}},[e._v("#")]),e._v(" Flow")]),e._v(" "),s("p",[e._v("The flow is the heart of every conversation. All nodes that are directly or indirectly connected to this central node are part of the flow. The flow node also contains some information about the subject, the author and the license.")]),e._v(" "),s("p",[s("strong",[e._v("Fields in detail:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("Topic:")]),e._v(" This is the name of your flow. This gives your chat a name and is also used for the file name of the export.")]),e._v(" "),s("li",[s("strong",[e._v("Author:")]),e._v(" Der Name des Autors des Flows.")]),e._v(" "),s("li",[s("strong",[e._v("License:")]),e._v(" Here you can specify a license (e.g. MIT). So others know that the flow can be forked, further developed or used commercially.")])]),e._v(" "),s("h2",{attrs:{id:"message"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#message"}},[e._v("#")]),e._v(" Message")]),e._v(" "),s("p",[e._v("A message is a simple node. If this is activated, the entered message is sent to the chat.")]),e._v(" "),s("p",[s("strong",[e._v("Fields in detail:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("Message:")]),e._v(" This is the message that will be sent to the chat. Change the language to save it in several languages. This field supports dynamic "),s("a",{attrs:{href:"https://github.com/janl/mustache.js",target:"_blank",rel:"noopener noreferrer"}},[e._v("mustache.js"),s("OutboundLink")],1),e._v(" templates.")]),e._v(" "),s("li",[s("strong",[e._v("Forget on inactive:")]),e._v(" The node will forget that the message has already been sent to the chat if it should become inactive during the course of the conversation.")])]),e._v(" "),s("p",[s("strong",[e._v("Custom internal states:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("sent:")]),e._v(" This state is true, if the message was send to chat")]),e._v(" "),s("li",[s("strong",[e._v("not sent:")]),e._v(" This state is true, if the message was not send to the chat")])]),e._v(" "),s("p",[s("a",{attrs:{href:"https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fmessages.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("Take a look at the messages example."),s("OutboundLink")],1)]),e._v(" "),s("h2",{attrs:{id:"question"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#question"}},[e._v("#")]),e._v(" Question")]),e._v(" "),s("p",[e._v("A question is one of the central elements of interaction available. A question can only ever appear together with suggestions. If a question is activated, it is sent to the chat in the form of a message. All active interaction options are then displayed as an interactive form. A question is only shown if it has active suggestions, if it has not yet been answered and if it is active itself.")]),e._v(" "),s("p",[s("strong",[e._v("Fields in detail:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("Question:")]),e._v(" That is the question that is sent to the chat. This field supports dynamic "),s("a",{attrs:{href:"https://github.com/janl/mustache.js",target:"_blank",rel:"noopener noreferrer"}},[e._v("mustache.js"),s("OutboundLink")],1),e._v(" templates.")]),e._v(" "),s("li",[s("strong",[e._v("Hide suggestion messages in chat:")]),e._v(" If activated, the responses will not be displayed as chat messages in the chat after completing the question.")]),e._v(" "),s("li",[s("strong",[e._v("Repeatable:")]),e._v(" Questions can be repeated if this option is active and the questions are still active. In this case a small repeat symbol is shown on the answers in the chat. Users can reload the question with one click and change the course of the conversation.")]),e._v(" "),s("li",[s("strong",[e._v("Forget on inactive:")]),e._v(" The question will forget all the answers given when it becomes inactive. In this way, questions can be repeated automatically in more complex flows.")]),e._v(" "),s("li",[s("strong",[e._v("Show in navigation:")]),e._v(" If active, the question is not shown in the chat but further down in a global navigation and is therefore always visible.")]),e._v(" "),s("li",[s("strong",[e._v("Show always:")]),e._v(" Usually only one question is displayed in the chat. If this option is set, this question is always displayed if it is active and has not been answered. So many questions can be displayed at once.")])]),e._v(" "),s("p",[s("strong",[e._v("Custom internal states:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("answered:")]),e._v(" This state is true, if the question was answered")]),e._v(" "),s("li",[s("strong",[e._v("not answered:")]),e._v(" This state is true, if the question was not answered")]),e._v(" "),s("li",[s("strong",[e._v("invalid:")]),e._v(" This state is true, if one of the suggestions is invalid")])]),e._v(" "),s("p",[s("a",{attrs:{href:"https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fquestions.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("Take a look at the question example."),s("OutboundLink")],1)]),e._v(" "),s("p",[e._v("Note: A question and its suggestions are treated as a single super node. Connections can start directly from the question but also from the suggestions.\nA possible weighting of the edges therefore applies to all nodes in this micro network.")]),e._v(" "),s("h2",{attrs:{id:"suggestion"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#suggestion"}},[e._v("#")]),e._v(" Suggestion")]),e._v(" "),s("p",[e._v("A suggestion is a answer option to a question. A question can have several suggestions. All suggestions together will compose a form inside the chat. Suggestions can be buttons as well as text fields or checkboxes. In order to be able to answer a question, you need at least one button suggestion.")]),e._v(" "),s("p",[s("strong",[e._v("Fields in detail:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("Suggestion:")]),e._v(" That is the suggestion message. This is displayed either in the form of a button or as a label on an INput field. It also appears later in the chat as an answer bubble.  This field supports dynamic "),s("a",{attrs:{href:"https://github.com/janl/mustache.js",target:"_blank",rel:"noopener noreferrer"}},[e._v("mustache.js"),s("OutboundLink")],1),e._v(" templates.")]),e._v(" "),s("li",[s("strong",[e._v("Type:")]),e._v(" The type determines the appearance of the suggestion. You can choose between various input styles. Note: Your suggestion always needs an additional button suggestion if, for example, you have only created a text field as a suggestion. This is the only way you can answer a question without hitting return key.")]),e._v(" "),s("li",[s("strong",[e._v("Priority:")]),e._v(" The priority determines in which order the suggestions are shown in the question form. The higher the value, the greater the suggestion is shown on the map and the further it wanders up in the question form.")]),e._v(" "),s("li",[s("strong",[e._v("Required:")]),e._v(" If checked, the suggestion must be filled in or checked so that the question can be answered.")])]),e._v(" "),s("p",[s("strong",[e._v("Custom internal states:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("answered:")]),e._v(" This state is true, if the suggestion was answered")]),e._v(" "),s("li",[s("strong",[e._v("not answered:")]),e._v(" This state is true, if the suggestion was not answered")]),e._v(" "),s("li",[s("strong",[e._v("invalid:")]),e._v(" This state is true, if the suggestions is invalid")])]),e._v(" "),s("p",[s("a",{attrs:{href:"https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fsuggestions.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("Take a look at the suggestion example."),s("OutboundLink")],1)]),e._v(" "),s("h2",{attrs:{id:"conclusion"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#conclusion"}},[e._v("#")]),e._v(" Conclusion")]),e._v(" "),s("p",[e._v("This node can be used to bundle and simplify logical facts inside the flow. For example, these nodes could only become active when one or more other conditions are met. For example, the node can be set so that it only becomes active when two or three questions have received specific answers. Bundled from this node, further questions can then be asked or messages can be sent. This node can also calculate new values based on incomming data.")]),e._v(" "),s("p",[s("strong",[e._v("Fields in detail:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("Label:")]),e._v(" A label that makes the node on the map easier to identify.")]),e._v(" "),s("li",[s("strong",[e._v("Expression:")]),e._v(" Here you can enter a "),s("a",{attrs:{href:"https://github.com/TomFrost/Jexl",target:"_blank",rel:"noopener noreferrer"}},[e._v("Jexl"),s("OutboundLink")],1),e._v(" expression. This can then calculate a new value based on incoming data.")])]),e._v(" "),s("h2",{attrs:{id:"jump"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#jump"}},[e._v("#")]),e._v(" Jump")]),e._v(" "),s("p",[e._v("A jump node gives you the opportunity to jump from your current flow into another flow. In this way you can connect flows with each other. This allows you to break your conversation down into smaller chunks that are easier to maintain. It also makes your flows easier to recycle.")]),e._v(" "),s("p",[s("strong",[e._v("Fields in detail:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("Jump Url:")]),e._v(" Enter the full URL of the flow you want to jump to.")])]),e._v(" "),s("blockquote",[s("p",[e._v("Warning: A jump node jumps immediately as soon as it becomes active. Therefore, you should make sure that the jump is always dependent on a condition. For example, you could ask the user before jumping. A jump cannot currently be undone. You could lose some data!")])]),e._v(" "),s("h2",{attrs:{id:"import"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#import"}},[e._v("#")]),e._v(" Import")]),e._v(" "),s("p",[e._v("An Import node helps you to break down your flow into smaller reusable units, similar to a jump node. But instead of jumping to the target, the target is loaded into the current conversation. In this way you can reload smaller components and connect them to several edges. A flow can be imported multiple times. In this way you can build up several edges and conditions to the imported structure and exchange data between them.")]),e._v(" "),s("p",[s("strong",[e._v("Fields in detail:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("Import URL:")]),e._v(" Enter the full URL of the flow you want to import.")]),e._v(" "),s("li",[s("strong",[e._v("Vertex ID:")]),e._v(" Optionally, you can enter the ID of a vertex within the flow to be imported to which you want to connect.")])]),e._v(" "),s("h2",{attrs:{id:"language"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#language"}},[e._v("#")]),e._v(" Language")]),e._v(" "),s("p",[e._v("A language node can change the language of the chat within the conversation. The account changes the set language immediately after it becomes active. This node only changes the language once. If it becomes inactive, it can change the language again.")]),e._v(" "),s("p",[s("strong",[e._v("Fields in detail:")])]),e._v(" "),s("ul",[s("li",[s("strong",[e._v("Language:")]),e._v(" Select the language the node should activate")])]),e._v(" "),s("h2",{attrs:{id:"reset"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#reset"}},[e._v("#")]),e._v(" Reset")]),e._v(" "),s("p",[e._v("A reset node does what it says. It resets the current chat flow and starts the chat again. This node has no setting options.")]),e._v(" "),s("blockquote",[s("p",[e._v("Warning: This node resets the conversation as soon as it becomes active. Therefore, you should make sure that it always dependents on a condition. For example, you could ask the user before resetting. A reset cannot be undone. You will lose your entire lifecycle data!")])])])}),[],!1,null,null,null);t.default=n.exports}}]);