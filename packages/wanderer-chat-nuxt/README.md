# Wanderer.ai Conversation Builder

## User guide

This short userguide will introduce you on how to use the Wanderer.ai Conversation Builder. This software bases on pure web technologies. So evrything you need to get started is your webbrowser. At the moment the whole software is not optimized for mobile devices. So it would be the best if you have a mouse available.

### Toolbar
On the top of the screen you will notice the toolbar. This is the place from where you can start new projects, restore projects ore save your current work.
If you click on edges or vertices sometimes other specific tools may show up.

#### Create, restore or save a project
Save your project by clicking on the file symbol inside the toolbar. Tham click on "save".
Use the same toolbar button if you want to restore your saved project.
You can also start new projects from there.

#### Switch languages for your project
Your chat project can hold several translations for all chat messages. You can view and edit other languages by switching the current language.
Click on the flags icon inside the toolbar to open the language manager. There you can choose the current language for the conversation builder.
Inside the language manager you can also add new languages to your project or you can remove existing languages.

#### Start the chat
The Wanderer.ai Conversation Builder has a build in chat preview. Open the chat by clickuing on the chat bubbles button inside the toolbar.

### Flow editor
The whole conversation builder is optimized to edit and view the chat flow graph. Imagine the graph like some kind of a mind map. A graph in general consist of vertices and edges. Vertices for example are questions and answers. Edges are the connections between them.

#### Zoom and pan
Use you mousewheel to zoom in and out of your graph. Grap the flow at some white area and use the mouse to pan the map.

#### The context menu
Hover over a vertex and hold down the right mouse button to open the context menu. This menu offers you a quick way to create and connect new vertices to the one you have hovered.

#### Selecting vertices and edges
Click an a vertex or an edge to select them. You can also hold down the ctrl or shift key and use the left mouse button to select multiple edges and vertices.

#### Drag and drop vertices
You can move selected vertices around by grabbing them with the mouse. Note: The origin node cannot be moved.

#### Delete vertices and edges
Select one or more vertices or edges and click the trash symbol inside the toolbar.
Note: You can temporary disable vertices or large structures inside your graph by just deleting the connecting endge.

#### Connect vertices together.
You can connect two vertices together by selecting them one after another. The order in which the vertices are selected will determine the direction of the new edge. After you have selected two vertices the connect symbol will show up in the toolbar. Note: You can only connect comatible vertices together.

### Edit vertices and edges
Double click on vertices or edges will open the data editor. There you can specify the attributes of each vertex and edge. You can also select a vertice or an edge and use the edit tool from the toolbar.

### Build your first bot

#### Quick start
Just open the builder and create a new project. You will than notice that the first vertex was alredy created. This is your origin flow vertex. Every project need this node as a start point. This node will also hold some basic informations about your project and your flow.

Doubleclick the flow node to edit basic project details. You will notice that your chat flow will have an onboarding and an offboarding message. The onboarding message is thrown if the chat starts. And the offboarding message is thrown if your chat has ended.

Hover your mouse over the origin node and hold down the right mouse key to open the context menu. Than select question. A new question node will appear. Drag the newly created node away to have some more space. Than add a new suggestion node to your question using the context menu.

Now start the chat by clicking on the chat bubbles in the upper right corner of the toolbar.

#### Connecting more suggestions
You can connect more suggestions to a question. By default they will appear as a button inside the question. Change the behavior of a suggestion by editing its type. For example use checkboxes to build multiple choice questions. So just add two new suggestions to your question and drag them away. They will probably spawn all in the same place.
Than doubleclick on each of them and change their types to checkbox. Than restart the chat. If you want change the priority of the suggestions to alter the display order.

#### Connecting more questions to your flow
For now our chat consists of only one question with three possible answers. But we want to ask more questions if a specific answere was given. So just connect a new question to the suggestion of your choice. Than connect a new suggestion to that new question. Feel free to edit the questino and the suggestion details. Than restart the chat.

#### Connecting questions to questions
If you want to execute a question if another question was answered regardless of the answere, you can just connect a question directly to a existing question. Chaining questions together this way the given answers will not matter.

#### Reaching a question with more than one edge
Sometimes a question shal be asked if one or another answere where given. In that case you can connect your Question with an extra edge. Just select the suggestion of your choice. Hold then down strg and select the question of your choice. The connect tool should appear in the toolbar. Click it to create the new edge. Start the chat and try out the several answers.

#### Build a logical structure using your first conclusion.
Dont worry. You have already build another logical structure in the step before. You have triggered a question from two different suggestions. Experts would call something a logical OR gate. Because the question can be triggered using the one OR the other suggestion. You see, its not difficult to build logical structures like this. A conclusion is a little bit similar to a question. But it does not have possible suggestions. A conclusion is just a pice of information that rises up if some other events have occured. A conclusion is like a AHA! effect.

You can use conclusions to bundle some informations together and than connect new questions to that. This is simpler than connecting each of the following questions to the conditional vertices directly.
