const { dia, elementTools, shapes, linkTools, util } = joint;
// Create a new directed graph
const graph = new dia.Graph({}, { cellNamespace: shapes });

var CustomLinkView = joint.dia.LinkView.extend({
  // custom interactions:
  pointerdblclick: function(evt, x, y) {
      this.addVertex(x, y);
  },
  contextmenu: function(evt, x, y) {
      this.addLabel(x, y);
  },

  // custom options:
  options: joint.util.defaults({
      doubleLinkTools: true,
  }, joint.dia.LinkView.prototype.options)
});


// Create a new paper, which is a wrapper around SVG element
const paper = new dia.Paper({
  interactive: { vertexAdd: false }, // disable default vertexAdd interaction
  el: document.getElementById('graph-container'),
  model: graph,
  linkView: CustomLinkView,
  interactive: { vertexAdd: false }, // disable default vertexAdd interaction,
  width: 10000,
  height: 20000,
  gridSize: 10,
  drawGrid: true,
  background: {
    color: '#f9f9f9'
  },
  async: true,
  //Viewport function supports collapsing/uncollapsing behaviour on paper
  viewport: function(view) {
    // Return true if model is not hidden
    return !view.model.get('hidden');
  }
});




let duplicateFrame = []

/*
  There is not button set on the Stages yet so this is an event handler for when clicked on any of the stages
*/
paper.on('element:pointerclick', function(view, evt) {
    evt.stopPropagation();
    if(view.model['id'] == "https://data.suny.edu/entities/oried/rdaf/nist/E" || view.model['id'] == "https://data.suny.edu/entities/oried/rdaf/nist/P" || view.model['id'] == "https://data.suny.edu/entities/oried/rdaf/nist/GA"){
      toggleBranch(view.model);
    }
    // resetting the layout here has an effect after collapsing and then moving the topic nodes
    // manually to be closer (it moves them so the expanded nodes will fit if you re-expand after
    // moving. It doesn't seem to have any effect after just collapsing a node's children
    // though. So I think it has promise as an approach but more work is needed to figure out
    // how to get the layout to redraw everytime the way we want it to
})



function buildTheGraph(){
  var Elements = []
    fetch('graph.jsonld')
  .then(response => response.json())
   // specifying a frame allows you to set the shape of the graph you want to navigate
  .then(data => jsonld.frame(data,
    {
        "@context": {
            "name": "https://schema.org/name",
            "additionalType": "https://schema.org/additionalType",
            "description": "https://schema.org/description",
            "sunyrdaf": "https://data.suny.edu/vocabs/oried/rdaf/suny/",
            "sunyrdaf:includes": {
                "@type": "@id"
            },
            "sunyrdaf:resultsFrom": {
                "@type": "@id"
            },
            "sunyrdaf:generates": {
              "@type": "@id"
            },
            "sunyrdaf:extends": {
              "@type": "@id"
            },
            "sunyrdaf:Method":{
              "@type": "@id"
            },
            "sunyrdaf:Participant":{
              "@type": "@id"
            },
            "sunyrdaf:Activity":{
              "@type": "@id"
            },
        },
  }))
  .then(frame => {

      // example of pulling a single Outcome and linked Activity from the input data file
      // in reality we want to navigate the entire graph
      const frameArray = frame['@graph']
      duplicateFrame = frameArray
      frameArray.forEach(node =>{
            if(node['additionalType'] == "RdAF Stage"){
              var stage = linkNodes(node, Elements, "", "Stages")
              Elements.push(stage)
              topic = node['sunyrdaf:includes']
              if(Array.isArray(topic)){
                topic.forEach(topics =>{
                  var tools = [];
                  if(topics){
                    //Creates the topic
                    var topicElement = linkNodes(topics, Elements, stage, "Topics")
                    Elements.push(topicElement)
                    //createTextBlock(topicElement, node, stage)
                    if(topics["sunyrdaf:includes"]){
                      //Creates the consideration button if a topic includes consideration
                      var port3 = createPort('Considerations', 'out');
                      // Add custom tool buttons for each port
                      topicElement.addPort(port3);// Adds a port to the element
                      tools.push(createConsiderationButton(port3))//Create the button
                      graph.addCells(topicElement);
                      toolsView = new joint.dia.ToolsView({ tools: [tools]});
                      topicElement.findView(paper).addTools(toolsView);//Embed the tools view into the element view
                    }
                    var port2 = createPort('Outcomes', 'out');
                    // Add custom tool buttons for each port
                    topicElement.addPort(port2);
                    tools.push(createButton(port2))//Creates the Outcome button
                    graph.addCells(topicElement);
                    toolsView = new joint.dia.ToolsView({ tools: tools});
                    topicElement.findView(paper).addTools(toolsView);
                    checkOutcomes(topics, Elements, topicElement)
                  }
                })
              }
            }
      });

      graph.addCells(Elements)
      graph.getElements().forEach(element =>{
        if(!element.get('hidden'))
          element.transition('position/x', 250, {
            delay: 100,
            duration: 5,
            timingFunction: function(t) { return t*t; },
            valueFunction: function(a, b) { return function(t) { return a + (b - a) * t }}
          });
      })
      layout = doLayout();
  })
}





