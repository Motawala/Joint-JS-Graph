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
              Elements.push(element1)
              topic = node['sunyrdaf:includes']
              if(Array.isArray(topic)){
                topic.forEach(topics =>{
                  if(topics){
                    const element2 = createTopics(topics['@id'], topics['name'])
                    const linkStageToTopics = makeLink(element1, element2)
                    //element2.set('hidden', true)
                    //linkStageToTopics.set('hidden', true)
                    linkStageToTopics.labels([{
                      attrs:{
                        text:{
                          text:"Topics"
                        }
                      }
                    }])
                    checkOutcomes(topics, Elements, element2)
                    Elements.push([element2, linkStageToTopics])
                    
                  }
                })
              }
              
            }
      });
      graph.addCells(Elements)
      //graph.addCells(Elements.concat(Links))
      joint.layout.DirectedGraph.layout(graph, {
        setLinkVertices: false, // Optional: Prevent the plugin from setting link vertices
        nodeSep: 50,
        edgeSep: 80,
        rankDir: "LR",
        ranker: 'network-simplex'
    });
   })
}


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


buildTheGraph();


// Add nodes and link to the graph
//graph.addCells([rect, circle, link, circle2, link2, rect2, link3, link4, rect3, link5]);
// Apply layout using DirectedGraph plugin
joint.layout.DirectedGraph.layout(graph, {
    setLinkVertices: false, // Optional: Prevent the plugin from setting link vertices
    nodeSep: 50,
    edgeSep: 80,
    rankDir: "LR",
    ranker: 'network-simplex'
});






