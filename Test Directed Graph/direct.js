const { dia, elementTools, shapes, linkTools, util } = joint;
// Create a new directed graph
const graph = new dia.Graph({}, { cellNamespace: shapes });

//I need to look into it and see if it can help us with the link layout
var CustomLinkView = joint.dia.LinkView.extend({
  contextmenu: function(evt, x, y) {
      this.addLabel(x, y, 45, {
          absoluteDistance: true,
          reverseDistance: true, // applied only when absoluteDistance is set
          absoluteOffset: true,
          keepGradient: true,
          ensureLegibility: true // applied only when keepGradient is set
      });
  }
});

// Create a new paper, which is a wrapper around SVG element
const paper = new dia.Paper({
  inkView: CustomLinkView,
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
              const element1 = createStage(node['@id'], node['name'])
              setPorts(element1, ['Topics']);
              Elements.push([element1])
              topic = node['sunyrdaf:includes']
              if(Array.isArray(topic)){
                topic.forEach(topics =>{
                  var tools = [];
                  if(topics){
                    //Creates the topic
                    var element2 = createTopics(topics['@id'], topics['name'])
                    //links the topic to the stages
                    const linkStageToTopics = makeLink(element1, element2)
                    if(topics["sunyrdaf:includes"]){
                      //Creates the consideration button if a topic includes consideration
                      var port3 = createPort('Considerations', 'out');
                      // Add custom tool buttons for each port
                      element2.addPort(port3);// Adds a port to the element
                      tools.push(createConsiderationButton(port3))//Create the button
                      graph.addCells(element2);
                      toolsView = new joint.dia.ToolsView({ tools: [tools]});
                      element2.findView(paper).addTools(toolsView);//Embed the tools view into the element view
                    }
                    var port2 = createPort('Outcomes', 'out');
                    // Add custom tool buttons for each port
                    element2.addPort(port2);
                    tools.push(createButton(port2))//Creates the Outcome button
                    graph.addCells(element2);
                    toolsView = new joint.dia.ToolsView({ tools: tools});
                    element2.findView(paper).addTools(toolsView);
                    linkStageToTopics.labels([{attrs:{text:{text:"Topics"}}}])
                    checkOutcomes(topics, Elements, element2)
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
            const out = createOutcomes(outcomes['@id'], outcomes['name'])
            const linkTopicToOutcome = makeLink(parentNode, out)
            out.prop('name/first', "Outcomes")
            var portName1 = ['NT1', "PG1", "AC1"]
            const embedButton = buttonView("Activities", out, portName1)
            //Check for activities in the outcome
            checkForActivities(outcomes, arr, out)
            arr.push([linkTopicToOutcome])
          })
        }else{ //Condition if the topic has generated only one outcome
          const out = createOutcomes(topic[key]['@id'], topic[key]['name'])
            const linkTopicToOutcome = makeLink(parentNode, out)
            out.prop('name/first', "Outcomes")
            var portName1 = ['NT1', "PG1", "AC1"]
            const embedButton = buttonView("Activities", out, portName1)
            //Check for activities in the outcome
            arr.push([linkTopicToOutcome])
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
function checkForConsiderations(topic, arr, parentNode){
  if(Array.isArray(topic)){
    //Condition to handle topics that includes multiple considerations
    topic.forEach(considerations =>{
      const out = createConsiderations(considerations['@id'], considerations['name'])
      const linkTopicToOutcome = makeLink(parentNode, out)
      out.prop('name/first', "Considerations")
      arr.push([out, linkTopicToOutcome])
    })
  }else{ //Condition to handle topics that includes a single considerations
    const out = createConsiderations(topic['@id'], topic['name'])
    const linkTopicToOutcome = makeLink(parentNode, out)
    out.prop('name/first', "Considerations")
    linkTopicToOutcome.labels([{attrs:{text:{text: "Considerations"}}}])
    arr.push([out, linkTopicToOutcome])
  }
}

//Function to Create activity nodes that are the results of the ouctomes generated
function checkForActivities(outcome, arr, parentNode){
  
  for (const key in outcome){
    if(key.startsWith('sunyrdaf')){
      if(key == "sunyrdaf:resultsFrom"){
        if(Array.isArray(outcome)){ //Conditions to create multiple activities
          outcome[key].forEach(activity =>{
            const out = createActivities(activity['@id'], activity['name'])
            const linkTopicToOutcome = makeLink(parentNode, out)
            out.prop('name/first', "Activities")
            linkTopicToOutcome.labels([{attrs:{text:{text: "Activities"}}}])
            //arr.push([out])
            arr.push([out, linkTopicToOutcome])
          })
        }else{// Condition to create a single activity
          if(outcome[key]['name'] == undefined){
            duplicateFrame.forEach(nodes =>{
              if(nodes['@id'] == outcome[key]){
                const out = createActivities(nodes['@id'], nodes['name'])
                const linkTopicToOutcome = makeLink(parentNode, out)
                out.prop('name/first', "Activities")
                linkTopicToOutcome.labels([{attrs:{text:{text: "Activities"}}}])
                //arr.push([out])
                arr.push([out, linkTopicToOutcome])
              }
            })
          }else{
            const out = createActivities(outcome[key]['@id'], outcome[key]['name'])
            const linkTopicToOutcome = makeLink(parentNode, out)
            out.prop('name/first', "Activities")
            linkTopicToOutcome.labels([{attrs:{text:{text: "Activities"}}}])
            //arr.push([out])
            arr.push([out, linkTopicToOutcome])
          }
        }
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




