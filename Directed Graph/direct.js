const { dia, elementTools, shapes, linkTools, util } = joint;
// Create a new directed graph
const graph = new dia.Graph({}, { cellNamespace: shapes });

// Create a new paper, which is a wrapper around SVG element
const paper = new dia.Paper({
    el: document.getElementById('graph-container'),
    model: graph,
    width: 10000,
    height: 1000,
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

// Define nodes and links
var rect = new joint.shapes.standard.Rectangle({
    position: { x: 100, y: 50 },
    size: { width: 100, height: 40 },
    attrs: {
        rect: { fill: 'lightblue', stroke: 'blue', 'stroke-width': 2 },
        text: { text: 'Rect', fill: 'black' }
    },
            
});

        
        
var rect2 = new joint.shapes.standard.Rectangle({
    position: { x: 100, y: 50 },
    size: { width: 100, height: 40 },
    attrs: {
        rect: { fill: 'lightblue', stroke: 'blue', 'stroke-width': 2 },
        text: { text: 'Rect', fill: 'black' }
    }
});

var rect3 = new joint.shapes.standard.Rectangle({
    position: { x: 100, y: 50 },
    size: { width: 100, height: 40 },
    attrs: {
        rect: { fill: 'lightblue', stroke: 'blue', 'stroke-width': 2 },
        text: { text: 'Rect', fill: 'black' }
    }
});
       

var rectButton = new joint.shapes.standard.Rectangle({
    position: { x: 100, y: 50 },
    size: { width: 100, height: 15 },
    attrs: {
        rect: { fill: 'lightblue', stroke: 'blue', 'stroke-width': 2 },
        text: { text: 'Rect', fill: 'black' }
    }
});


var circle = new joint.shapes.standard.Circle({
    position: { x: 300, y: 50 },
    size: { width: 100, height: 100 },
    attrs: {
        circle: { fill: 'lightgreen', stroke: 'green', 'stroke-width': 2 },
        text: { text: 'Circle', fill: 'black' }
    }
});

var circle2 = new joint.shapes.standard.Circle({
    position: { x: 300, y: 50 },
    size: { width: 100, height: 100 },
    attrs: {
        circle: { fill: 'lightgreen', stroke: 'green', 'stroke-width': 2 },
        text: { text: 'Circle', fill: 'black' }
    }
});

var link = new joint.shapes.standard.Link({
    source: { id: rect.id },
    target: { id: circle.id },
    attrs: {
        '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
        '.connection': { stroke: 'black', 'stroke-width': 2 }
    }
});
        
var link2 = new joint.shapes.standard.Link({
    source: { id: circle.id },
    target: { id: circle2.id },
    attrs: {
        '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
        '.connection': { stroke: 'black', 'stroke-width': 2 }
    }
});

var link3 = new joint.shapes.standard.Link({
    source: { id: rect.id },
    target: { id: rect2.id},
    attrs: {
        '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
        '.connection': { stroke: 'black', 'stroke-width': 2 }
    }
});


var link4 = new joint.shapes.standard.Link({
    source: { id: rect2.id },
    target: { id: circle.id },
    attrs: {
    '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
                '.connection': { stroke: 'black', 'stroke-width': 2 }
    }
});

var link5 = new joint.shapes.standard.Link({
    source: { id: rect2.id },
    target: { id: rect3.id },
    attrs: {
    '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
                '.connection': { stroke: 'black', 'stroke-width': 2 }
    }
});

        
paper.on('element:pointerclick', function(view, evt) {
    evt.stopPropagation();
    toggleBranch(view.model);
})
        
        

function toggleBranch(child) {
    if(child.isElement()){
        //retrives the value of the collapsed attribute from the root model.
        var shouldHide = child.get('collapsed');
        child.set('collapsed', !shouldHide);
        // Handle links connected to the child, inbound set to false so that the root element does not collapse
        const links = graph.getConnectedLinks(child, { inbound: false, outbound: true });
        //Array of all the links that goes out of the root
        links.forEach(function(link) {
            // Set the 'hidden' attribute for the link
            link.set('hidden', shouldHide);
        });
        //Sets the element to collapse (true or false)
        //Successor Cells collects all the elements that are linked to the current(active) element.
        var successrorCells = graph.getSubgraph([
            ...graph.getSuccessors(child),
        ])
        successrorCells.forEach(function(successor) {
            successor.set('hidden', shouldHide);
            successor.set('collapsed', false);
        });
    }
}
var Element1 = []
Element1.push(rect)
Element1.push(circle)
Element1.push(link)
Element1.push(circle2)
Element1.push(link2)
Element1.push(rect2)
Element1.push(link3)
Element1.push(link4)
Element1.push(rect3)
Element1.push(link5)
graph.addCells([Element1])





function buildTheGraph(){
    var Elements = []
    var Links = []
    fetch('sample.jsonld')
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
      frameArray.forEach(topic =>{
        stage = topic;
        console.log(stage['additionalType'])
        if(stage['additionalType'] == "RdAF Stage"){
            stageElement = createStage(stage['@id'], stage['name'])
            Elements.push(stageElement)
            //graph.addCells([stageElement]);
            
        }
        if(stage['additionalType'] == "RdAF Topic"){
            stageElement2 = makeStage(stage['@id'], stage['name'])
            const link1 = makeLink(stageElement,stageElement2)
            Elements.push(stageElement2)
            Elements.push(link1)
            //graph.addCells([stageElement2, link1]);
        }if(stage['additionalType'] == "RdAF Subtopic"){
            stageElement3 = createStage(stage['@id'], stage['name'])
            const link1 = makeLink(stageElement2,stageElement3)
            Elements.push(stageElement3)
            Elements.push(link1)
        }

        
      });

    
      graph.addCells([Elements])
      //graph.addCells(Elements.concat(Links))
      //console.log(Elements.concat(Links))
      joint.layout.DirectedGraph.layout(graph, {
        setLinkVertices: false, // Optional: Prevent the plugin from setting link vertices
        nodeSep: 50,
        edgeSep: 80,
        rankDir: "LR",
        ranker: 'network-simplex'
    });
   })

   
    
}


function makeLink(from,to) {
    return new joint.shapes.standard.Link({
       source: { id: from.id},
       target: { id: to.id },
       attr:{
        '.connection': { stroke: 'red', 'stroke-dasharray': '5,5' }
       }
     });
 }


 function makeStage(id, name){

    return new joint.shapes.standard.Rectangle({
        id: id,
        position: { x:100, y: 50 },
        size: { width: 100, height: 40 },
        attrs: {
            rect: { fill: 'lightblue', stroke: 'blue', 'stroke-width': 2 },
            text: { text: 'Rect', fill: 'black' }
        },
        label: {
            fontWeight: "bold",
            fontSize: 10,
            fontFamily: "sans-serif",
            fill: "#ffffff",
            stroke: "#333333",
            strokeWidth: 5,
            paintOrder: "stroke",
            text: name,
            cursor: "text"
        }
    });
 }


function createStage(id, name){
    var node = new joint.shapes.standard.Rectangle({
        id: id,
        position: {
            x: 0,
            y: 250
        },
        size: {
            width: 350,
            height: 45
        },
        attrs: {
            root: {
            magnet: false
        },
        body: {
            strokeWidth: 2,
            fill: "#336699",
            cursor: "grab"
        },
        label: {
            fontWeight: "bold",
            fontSize: 10,
            fontFamily: "sans-serif",
            fill: "#ffffff",
            stroke: "#333333",
            strokeWidth: 5,
            paintOrder: "stroke",
            text: name,
            cursor: "text"
        }
        },
    });
    return node;
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


