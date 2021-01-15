# Wanderer packages
Wanderer.ai is organized as mono repository powered by [lerna](https://lerna.js.org/). Lerna enables us to split the project into several packages that depends on each other without publishing them to npm while developing. Also Lerna manages the versioning for all the packages. Here you can see the packages in detail:

## wanderer
This is an important core package for the entire wanderer system. It provides the following functions:
* Basic plugin and dependency management
* Events and messages between plugins
* Some other important core functionalities

## wanderer-broadcast
The broadcast package provides an event bus between several plugins and packages.

## wanderer-builder-browser
This package provides the basic vue component for the builder.
So the builder can easily consumed by other apps.

## wanderer-builder-nuxt
This is the main package to generate and deploy the builder.

## wanderer-builder-worker
This package provides some web worker functionality for the builder.

## wanderer-chat-browser
This package contains the vue componet for the wanderer chat.

## wanderer-chat-nuxt
This package is used to build and generate the chat web component.

## wanderer-docs
This package contains the whole Wanderer.ai documentation.

## wanderer-graph
This package contains a graph representation for the traverser.

## wanderer-nested-data
A helper package for working with nested data.

## wanderer-plugin-action-browser
This plugin contains basic actions like language switching, jumpig and imports. This is the browser part.

## wanderer-plugin-action-worker
TThis plugin contains basic actions like language switching, jumpig and imports. This is the worker part.

## wanderer-plugin-base-browser
This plugin contains basic nodes and edges like flows, messages and conclusions. This is the browser part.

## wanderer-plugin-base-worker
This plugin contains basic nodes and edges like flows, messages and conclusions. This is the worker part.

## wanderer-plugin-question-browser
This plugins implements the question and suggestion system. This is the browser part.

## wanderer-plugin-question-worker
This plugins implements the question and suggestion system. This is the worker part.

## wanderer-traversal
The traversal is the hart beat and brain of Wanderer.ai. It enables traversing the data and executing the deep logic.

## wanderer-vue-graph
This plugin represents the graph data at VueJS level.

## wanderer-webworker
A basic webworker interface.
