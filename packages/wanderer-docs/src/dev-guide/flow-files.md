# The flow file format
The flow file is a common JSON format. To edit it by hand, you need to know how it's built.

To keep it compatible with graph databases, there are essentially only two large arrays in the document. A `vertices` array and an `edges` array.

The vertices array contains all node objects and the edges array contains all edge objects. Thats it.

Within a graph database, all data must always belong to an edge or to a node. If you want to add metadata to the document yourself, you can just do that. This data is then loaded into the Builder when the file gets restored and its beeing stored back to the file, if you download it again. The only requirement is that this data must be inside a vertex or edge object.

For example add new data by adding a new field to a message vertex:

```
{
  "my_personal_comment": "This message sucks",
  "message": {
    "en": "Hey!",
    "de": "Hey!"
  },
  "forgetful": false,
  "_id": "67f84baa-9a90-4dda-8823-3b72a1de5c24",
  "_collection": "message",
  "_origin": false,
  "_x": -397.0000000000001,
  "_y": -27.000000000000032
  }
```

## Underscore fields
If you take a closer look at the data, you will notice that some fields begin with an underscore. These data is very important for the function of the builder and the flow. Please only change it if you know what you are doing. Incorrect values ​​can mean that the flow can no longer be loaded.

### Vertice underscore fields
* __collection:__ The collection this vertex belongs to. For example "message" or "conclusion".
* __id:__ A unique, automatically generated ID for this vertex.
* __origin:__ Is this the origin starting node?.
* __x:__ The x coordinates within the builder.
* __y:__ The y coordinates within the builder.

### Edge underscore fields
* __collection:__ The collection this edge belongs to. For example "leadsTo" or "isAnswerableBy".
* __id:__ A unique, automatically generated ID for this edge.
* __from:__ The ID of the Edge's source node.
* __to:__ The ID of the Edge's target node.
