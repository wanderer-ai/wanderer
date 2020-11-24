
import Wanderer from 'wanderer'
import { thread as workerThread } from 'wanderer-webworker'

import wandererGraph from 'wanderer-graph'
import wandererTraversal from 'wanderer-traversal'

var wanderer = new Wanderer()

wanderer.provide('thread', self)


// Todo: Der Thread provided messages zurück und in den Graph hinein

wanderer.use(wandererGraph)
wanderer.use(workerThread)
wanderer.use(wandererTraversal)

// self.addEventListener('message', function(e) {
//   console.log('Message received from worker')
//   console.log(e)
// }, false);
