
import Wanderer from 'wanderer'
import { thread as workerThread } from 'wanderer-webworker'
import builderPlugin from 'wanderer-builder-worker'
import chatPlugin from 'wanderer-chat-worker'
import wandererGraph from 'wanderer-graph'
import wandererTraversal from 'wanderer-traversal'

import pluginBase from 'wanderer-plugin-base-worker'
import pluginQuestion from 'wanderer-plugin-question-worker'
import pluginAction from 'wanderer-plugin-action-worker'

// Create new Wanderer instance
var wanderer = new Wanderer()

// Provide the worker thread
wanderer.provide('thread', self)

// Load the several plugins
wanderer.use(wandererGraph)
wanderer.use(wandererTraversal)
wanderer.use(workerThread)
wanderer.use(builderPlugin)
wanderer.use(chatPlugin)
wanderer.use(pluginBase)
wanderer.use(pluginQuestion)
wanderer.use(pluginAction)
