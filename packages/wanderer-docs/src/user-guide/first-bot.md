# Build your first bot

## Quick start
Just open the builder and create a new project. You will then notice that the first vertex was alredy created. This is your origin flow vertex. Every project need this node as a start point. This node will also hold some basic information about your project and your flow.

Doubleclick the flow node to edit basic project details.

Hover your mouse over the origin node and hold down the right mouse key to open the context menu. Then select question. A new question node will appear. Drag the newly created node away to have some more space. Then add a new suggestion node to your question using the context menu.

Now start the chat by clicking on the chat bubbles in the upper right corner of the toolbar.

## Connecting more suggestions
You can connect more suggestions to a question. By default they will appear as a button inside the question. Change the behavior of a suggestion by editing its type. For example use checkboxes to build multiple choice questions. So just add two new suggestions to your question and drag them away. They will probably spawn all in the same place.
Then doubleclick on each of them and change their types to checkbox. Then restart the chat. If you want change the priority of the suggestions to alter the display order.

## Connecting more questions to your flow
For now our chat consists of only one question with three possible answers. But we want to ask more questions if a specific answere was given. So just connect a new question to the suggestion of your choice. Then connect a new suggestion to that new question. Feel free to edit the questino and the suggestion details. Then restart the chat.

## Connecting questions to questions
If you want to execute a question if another question was answered regardless of the answere, you can just connect a question directly to a existing question. Chaining questions together this way the given answers will not matter.

## Reaching a question with more then one edge
Sometimes a question shal be asked if one or another answere where given. In that case you can connect your Question with an extra edge. Just select the suggestion of your choice. Hold then down strg and select the question of your choice. The connect tool should appear in the toolbar. Click it to create the new edge. Start the chat and try out the several answers.

## Build a logical structure using your first conclusion.
Dont worry. You have already build another logical structure in the step before. You have triggered a question from two different suggestions. Experts would call something a logical OR gate. Because the question can be triggered using the one OR the other suggestion. You see, its not difficult to build logical structures like this. A conclusion is a little bit similar to a question. But it does not have possible suggestions. A conclusion is just a pice of information that rises up if some other events have occured. A conclusion is like a AHA! effect.

You can use conclusions to bundle some information together and then connect new questions to that. This is simpler than connecting each of the following questions to the conditional vertices directly.