//If we want to use a pre-defined algorithm to traverse over the tree and create the tree, we will still need seperate functions for each and every type of node,
//Beacuse this will allows use to interact with the node later using its type when we put the buttons in function.
function checkOutcomes(topic, arr, parentNode){
  //Creates all the Outcomes that are generated by the topic
  for (const key in topic){
    if(key.startsWith('sunyrdaf')){
      if(key == "sunyrdaf:generates"){
        if(Array.isArray(topic[key])){
          topic[key].forEach(outcomes =>{
            const outcomeElement = linkNodes(outcomes, arr, parentNode, "Outcomes")
            //Check for activities in the outcome
            checkForActivities(outcomes, arr, outcomeElement)
          })
        }else{ //Condition if the topic has generated only one outcome
          const outcomeElement = linkNodes(topic[key], arr, parentNode, "Outcomes")
          //Check for activities in the outcome
          checkForActivities(topic[key], arr, outcomeElement)
        }
      }else if(key == "sunyrdaf:includes"){
        //Creates consideration elements if a topic includes considerations
        checkForConsiderations(topic[key], arr, parentNode);
      }
    }

  }

}



function createTextBlock(element, node, parentNode){
  nodeCellView = paper.findViewByModel(parentNode)
  var bbox = nodeCellView.model.getBBox();
  var paperRect1 = paper.localToPaperRect(bbox);
  // Draw an HTML rectangle above the element.
  var div = document.createElement('div');
  nodeCellView.el.style.position = "relative"
  div.style.position = 'absolute';
  div.style.background = 'white';
  div.textContent = node['description']
  var length = element * 2
  div.style.width = ((paperRect1.width)/2) + 'px';
  div.style.height = (length) + 'px';
  div.style.border = "1px solid black";
  div.style.fontWeight = "bold"
  div.style.fontSize = "20px"
  div.id = element.id
  div.style.fontFamily = "Cambria"
  div.style.lineBreak = 0.5
  div.style.visibility = "hidden"
  div.style.backgroundColor = "lightgrey"
  paper.el.appendChild(div);
}

//Function to create considerations nodes
function checkForConsiderations(outcome, arr, parentNode){
  if(Array.isArray(outcome)){
    //Condition to handle topics that includes multiple considerations
    for (const considerations of outcome) {
      if (considerations['name'] == undefined) {
          for (const nodes of duplicateFrame) {
              if (nodes['@id'] == considerations) {
                  const considerationElement = linkNodes(nodes, arr, parentNode, "Considerations");
                  createTextBlock(considerationElement, nodes, parentNode)
                  return considerationElement;
              }
          }
      } else {
          const considerationElement = linkNodes(considerations, arr, parentNode, "Considerations");
          createTextBlock(considerationElement, considerations, parentNode)
          return considerationElement;
      }
  }

  }else{ //Condition to handle topics that includes a single considerations
    if(outcome['name'] == undefined){
      for (const nodes of duplicateFrame) {
          if (nodes['@id'] == outcome) {
              const considerationElement = linkNodes(nodes, arr, parentNode, "Considerations");
              createTextBlock(considerationElement, nodes, parentNode)
              return considerationElement;
          }
      }
    }else{
      const considerationElement = linkNodes(outcome, arr, parentNode, "Considerations")
      createTextBlock(considerationElement, outcome, parentNode)
      return considerationElement
    }
  }
}

