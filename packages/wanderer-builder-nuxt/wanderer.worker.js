
import Wanderer from 'wanderer'
import { thread as workerThread } from 'wanderer-webworker'

import wandererGraph from 'wanderer-graph'
import wandererTraversal from 'wanderer-traversal'

import pluginBase from 'wanderer-plugin-base-worker'

// Create new Wanderer instance
var wanderer = new Wanderer()

// Provide the worker thread
wanderer.provide('thread', self)

// Load the several plugins
wanderer.use(wandererGraph)
wanderer.use(workerThread)
wanderer.use(wandererTraversal)
wanderer.use(pluginBase)
