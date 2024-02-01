
// Derived from https://www.jointjs.com/demos/optional-ports
const { dia, elementTools, shapes, linkTools, util } = joint;

const paperContainer = document.getElementById("paper-container");

const graph = new dia.Graph({}, { cellNamespace: shapes });
const paper = new dia.Paper({
  model: graph,
  cellViewNamespace: shapes,
  width: "100%",
  height: "100%",
  interactive: { vertexAdd: false, vertexRemove: false },
  smooth: true,
  linkPinning: false, // Example, adjust based on your needs
  gridSize: 20,
  drawGrid: { name: "mesh" },
  async: true,
  sorting: dia.Paper.sorting.APPROX,
  background: { color: "#F3F7F6" },
  defaultLink: () => new shapes.standard.Link(),
  validateConnection: (sv, _sm, tv, _tm) => sv !== tv,
  linkPinning: false,
  defaultAnchor: { name: "perpendicular" },
  async: true,
  //Viewport function supports collapsing/uncollapsing behaviour on paper
    viewport: function(view) {
        // Return true if model is not hidden
        return !view.model.get('hidden');
    }
});



paperContainer.appendChild(paper.el);

const PORT_WIDTH = 30;
const PORT_HEIGHT = 20;
const PORT_GAP = 20;



//Creates the Entities
function makeOutcomeNode(id,name) {
  var node = new joint.shapes.standard.Rectangle({
    id: id,
    position: {
      x: 250,
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
        fill: "lightblue",
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
    ports: {
      groups: {
        rdaf: {
          markup: [
            {
              tagName: "rect",
              selector: "portBody"
            },
            {
              tagName: "text",
              selector: "portLabel"
            }
          ],
          attrs: {
            portBody: {
              x: 0,
              y: -PORT_HEIGHT / 2,
              width: "calc(w)",
              height: "calc(h)",
              fill: "yellow",
              stroke: "#333333",
              strokeWidth: 2,
              magnet: "active",
              cursor: "grab",
            },
            portLabel: {
              x: "calc(0.5*w)",
              textAnchor: "middle",
              textVerticalAnchor: "middle",
              pointerEvents: "none",
              fontWeight: "bold",
              fontSize: 12,
              fontFamily: "sans-serif"
            },
          },
          size: { width: PORT_WIDTH, height: PORT_HEIGHT },
          position: "absolute"
        },
      },
      items: []
    }
  });


  
  return node;
}




function makeActivityNode(id, name) {
    return new joint.shapes.standard.Rectangle({
      id: id,
      position: {
        x: 250,
        y: 500
      },
      size: {
        width: '450',
        height: 45
      },
      attrs: {
        label: {
          fontWeight: "bold",
          fontSize: 10,
          fontFamily: "sans-serif",
          fill: "#ffffff",
          stroke: "#333333",
          strokeWidth: 5,
          paintOrder: "stroke",
          text: name,
         },
         body: {
          strokeWidth: 2,
          fill: "grey",
          cursor: "grab"
        },
      }
    });
}

function makeLink(from,to,port) {
   return new joint.shapes.standard.Link({
      source: { id: from.id, port: port },
      target: { id: to.id }
    });
}



function setPorts(el, ports) {
  let width = 0;
  const rdafPorts = ports.map((port, index) => {
    const x = index * (PORT_WIDTH + PORT_GAP);
    width = x + PORT_WIDTH;
    return {
      id: `${port}`,
      group: "rdaf",
      attrs: {
        portLabel: {
          text: `${port}`,
          
        }
      },
      args: {
        x,
        y: "100%"
      }
    };
  });
  if (rdafPorts.length > 0) {
    width += PORT_GAP;
  }

  width += 2 * PORT_WIDTH;

  el.prop(["ports", "items"], [...rdafPorts], {
    rewrite: true
  });

}

var i=0;

let duplicate;
function getGraph() {
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
      duplicate = frameArray;
      frameArray.forEach(topic =>{
        outcome = topic
        //activities of the outcome
        activity = outcome['sunyrdaf:includes']
        //Builds the root node for the childs
        if(i==0){
          root = buildRoot(outcome, activity);
          i = i+1;
        }else if(outcome['@id'] == "https://data.suny.edu/entities/oried/rdaf/nist/P"){
          root1 = buildRoot(outcome, activity);
        }else if(outcome['@id'] == "https://data.suny.edu/entities/oried/rdaf/nist/GA"){
          root2 = buildRoot(outcome, activity);
        }else if(outcome['@id'] == "https://data.suny.edu/entities/oried/rdaf/nist/PA"){
          //console.log(activity)
          root3 = buildOrphanRoot(outcome);
        }else if(outcome['@id'] == "https://data.suny.edu/entities/oried/rdaf/nist/SUR"){
          root4 = buildOrphanRoot(outcome);
        }else if(outcome['@id'] == "https://data.suny.edu/entities/oried/rdaf/nist/PD"){
          root5 = buildOrphanRoot(outcome);
        }
        
      });

      //Events that are showed when the user interacts with an element of the page
      paper.on('element:pointerclick', function(view, evt) {
        evt.stopPropagation();
        //Stores the current Topic that the user interacts with
        let currentTopic;
        const getFrame = frame["@graph"];
        //Iterate over the frame and check if the clicked frame exists, if does put it inside currentTopic
        getFrame.forEach(topic =>{
          if(topic['@id'] == view.model['id']){
            currentTopic = topic
          }
        })
        
        //If the current Topic is equal to the root that is "Envision", just for now
        toggleBranch(view.model, currentTopic);
        
    });
   })
   .catch(error => {
      console.error('Error:', error);
  });
}


