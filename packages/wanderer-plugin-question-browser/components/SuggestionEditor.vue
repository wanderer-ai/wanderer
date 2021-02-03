<template>
  <div>

    <builder-text-input label="Suggestion" placeholder="Suggestion" v-model="suggestion" />

    <builder-select-input label="Type" v-model="type" :options="types"/>

    <builder-range-input label="Priority" type="range" v-model="priority" min="0" max="100" />

    <builder-checkbox-group v-if="type!='button'">

      <builder-checkbox-input label="Required" v-model="required" />

    </builder-checkbox-group>

  </div>
</template>

<script>

export default {
  data: function () {
    return {
      types: {
        button: 'Button',
        checkbox: 'Checkbox',
        text: 'Text',
        textarea: 'Textarea',
        number: 'Number',
        email: 'Email',
        password: 'Password'
      }
    }
  },
  computed: {
    suggestion: {
      get: function () {
        return this.$builder.getTranslatableVertexDataValue('suggestion')
      },
      set: function (value) {
        this.$builder.setTranslatableVertexDataValue('suggestion', value)
      }
    },
    type: {
      get: function () {
        return this.$builder.getVertexDataValue('type')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('type', value)
      }
    },
    priority: {
      get: function () {
        return this.$builder.getVertexDataValue('priority')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('priority', value)
      }
    },
    required: {
      get: function () {
        return this.$builder.getVertexDataValue('required')
      },
      set: function (value) {
        this.$builder.setVertexDataValue('required', value)
      }
    }
  }
}
</script>

<style>

</style>
