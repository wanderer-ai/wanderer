
import Wanderer from 'wanderer'
import { thread as WorkerThread } from 'wanderer-webworker'

var wanderer = new Wanderer()

wanderer.provide('thread', self)

wanderer.use(WorkerThread)