//Function gets the child Node from the parent Node and links the child to the parent.
function linkChilds(parentNode, childNode){
  if(childNode['name'] != undefined){
        //Linking single childs to its parent
        let el2;
        if(childNode['additionalType'] = "RdAf Topic"){
            el2 = makeTopicNode(childNode['@id'], childNode['name']);
            
        }else{
            el2 = makeActivityNode(childNode['@id'], childNode['name']);
        }
        const l1 = makeLink(parentNode,el2,"A");
        console.log(l1)
        graph.addCells([el2, l1]);
    }else{
        //duplicate si an instance of the frame that is used outside the original promise
        duplicate.forEach(orphanNode =>{
            //Condition for linking nodes that don't have childs
            if(childNode == orphanNode['@id']){
            const el2 = makeActivityNode(orphanNode['@id'], orphanNode['name']);
            const l1 = makeLink(parentNode,el2,"A");
            graph.addCells([el2, l1]);
            }
        })
        
    }
    
}
  
//Creates the Orphan root nodes and leaves it on the graph as it is
function buildOrphanRoot(parentNode){
  const parent = makeStageNode(parentNode['@id'],parentNode['name']);
  graph.addCells([parent]);
}

//Function that creates the root nodes and then calls the combineNodes function to create and link its child
function buildRoot(outcome, activity){
  //Creates a node for the stage
  const parent = makeStageNode(outcome['@id'],outcome['name']);
  graph.addCells([parent]);
  setPorts(parent, ['A']);
}


//This function recursively calls the linkChild function to create the links to the
function combineNodes(parentNodeModel, parentNode){
    //Checks if the Node has any child (sunyrdaf:....) and if the childs has any other nodes
    for(const key in parentNode){
        //If sunyrdaf:... Creates the link between the child and the parent
        if(key.startsWith('sunyrdaf')){
            linkChilds(parentNodeModel, parentNode[key]);
            //If the child has a well defined name link it with the parent.
            if(parentNode[key]['name'] != undefined){
            //Creates a single extended node
                linkChilds(parentNodeModel, parentNode[key])
            }else if(Array.isArray(parentNode[key])){
                //Given sunyrdaf link has multiple childs 
                //If the parent has multiple subtopic and those subtopics have multiple childs
                parentNode[key].forEach(childs =>{
                    linkChilds(parentNodeModel,childs);
                })
            }else{
                linkChilds(parentNodeModel,parentNode[key]);
            }
            }
      }
     
}






 //Function that is used to collapse and uncollapse the child element
 //Function also call the create node function wehn clicked on it to creates its child
