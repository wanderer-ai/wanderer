(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{370:function(e,t,a){"use strict";a.r(t);var n=a(42),r=Object(n.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"website-integration"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#website-integration"}},[e._v("#")]),e._v(" Website integration")]),e._v(" "),a("p",[e._v("You can integrate the wanderer.ai chat easily to your website. At the moment you can only insert the chat directly into your application using Jsdelivr CDN. Further integrations like NPM or Yarn will follow as soon as possible.")]),e._v(" "),a("h2",{attrs:{id:"cdn-jsdelivr"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#cdn-jsdelivr"}},[e._v("#")]),e._v(" CDN - Jsdelivr")]),e._v(" "),a("p",[e._v("Just include the JavaScript file to your HTML")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('<script src="https://cdn.jsdelivr.net/gh/wanderer-ai/cdn/chat-webcomponent/wanderer-chat.js"><\/script>\n')])])]),a("p",[e._v("Then include the webcomponent to your HTML. Use the "),a("code",[e._v("flow-url")]),e._v(" parameter to define the URL of your flow.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('<wanderer-chat flow-url="https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/intro/welcome.json" base-path="/"></wanderer-chat>\n')])])]),a("p",[e._v("Complete example:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>My new website</title>\n  </head>\n  <body>\n\n    \x3c!-- Include the chat webcomponent and point to your flow file using the flow-url argument --\x3e\n    <wanderer-chat flow-url="https://raw.githubusercontent.com/wanderer-ai/wanderer-flows/master/tutorial/intro/welcome.json" base-path="/"></wanderer-chat>\n\n    \x3c!-- Include the chat JavaScript file --\x3e\n    <script src="https://cdn.jsdelivr.net/gh/wanderer-ai/cdn/chat-webcomponent/wanderer-chat.js"><\/script>\n\n  </body>\n</html>\n')])])])])}),[],!1,null,null,null);t.default=r.exports}}]);