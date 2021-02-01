(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{379:function(e,t,a){"use strict";a.r(t);var n=a(42),r=Object(n.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"understand-the-flow"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#understand-the-flow"}},[e._v("#")]),e._v(" Understand the flow")]),e._v(" "),a("p",[e._v("In order to build really good bots and to be able to use all features, you have to understand the flow.\nEven more. You have to breathe the flow. You have to be the flow.")]),e._v(" "),a("p",[e._v("So that you can imagine everything more easily, we will use the analogy of a "),a("code",[e._v("wanderer")]),e._v(" who follows paths and crossings on a map in order to reach a certain destination.")]),e._v(" "),a("h2",{attrs:{id:"what-is-a-graph"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#what-is-a-graph"}},[e._v("#")]),e._v(" What is a graph?")]),e._v(" "),a("p",[e._v("The flow, our hiking map, is actually a graph. A graph is the combination of many nodes that are connected to one another with edges.\nSince this paths between the individual nodes have specific directions, we can also refer to the flow as a "),a("code",[e._v("directed graph")]),e._v(".")]),e._v(" "),a("p",[e._v("We store a lot of knowledge in the form of nodes in graph. For example questions and answers. Therefore we can also refer to the graph as a "),a("code",[e._v("knowledge graph")]),e._v(".\nBecause the graph also knows in which context the knowledge is valid, it can also be referred to as a "),a("code",[e._v("context graph")]),e._v(" or "),a("code",[e._v("logic graph")]),e._v(".")]),e._v(" "),a("h2",{attrs:{id:"the-traversal"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#the-traversal"}},[e._v("#")]),e._v(" The traversal")]),e._v(" "),a("p",[e._v("The advantage of a logic graph is that we can execute it immediately by walking through it with certain rules. This is not rocket science.")]),e._v(" "),a("p",[e._v("We start our hike at the big yellow node. From there the journey starts. Every flow starts there. This node is called the "),a("code",[e._v("origin")]),e._v(".")]),e._v(" "),a("p",[e._v("On our journey we try to explore the whole network of nodes and the paths between them. So we will try to hike it completely.\nWe call this wandering through the entire structure "),a("code",[e._v("graph traversal")]),e._v(".")]),e._v(" "),a("p",[e._v("If we come across a node on our journey, we will fulfill the task stored there. After that, we will gradually traverse all the edges starting from this node and visit the next nodes.")]),e._v(" "),a("p",[e._v("We'll go into depth first. So we only continue with the next edge when all paths below the previous edge have been traversed. We call this hiking strategy "),a("code",[e._v("depth first")]),e._v(".")]),e._v(" "),a("p",[a("a",{attrs:{href:"https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fdepth_first.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("Depth first example"),a("OutboundLink")],1)]),e._v(" "),a("h2",{attrs:{id:"bigger-edges-first"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#bigger-edges-first"}},[e._v("#")]),e._v(" Bigger edges first")]),e._v(" "),a("p",[e._v("Often a node has several outgoing connections. You can choose the strength of most connections separately. So you can make some outgoing paths wider.\nThe widest paths are always taken first. The narrower ones come last. We call this the "),a("code",[e._v("bigger edgest first")]),e._v(" principle.")]),e._v(" "),a("p",[a("a",{attrs:{href:"https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fbigger_edges_first.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("Bigger edges first example"),a("OutboundLink")],1)]),e._v(" "),a("h2",{attrs:{id:"edge-conditions"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#edge-conditions"}},[e._v("#")]),e._v(" Edge conditions")]),e._v(" "),a("p",[e._v('All nodes have internal states that can be set. For example, a question can have the state "answered", "not answered" or "invalid".\nBut nodes have no logic. The logic is fully embodied in the edges.\nThe edges can be configured in such a way that they can only be traversed when a certain state of the source node is met.\nNodes can only change their state. But edges decide whether paths are walkable or not. We call this '),a("code",[e._v("edge conditions")]),e._v(".\nFor example, a question can have different states. Outgoing edges can be crossed when the question has reached the respective state.")]),e._v(" "),a("p",[a("a",{attrs:{href:"https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fedge_conditions.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("Edges decide example"),a("OutboundLink")],1)]),e._v(" "),a("h2",{attrs:{id:"edge-logic"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#edge-logic"}},[e._v("#")]),e._v(" Edge logic")]),e._v(" "),a("p",[e._v("In addition, all incomming edges can also be configured so that they are absolutely necessary for the activation of a target node in combination with other incomming edges or they can suppress the activation of it.")]),e._v(" "),a("p",[e._v('To achieve this, "leads to" type edges can be configured in three ways: '),a("code",[e._v("default")]),e._v(", "),a("code",[e._v("require")]),e._v(" and "),a("code",[e._v("forbid")]),e._v(".")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("Default")]),e._v(": If an edge is of type default, it will try to activate the target node. "),a("a",{attrs:{href:"https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fdefault_edge_logic.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("Look at the example"),a("OutboundLink")],1)]),e._v(" "),a("li",[a("strong",[e._v("Require")]),e._v(": Edges of type require will hold back the activation of the target node until all edges of this type have been traversed. "),a("a",{attrs:{href:"https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Frequired_edge_logic.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("Look at the example"),a("OutboundLink")],1)]),e._v(" "),a("li",[a("strong",[e._v("Forbid")]),e._v(": However, if a node is reached by a forbidden edge, its activation is always suppressed. "),a("a",{attrs:{href:"https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Fforbidden_edge_logic.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("Look at the example"),a("OutboundLink")],1)])]),e._v(" "),a("h2",{attrs:{id:"beating-heart"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#beating-heart"}},[e._v("#")]),e._v(" Beating heart")]),e._v(" "),a("p",[e._v("Some of the trails have conditions and cannot be used immediately. Other paths may close again.\nIf the chatbot notices, for example, that a currently offered interaction option no longer makes sense in a constantly changing context, another is offered.\nTherefore it is necessary to research the paths again and again.")]),e._v(" "),a("p",[e._v("Each of these cycles can be described as a "),a("code",[e._v("tick")]),e._v(". This is the heartbeat of the system.\nAt the moment, the hiker tries to explore all the paths on the map once a second. It always starts with the origin node.")]),e._v(" "),a("p",[e._v("You can see that on the map. The yellow pulsating nodes and connections are currently be traversed.")]),e._v(" "),a("blockquote",[a("p",[e._v("Note: Since extremely large structures with thousands of nodes can also be traversed, the traversal animation is only displayed for flows with fewer than 100 nodes in order not to affect performance of the builder.")])]),e._v(" "),a("h2",{attrs:{id:"the-node-lifecycle-in-detail"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#the-node-lifecycle-in-detail"}},[e._v("#")]),e._v(" The node lifecycle in detail")]),e._v(" "),a("p",[e._v("A node can have different states in the graph. During the traverse, a node can also switch between these states.")]),e._v(" "),a("h3",{attrs:{id:"_1-unconnected-nodes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-unconnected-nodes"}},[e._v("#")]),e._v(" 1. Unconnected nodes")]),e._v(" "),a("p",[e._v("If you create a node it doesn't have to be connected to the flow, a node can just be there. In this way you can isolate individual nodes but larger structures from the flow and simply keep them for later. But they will do just nothing until they get connected.")]),e._v(" "),a("p",[e._v("Check out these unconnected message nodes. They are just there but do nothing: "),a("a",{attrs:{href:"https://wanderer.ai/builder/?flow=https%3A%2F%2Fraw.githubusercontent.com%2Fwanderer-ai%2Fwanderer-flows%2Fmaster%2Fdocs%2Funconnected_nodes.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("Unconnected nodes example"),a("OutboundLink")],1)]),e._v(" "),a("h3",{attrs:{id:"_2-nodes-connected-to-the-flow"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-nodes-connected-to-the-flow"}},[e._v("#")]),e._v(" 2. Nodes connected to the flow")]),e._v(" "),a("p",[e._v("Usually, however, you want your nodes to be part of the flow too. The nodes are part of the flow if they are directly or indirectly connected to the origin node through edges or other nodes.")]),e._v(" "),a("h3",{attrs:{id:"_3-nodes-inside-the-traversal"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-nodes-inside-the-traversal"}},[e._v("#")]),e._v(" 3. Nodes inside the traversal")]),e._v(" "),a("p",[e._v("Only if a node is also part of the flow it can be traversed. When traversing the nodes, all nodes are traversed one by one, thus executing the logic.")]),e._v(" "),a("h3",{attrs:{id:"_4-active-nodes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-active-nodes"}},[e._v("#")]),e._v(" 4. Active nodes")]),e._v(" "),a("p",[e._v("Incoming edges decide whether a node is also active. If a node becomes active, it can fulfill its task. Message nodes then send texts to the chat and question nodes offer the user interaction options.")]),e._v(" "),a("h3",{attrs:{id:"_5-switching-node-internal-states"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_5-switching-node-internal-states"}},[e._v("#")]),e._v(" 5. Switching node internal states")]),e._v(" "),a("p",[e._v('Only when nodes are active they can get further internal states. A message node can, for example, receive the internal status that it has been sent. A question in turn can be given the status "answered". Further nodes can then be activated based on these states throug edges.')])])}),[],!1,null,null,null);t.default=r.exports}}]);