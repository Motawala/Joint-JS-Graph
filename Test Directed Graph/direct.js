const { dia, elementTools, shapes, linkTools, util } = joint;
// Create a new directed graph
const graph = new dia.Graph({}, { cellNamespace: shapes });

// Create a new paper, which is a wrapper around SVG element
const paper = new dia.Paper({
    el: document.getElementById('graph-container'),
    model: graph,
    width: 10000,
    height: 10000,
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
        
paper.on('element:pointerclick', function(view, evt) {
    evt.stopPropagation();
    toggleBranch(view.model);
    // resetting the layout here has an effect after collapsing and then moving the topic nodes 
    // manually to be closer (it moves them so the expanded nodes will fit if you re-expand after
    // moving. It doesn't seem to have any effect after just collapsing a node's children 
    // though. So I think it has promise as an approach but more work is needed to figure out
    // how to get the layout to redraw everytime the way we want it to
    //doLayout();
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
      frameArray.forEach(node =>{
            if(node['additionalType'] == "RdAF Stage"){
              const element1 = createStage(node['@id'], node['name'])
              setPorts(element1, ['Topics']);
              Elements.push([element1])
              topic = node['sunyrdaf:includes']
              if(Array.isArray(topic)){
                topic.forEach(topics =>{
                  if(topics){
                    const element2 = createTopics(topics['@id'], topics['name'])
                    const linkStageToTopics = makeLink(element1, element2)
                    linkStageToTopics.labels([{
                      attrs:{
                        text:{
                          text:"Topics"
                        }
                      }
                    }])
                    const OutcomeButton = outcomeButton();
                    const linkToButton = makeLink(element2, OutcomeButton)
                    OutcomeButton.prop('name/first', 'Button')
                    Elements.push([OutcomeButton, linkToButton])
                    checkOutcomes(topics, Elements, OutcomeButton)
                    Elements.push([element2, linkStageToTopics])
                    
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
  for (const key in topic){
      if(key.startsWith('sunyrdaf')){
          if(key == "sunyrdaf:generates"){
              if(Array.isArray(topic[key])){
                  topic[key].forEach(outcomes =>{
                      const out = createOutcomes(outcomes['@id'], outcomes['name'])
                      const linkTopicToOutcome = makeLink(parentNode, out)
                      //out.set('hidden', true)
                      //linkTopicToOutcome.set('hidden',true)
                      linkTopicToOutcome.labels([{
                        attrs:{
                          text:{
                            text:"Outcomes"
                          }
                        }
                      }])
                      arr.push([out])
                      arr.push([linkTopicToOutcome])
                  })
              }
          }
      }
  
  }
  
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







