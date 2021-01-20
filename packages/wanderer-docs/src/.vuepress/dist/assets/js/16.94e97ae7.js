(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{370:function(e,t,s){"use strict";s.r(t);var a=s(42),n=Object(a.a)({},(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("h1",{attrs:{id:"edge-logic"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#edge-logic"}},[e._v("#")]),e._v(" Edge Logic")]),e._v(" "),s("p",[e._v("You cannot store any program code inside nodes. This is because of Wanderer's strict design pattern. Therefore, you cannot use a programming language to describe what should happen when certain nodes are activated or deactivated. You also cannot save program snippets if you want to say that something else should happen after a certain event. The Wanderer system has a specially developed visual programming system: The Edges.")]),e._v(" "),s("p",[e._v("Edge are a very powerful tool. Because with them you can visually describe what should happen when certain events have occurred. For example what message should be sent when a certain question has been answered. Or which question no longer makes sense when certain events have occurred.")]),e._v(" "),s("h1",{attrs:{id:"do-something-if"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#do-something-if"}},[e._v("#")]),e._v(" Do something if...")]),e._v(" "),s("p",[e._v("The simplest logic structure you can build is if-then logic. Basically, you're doing this all the time when you're chaining messages together.\nBecause the next message will only be sent to the chat if the previous one has been sent. Tis means: IF this message has been sent, THEN send the next. And so on.")]),e._v(" "),s("p",[e._v('Just connect two messages together and double click on the edge between them. You will find that the selected condition is "sent" by default. Therefore, this edge is only traversed when the condition of the previous node has been met. So only when the previous message has been sent. Thats it.')]),e._v(" "),s("h1",{attrs:{id:"do-something-if-or"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#do-something-if-or"}},[e._v("#")]),e._v(" Do something if...or...")]),e._v(" "),s("p",[e._v("There are situations in which you ask questions and in which certain possible answers should lead to the same action. If answer x or answer y were given, event z should be carried out.\nThats also very simple. Just connect different Suggestions to the same message for example. Both edges can now activate the target node.")]),e._v(" "),s("h1",{attrs:{id:"do-something-if-and"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#do-something-if-and"}},[e._v("#")]),e._v(" Do something if...and...")]),e._v(" "),s("p",[e._v('Sometimes OR is not enough. Sometimes you may want a particular node to become active only after a combination of certain other events occurs. You then want all of these events to have occurred in order for a certain action to be started. For example, connect different answer options to different questions with your target node. Then click on the incoming edges of your node and select "require" as the type. This means that all events must have occurred before the target node is activated.')])])}),[],!1,null,null,null);t.default=n.exports}}]);