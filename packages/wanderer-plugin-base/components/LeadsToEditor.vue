<template>
  <div>

    <div class="form-group">
      <label for="label">Type</label>
      <select v-model="type" class="form-control" id="type">
        <option value="or">default</option>
        <option value="and">require</option>
        <option value="not">forbid</option>
      </select>
    </div>

    <div class="form-group">
      <label for="priority">Priority ({{priority}})</label>
      <input type="range" v-model="priority" class="custom-range" id="priority" min="0" max="100">
    </div>

    <div class="row">
      <div class="col">

        <div class="form-group">
          <label for="name">Name</label>
          <input v-model="name" type="text" class="form-control" id="name">
        </div>

      </div>
      <div class="col">

        <div class="form-group">
          <label for="compareVariable">Expose</label>
          <select id="expose" class="form-control" v-model="expose">
            <option :value="false">none</option>
            <option
              v-for="data, name in lifecycleData"
              :value="name">{{data.label}}{{(data.exposeDefault? ' (default)':'')}}</option>
          </select>
        </div>

      </div>
    </div>

    <div class="form-group">
      <label for="condition">Condition</label>
      <select id="condition" class="form-control" v-model="condition">
        <option :value="false">none</option>
        <option
          v-for="edgeCondition, name in edgeConditions"
          :value="name">{{edgeCondition.label}}{{(edgeCondition.default? ' (default)':'')}}</option>
        <option value="custom">custom</option>
      </select>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-group" v-if="condition=='custom'">
          <select id="compareVariable" class="form-control" v-model="compareVariable">
            <option :value="false">none</option>
            <option
              v-for="data, name in lifecycleData"
              :value="name">{{data.label}}</option>
          </select>
        </div>
        <!-- <div class="form-group" v-if="condition=='custom'">
          <input type="text" v-model="compareVariable" class="form-control" id="compareVariable" placeholder="variable">
        </div> -->
      </div>
      <div class="col">
        <div class="form-group" v-if="condition=='custom'">
          <!-- <label for="compareCondition">Compare Condition</label> -->
          <select id="compareCondition" class="form-control" v-model="compareCondition">
            <option value="==">==</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
          </select>
        </div>
      </div>
      <div class="col">
        <div class="form-group" v-if="condition=='custom'">
          <!-- <label for="compareValue">Compare Value</label> -->
          <input type="text" v-model="compareValue" class="form-control" id="compareValue" placeholder="value">
        </div>
      </div>
    </div>

    <div class="form-group">
      <label for="edgeMethod">Method</label>
      <select id="edgeMethod" class="form-control" v-model="method">
        <option :value="false">none</option>
        <option
          v-for="edgeMethod, name in edgeMethods"
          :value="name">{{edgeMethod.label}}</option>
      </select>
    </div>

  </div>
</template>

<script>

import WandererSingleton from 'wanderer-singleton'
import WandererBuilder from 'wanderer-builder-singleton'
import WandererCytoscapeSingleton from 'wanderer-cytoscape-singleton'

export default {
  computed: {
    type: WandererBuilder.getEdgeModel('type'),
    name: WandererBuilder.getEdgeModel('name'),
    expose: WandererBuilder.getEdgeModel('expose'),
    method: WandererBuilder.getEdgeModel('method'),
    priority: WandererBuilder.getEdgeModel('priority'),
    condition: WandererBuilder.getEdgeModel('condition'),
    compareVariable: WandererBuilder.getEdgeModel('compareVariable'),
    compareCondition: WandererBuilder.getEdgeModel('compareCondition'),
    compareValue: WandererBuilder.getEdgeModel('compareValue'),
    lifecycleData () {
      if (this.$store.state.wanderer.builder.editEdge !== 0) {
        let cytoscapeEdge = WandererCytoscapeSingleton.cy.getElementById(this.$store.state.wanderer.builder.editEdge)
        let cytoscapeSourceNode = cytoscapeEdge.source()
        let cytoscapeSourceNodeId = cytoscapeSourceNode.id()
        let cytoscapeSourceNodeData = this.$store.state.wanderer.vertexDocumentData[cytoscapeSourceNodeId]
        let sourceNodeCollection = WandererSingleton.getVertexCollection(cytoscapeSourceNodeData._collection)
        if(sourceNodeCollection.lifecycleData != undefined) {
          return sourceNodeCollection.lifecycleData
        }
      }
    },
    edgeConditions () {
      if (this.$store.state.wanderer.builder.editEdge !== 0) {
        let cytoscapeEdge = WandererCytoscapeSingleton.cy.getElementById(this.$store.state.wanderer.builder.editEdge)
        let cytoscapeSourceNode = cytoscapeEdge.source()
        let cytoscapeSourceNodeId = cytoscapeSourceNode.id()
        let cytoscapeSourceNodeData = this.$store.state.wanderer.vertexDocumentData[cytoscapeSourceNodeId]
        let sourceNodeCollection = WandererSingleton.getVertexCollection(cytoscapeSourceNodeData._collection)
        if(sourceNodeCollection.edgeConditions != undefined) {
          return sourceNodeCollection.edgeConditions
        }
      }
    },
    edgeMethods () {
      if (this.$store.state.wanderer.builder.editEdge !== 0) {
        let cytoscapeEdge = WandererCytoscapeSingleton.cy.getElementById(this.$store.state.wanderer.builder.editEdge)
        let cytoscapeTargetNode = cytoscapeEdge.target()
        let cytoscapeTargetNodeId = cytoscapeTargetNode.id()
        let cytoscapeTargetNodeData = this.$store.state.wanderer.vertexDocumentData[cytoscapeTargetNodeId]
        let targetNodeCollection = WandererSingleton.getVertexCollection(cytoscapeTargetNodeData._collection)
        if(targetNodeCollection.edgeMethods != undefined) {
          return targetNodeCollection.edgeMethods
        }
      }
    }
  }
}
</script>

<style>

</style>
