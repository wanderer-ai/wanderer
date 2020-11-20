
import Wanderer from 'wanderer'
import { thread as workerThread } from 'wanderer-webworker'

import WandererGraph from 'wanderer-graph'

var wanderer = new Wanderer()

var wandererGraph = new WandererGraph()

wanderer.provide('thread', self)
wanderer.provide('graph', wandererGraph)


// Todo: Der Thread provided messages zurück und in den Graph hinein


wanderer.use(workerThread)

// self.addEventListener('message', function(e) {
//   console.log('Message received from worker')
//   console.log(e)
// }, false);
