(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{367:function(e,t,a){"use strict";a.r(t);var o=a(42),s=Object(o.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"the-flow-file-format"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#the-flow-file-format"}},[e._v("#")]),e._v(" The flow file format")]),e._v(" "),a("p",[e._v("The flow file is a common JSON format. To edit it by hand, you need to know how it's built.")]),e._v(" "),a("p",[e._v("To keep it compatible with graph databases, there are essentially only two large arrays in the document. A "),a("code",[e._v("vertices")]),e._v(" array and an "),a("code",[e._v("edges")]),e._v(" array.")]),e._v(" "),a("p",[e._v("The vertices array contains all nodes and the edges array contains all edges. Thats it.")]),e._v(" "),a("p",[e._v("Within a graph database, all data must always belong to an edge or to a node. If you want to add metadata to the document yourself, you can just do that. This data is then loaded into the Builder when the file gets restored and its beeing stored back to the file, if you download it again. The only requirement is that this data must be inside a vertex or edge object.")]),e._v(" "),a("p",[e._v("For example add new data by adding a new field to a message vertex:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('{\n  "my_personal_comment": "This message sucks",\n  "message": {\n    "en": "Hey!",\n    "de": "Hey!"\n  },\n  "forgetful": false,\n  "_id": "67f84baa-9a90-4dda-8823-3b72a1de5c24",\n  "_collection": "message",\n  "_origin": false,\n  "_x": -397.0000000000001,\n  "_y": -27.000000000000032\n  }\n')])])]),a("h1",{attrs:{id:"underscore-fields"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#underscore-fields"}},[e._v("#")]),e._v(" Underscore Fields")]),e._v(" "),a("p",[e._v("If you take a closer look at the data, you will notice that some fields begin with an underscore. These data is very important for the function of the builder and the flow. Please only change it if you know what you are doing. Incorrect values ​​can mean that the flow can no longer be loaded.")]),e._v(" "),a("h2",{attrs:{id:"vertices"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#vertices"}},[e._v("#")]),e._v(" Vertices")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("collection:")]),e._v(' The collection this vertex belongs to. For example "message" or "conclusion".')]),e._v(" "),a("li",[a("strong",[e._v("id:")]),e._v(" A unique, automatically generated ID for this vertex.")]),e._v(" "),a("li",[a("strong",[e._v("origin:")]),e._v(" Is this the origin starting node?.")]),e._v(" "),a("li",[a("strong",[e._v("x:")]),e._v(" The x coordinates within the builder.")]),e._v(" "),a("li",[a("strong",[e._v("y:")]),e._v(" The y coordinates within the builder.")])]),e._v(" "),a("h2",{attrs:{id:"edges"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#edges"}},[e._v("#")]),e._v(" Edges")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("collection:")]),e._v(' The collection this edge belongs to. For example "leadsTo" or "isAnswerableBy".')]),e._v(" "),a("li",[a("strong",[e._v("id:")]),e._v(" A unique, automatically generated ID for this edge.")]),e._v(" "),a("li",[a("strong",[e._v("from:")]),e._v(" The ID of the Edge's source node.")]),e._v(" "),a("li",[a("strong",[e._v("to:")]),e._v(" The ID of the Edge's target node.")])])])}),[],!1,null,null,null);t.default=s.exports}}]);