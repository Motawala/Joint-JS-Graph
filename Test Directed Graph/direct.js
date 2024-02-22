const { dia, elementTools, shapes, linkTools, util } = joint;
// Create a new directed graph
const graph = new dia.Graph({}, { cellNamespace: shapes });


// Create a new paper, which is a wrapper around SVG element
const paper = new dia.Paper({
  interactive: { vertexAdd: false }, // disable default vertexAdd interaction
  el: document.getElementById('graph-container'),
  model: graph,
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

let duplicateFrame = []
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
              const stage = createStage(node['@id'], node['name'])
              setPorts(stage, ['Topics']);
              Elements.push([stage])
              topic = node['sunyrdaf:includes']
              if(Array.isArray(topic)){
                topic.forEach(topics =>{
                  var tools = [];
                  if(topics){
                    //Creates the topic
                    var topicElement = createTopics(topics['@id'], topics['name'])
                    //links the topic to the stages
                    const linkStageToTopics = makeLink(stage, topicElement)
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
                    linkStageToTopics.labels([{attrs:{text:{text:"Topics"}}}])
                    checkOutcomes(topics, Elements, topicElement)
                    Elements.push([linkStageToTopics])
                  }
                })
              }
            }
      });
      graph.addCells(Elements)
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
            const outcomeElement = createOutcomes(outcomes['@id'], outcomes['name'])
            const linkTopicToOutcome = makeLink(parentNode, outcomeElement)
            outcomeElement.prop('name/first', "Outcomes")
            //Check for activities in the outcome
            checkForActivities(outcomes, arr, outcomeElement)
            //checkForConsiderations(outcomes, arr, outcomeElement);
            arr.push([linkTopicToOutcome])
          })
        }else{ //Condition if the topic has generated only one outcome
          const outcomeElement = createOutcomes(topic[key]['@id'], topic[key]['name'])
          const linkTopicToOutcome = makeLink(parentNode, outcomeElement)
          outcomeElement.prop('name/first', "Outcomes")
          //Check for activities in the outcome
          checkForActivities(topic[key], arr, outcomeElement)
          arr.push([outcomeElement,linkTopicToOutcome])
        }
      }else if(key == "sunyrdaf:includes"){
        //Creates consideration elements if a topic includes considerations
        checkForConsiderations(topic[key], arr, parentNode);
      }else if(key == "sunyrdaf:extends"){
        checkForSubTopics(topic[key], arr, parentNode);
      }
    }
  
  }
  
}

//Function to create considerations nodes
function checkForConsiderations(outcome, arr, parentNode){
  if(Array.isArray(outcome)){
    //Condition to handle topics that includes multiple considerations
    outcome.forEach(considerations =>{
      if(considerations['name'] == undefined){
        duplicateFrame.forEach(nodes =>{
          if(nodes['@id'] == considerations){
            const considerationElement = createConsiderations(nodes['@id'], nodes['name'])
            const linkOutcomeToConsideration = makeLink(parentNode, considerationElement)
            considerationElement.prop('name/first', "Considerations")
            arr.push([considerationElement, linkOutcomeToConsideration])
          }
        })
        
      }else{
        const considerationElement = createConsiderations(considerations['@id'], considerations['name'])
        const linkOutcomeToConsideration = makeLink(parentNode, considerationElement)
        considerationElement.prop('name/first', "Considerations")
        arr.push([considerationElement, linkOutcomeToConsideration])
      }
    })
  }else{ //Condition to handle topics that includes a single considerations
    const considerationElement = createConsiderations(outcome['@id'], outcome['name'])
    const linkOutcomeToConsideration = makeLink(parentNode, considerationElement)
    considerationElement.prop('name/first', "Considerations")
    linkOutcomeToConsideration.labels([{attrs:{text:{text: "Considerations"}}}])
    arr.push([considerationElement, linkOutcomeToConsideration])
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
            const activityElement = createActivities(activity['@id'], activity['name'])
            const linkOutcomeToActivity = makeLink(parentNode, activityElement)
            activityElement.prop('name/first', "Activities")
            linkOutcomeToActivity.labels([{attrs:{text:{text: "Activities"}}}])
            //arr.push([out])
            arr.push([activityElement, linkOutcomeToActivity])
          })
        }else{// Condition to create a single activity
          if(outcome[key]['name'] == undefined){
            duplicateFrame.forEach(nodes =>{
              if(nodes['@id'] == outcome[key]){
                const activityElement = createActivities(nodes['@id'], nodes['name'])
                const linkOutcomeToActivity = makeLink(parentNode, activityElement)
                activityElement.prop('name/first', "Activities")
                linkOutcomeToActivity.labels([{attrs:{text:{text: "Activities"}}}])
                //arr.push([out])
                arr.push([activityElement, linkOutcomeToActivity])
              }
            })
          }else{
            const activityElement = createActivities(outcome[key]['@id'], outcome[key]['name'])
            const linkOutcomeToActivity = makeLink(parentNode, activityElement)
            activityElement.prop('name/first', "Activities")
            linkOutcomeToActivity.labels([{attrs:{text:{text: "Activities"}}}])
            arr.push([activityElement, linkOutcomeToActivity])
          }
        }
      }else if(key == "sunyrdaf:includes"){
        checkForConsiderations(outcome[key], arr, parentNode)
      }
    }
  }
}


function checkForSubTopics(outcome, arr, parentNode){
  const subTopic = createConsiderations(outcome['@id'], outcome['name'])
  const link = makeLink(parentNode, subTopic)
  subTopic.prop('name/first', "Subtopic")
  arr.push([subTopic, link])
}



function doLayout() {
  // Apply layout using DirectedGraph plugin
  layout = joint.layout.DirectedGraph.layout(graph, {
	  // commenting these out had no effect - maybe they are overridden by the router algorithm?
//      setLinkVertices: false, // Optional: Prevent the plugin from setting link vertices
//      nodeSep: 50,
 //     edgeSep: 80,
      rankDir: "LR",
      ranker: 'tight-tree',
      resizeClusters: false
  });
  return layout;
}


buildTheGraph();

//doLayout();




