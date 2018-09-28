import Editor from './components/Editor.vue'

export default {

  install (Brain) {

    //console.log('importing register Module...')
    //var Editor = require('./components/Editor.vue')
    //console.log('after importing ')

    // Editor.$brain = Brain

    //Brain.Vue.component('QuestionEditorComponent', Editor)

    // https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html

    // Brain.Vue.component('MyComponent', Editor);

    Brain.registerVertexCollection('question',{
      models:[
        {
          name: 'question',
          isMultiLanguage: true
        },
        {
          name: 'simpleProp',
          isMultiLanguage: false
        },
        {
          name: 'complexProp',
          isMultiLanguage: true
        }
      ],
      /*store: {
        state: {
          questions: {},
          simpleProp: {},
          complexProp: {}
        },
        mutations: {
          add (state, {documentData, context}){
            context._vm.$set(state.questions, documentData._id, documentData.question)
            context._vm.$set(state.simpleProp, documentData._id, documentData.simpleProp)
            context._vm.$set(state.complexProp, documentData._id, documentData.complexProp)
          },
          setQuestion (state, {id, language, question}){
            if(state.questions[id] === undefined){
              this._vm.$set(state.questions, [id], {})
            }
            this._vm.$set(state.questions[id], language, question)
          },
          setSimpleProp (state, {id, data}){
            this._vm.$set(state.simpleProp, id, data)
          },
          setComplexProp (state, {id, data}){
            if(state.complexProp[id] === undefined){
              this._vm.$set(state.complexProp, [id], {})
            }
            this._vm.$set(state.complexProp[id], 'foo', data)
          },
        }
      },*/
      label: 'Question',
      color: '#007BFF',
      cytoscapeClasses: 'question',
      cytoscapeCtxMenuSelector: '.question',
      creatable: true,
      restrictOutgoingConnections: [
        {
          through: 'leadsTo',
          to: 'suggestion'
        }
      ],
      defaultFields: {
        question: {
          en: 'New question',
          de: 'Neue Frage'
        }
      },
      toCytoscape: function(data){
        return {
          label: 'Question'
        }
      },
      editorComponent: Editor
      // chatComponent:
    })

    Brain.registerVertexCollection('suggestion',{
      store: {
        state: {
          suggestions: {}
        },
        mutations: {
          add (state, documentData){
            state.suggestions[documentData._id] = documentData.suggestion
          }
        }
      },
      label: 'Suggestion',
      color: '#28A745',
      cytoscapeClasses: 'suggestion',
      cytoscapeCtxMenuSelector: '.suggestion',
      creatable: true,
      restrictIncommingConnections: [
        {
          from: 'question',
          through: 'leadsTo'
        }
      ],
      defaultFields: {
        'suggestion': {
          'de': 'Antwort',
          'en': 'Answer'
        }
      },
      toCytoscape: function(data){
        return {
          label: 'Suggestion'
        }
      },
      //editorComponent: Editor
      // chatComponent:
    })

    Brain.addCytoscapeStylesheet([

      {
        selector: '.question',
        style: {
          'height': '100px',
          'width': '100px',
          'font-size': '20px',
          'background-color': '#007BFF',
          'label': 'data(label)'
        }
      },

      {
        selector: '.suggestion',
        style: {
          'height': '50px',
          'width': '50px',
          'font-size': '20px',
          'background-color': '#28A745',
          'label': 'data(label)'
        }
      }

    ])

  },

}