function toggleBranch(child, currentTopic) {
    const sunyrdafValue = Object.keys(currentTopic).find(key => key.includes("sunyrdaf"));
    if(sunyrdafValue != undefined){
      //currentTopic[sunyrdafValues] are the childs of the currentTopic clicked
      //child is the model of the currentTopic
      //currentTopic is the topic the user is interacting with
      combineNodes(child, currentTopic)
    }
  if(child.isElement()){
    //retrives the value of the collapsed attribute from the root model.
    var shouldHide = !child.get('collapsed');
    //Sets the element to collapse (true or false)
    child.set('collapsed', shouldHide);
    //Successor Cells collects all the elements that are linked to the current(active) element.
    const successrorCells = graph.getSubgraph([
        ...graph.getSuccessors(child),
    ])
    successrorCells.forEach(function(successor) {
        successor.set('hidden', shouldHide);
        successor.set('collapsed', false);
    });
    
  }



  // Handle links connected to the child, inbound set to false so that the root element does not collapse
  const links = graph.getConnectedLinks(child, { inbound: false, outbound: true });
  //Array of all the links that goes out of the root
  links.forEach(function(link) {
      // Set the 'hidden' attribute for the link
      link.set('hidden', shouldHide);            
  });
}





function makeTopicNode(id, name){
  var node = new joint.shapes.standard.Rectangle({
    id: id,
    position: {
      x: 250,
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
        fill: "lightpink",
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
    ports: {
      groups: {
        rdaf: {
          markup: [
            {
              tagName: "rect",
              selector: "portBody"
            },
            {
              tagName: "text",
              selector: "portLabel"
            }
          ],
          attrs: {
            portBody: {
              x: 0,
              y: -PORT_HEIGHT / 2,
              width: "calc(w)",
              height: "calc(h)",
              fill: "red",
              stroke: "#333333",
              strokeWidth: 2,
              magnet: "active",
              cursor: "grab",
            },
            portLabel: {
              x: "calc(0.5*w)",
              textAnchor: "middle",
              textVerticalAnchor: "middle",
              pointerEvents: "none",
              fontWeight: "bold",
              fontSize: 12,
              fontFamily: "sans-serif"
            },
          },
          size: { width: PORT_WIDTH, height: PORT_HEIGHT },
          position: "absolute"
        },
      },
      items: []
    }
  });
  return node;
}


function makeSubTopicNode(id,name){
  return new joint.shapes.standard.Rectangle({
    id: id,
    position: {
      x: 250,
      y: 500
    },
    size: {
      width: '450',
      height: 45
    },
    attrs: {
      label: {
        fontWeight: "bold",
        fontSize: 10,
        fontFamily: "sans-serif",
        fill: "#ffffff",
        stroke: "#333333",
        strokeWidth: 5,
        paintOrder: "stroke",
        text: name,
       },
       body: {
        strokeWidth: 2,
        fill: "#FFCC99",
        cursor: "grab"
      },
    }
  });
}

function makeStageNode(id, name){
  var node = new joint.shapes.standard.Rectangle({
    id: id,
    position: {
      x: 250,
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
    ports: {
      groups: {
        rdaf: {
          markup: [
            {
              tagName: "rect",
              selector: "portBody"
            },
            {
              tagName: "text",
              selector: "portLabel"
            }
          ],
          attrs: {
            portBody: {
              x: 0,
              y: -PORT_HEIGHT / 2,
              width: "calc(w)",
              height: "calc(h)",
              fill: "red",
              stroke: "#333333",
              strokeWidth: 2,
              magnet: "active",
              cursor: "grab",
            },
            portLabel: {
              x: "calc(0.5*w)",
              textAnchor: "middle",
              textVerticalAnchor: "middle",
              pointerEvents: "none",
              fontWeight: "bold",
              fontSize: 12,
              fontFamily: "sans-serif"
            },
          },
          size: { width: PORT_WIDTH, height: PORT_HEIGHT },
          position: "absolute"
        },
      },
      items: []
    }
  });


  
  return node;
}

getGraph();