//Function to Create activity nodes that are the results of the ouctomes generated
function checkForActivities(outcome, arr, parentNode){
  var portName = ['NT1', "PG1", "AC1"]
  const embedButton = buttonView("Activities", parentNode, portName)
  for (const key in outcome){
    if(key.startsWith('sunyrdaf')){
      if(key == "sunyrdaf:resultsFrom"){
        if(Array.isArray(outcome)){ //Conditions to create multiple activities
          outcome[key].forEach(activity =>{
            const activityElement = linkNodes(activity, arr, parentNode, "Activities")
          })
        }else{// Condition to create a single activity
          if(outcome[key]['name'] == undefined){
            duplicateFrame.forEach(nodes =>{
              if(nodes['@id'] == outcome[key]){
                const activityElement = linkNodes(nodes, arr, parentNode, "Activities")
              }
            })
          }else{
            const activityElement = linkNodes(outcome[key], arr, parentNode, "Activities")
          }
        }
      }else if(key == "sunyrdaf:includes"){
        const consideration = checkForConsiderations(outcome[key], arr, parentNode)
        var portName = ['Definition']
        const embedButton = buttonView("Definition", consideration, portName)
      }else if(key == "sunyrdaf:extends"){
        //Instead Of creating an element and a link for the subtopic, we have just used
        //the Name, description and the catalog number to define the subtopic into a textblock
        var subTopic = checkForSubTopics(outcome[key], arr, parentNode);
        if(subTopic != undefined){
          //This creates the si
          var nodeCellView = paper.findViewByModel(parentNode)
          var bbox = nodeCellView.model.getBBox();
          var paperRect1 = paper.localToPaperRect(bbox);
          // Draw an HTML rectangle above the element.
          var div = document.createElement('div');
          nodeCellView.el.style.position = "relative"
          div.style.position = 'absolute';
          div.style.background = 'white';
          div.textContent = subTopic
          var length = subTopic * 2
          div.style.width = ((paperRect1.width)/2) + 'px';
          div.style.height = (length) + 'px';
          div.style.border = "1px solid black";
          div.style.fontWeight = "bold"
          div.style.fontSize = "20px"
          div.id = parentNode.id
          div.style.fontFamily = "Cambria"
          div.style.lineBreak = 0.5
          div.style.visibility = "hidden"
          paper.el.appendChild(div);

        }
      }
    }
  }
}
//This function creates the subtopic
/*
  For now the subtopics are linked to its paretnode because if not linked it distracts the directed graph.
*/
function checkForSubTopics(outcome, arr, parentNode){
  if(outcome['name'] || outcome['description']){
    const subTopic = linkNodes(outcome, arr, parentNode, "Subtopic")
    return subTopic;
  }else {
    for (const nodes of duplicateFrame) {
      if (nodes['@id'] == outcome) {
        outcome = nodes
        const subTopic = linkNodes(outcome, arr, parentNode, "Subtopic")
        return subTopic;
      }
    }
  }
}



function linkNodes(childNode, arr, parentNode, typeOfNode){
  if(typeOfNode == "Stages"){
    var stage = createStage(childNode['@id'], childNode['name'])
    stage.prop('name/first', "Stages")
    setPorts(stage, ['Topics']);
    arr.push(stage)
    return stage;
  }
  if(typeOfNode == "Topics"){
    var topicElement = createTopics(childNode['@id'], childNode['name'])
    const linkStageToTopics = makeLink(parentNode, topicElement)
    linkStageToTopics.labels([{attrs:{text:{text:"Topics"}}}])
    arr.push(topicElement, linkStageToTopics)
    return topicElement;
  }
  if(typeOfNode == "Outcomes"){
    const outcomeElement = createOutcomes(childNode['@id'], childNode['name'])
    const linkTopicToOutcome = makeLink(parentNode, outcomeElement)
    outcomeElement.prop('name/first', "Outcomes")
    arr.push(outcomeElement, linkTopicToOutcome)
    return outcomeElement;
  }
  if(typeOfNode == "Activities"){
    const activityElement = createActivities(childNode['@id'], childNode['name'])
    const linkOutcomeToActivity = makeLink(parentNode, activityElement)
    activityElement.prop('name/first', "Activities")
    linkOutcomeToActivity.labels([{attrs:{text:{text: "Activities"}}}])
    arr.push(activityElement, linkOutcomeToActivity)
    return activityElement;
  }
  if(typeOfNode == "Considerations"){
    const considerationElement = createConsiderations(childNode['@id'], childNode['name'])
    const linkOutcomeToConsideration = makeLink(parentNode, considerationElement)
    considerationElement.prop('name/first', "Considerations")
    linkOutcomeToConsideration.labels([{attrs:{text:{text: "Considerations"}}}])
    arr.push(considerationElement, linkOutcomeToConsideration)
    return considerationElement;
  }
  if(typeOfNode == "Subtopic"){
    var id = childNode['@id'];
    var parts = id.split("/");
    var category = parts[parts.length - 1];
    let description;
    if(childNode['name'] == undefined){
      description = category + ": " + childNode['description']
    }else if(childNode['description'] == undefined){
      description = category + ": " + childNode['name']
    }else{
      description = category + ": " + childNode['name'] + ": " + childNode['description']
    }
    return description
  }
}


function doLayout() {
  // Apply layout using DirectedGraph plugin
  layout = joint.layout.DirectedGraph.layout(graph, {
    setLinkVertices: true,
    rankDir: 'LR',
    nodeSep: 25, // Reduce separation between adjacent nodes
    edgeSep: 10, // Reduce separation between adjacent edges
    rankSep: 10, // Reduce separation between ranks
    marginX: 30,
    marginY: 30,
    ranker:'tight-tree',
    resizeClusters: false, // Prevent parent elements from stretching to fit children
    setPosition: function(element, position) {
       // Check if the parent element is hidden
       const parent = element.getParentCell();
       if (parent && parent.get('hidden')) {
         // Reduce the vertical spacing between elements if the parent is hidden
         element.transition('position/y', position.y + 50, {
           delay: 100,
           duration: 500,
           timingFunction: joint.util.timing.linear
         });
       } else {
         // Default spacing
         element.transition('position/y', position.y + 150, {
           delay: 100,
           duration: 500,
           timingFunction: joint.util.timing.linear
         });
       }
       // Set the position of the element
       element.translate(position.x, position.y);
     }
   });
   return layout;
}




buildTheGraph();

//doLayout();




