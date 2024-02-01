
// Derived from https://www.jointjs.com/demos/optional-ports
const { dia, elementTools, shapes, linkTools, util } = joint;

const paperContainer = document.getElementById("paper-container");

const graph = new dia.Graph({}, { cellNamespace: shapes });
const paper = new dia.Paper({
  model: graph,
  cellViewNamespace: shapes,
  width: "1000%",
  height: "1000%",
  gridSize: 20,
  drawGrid: { name: "mesh" },
  async: true,
  overflow: true,
  sorting: dia.Paper.sorting.APPROX,
  background: { color: "#F3F7F6", overflow: true },
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
      duplicate = frameArray;
      frameArray.forEach(topic =>{
        outcome = topic
        //activities of the outcome
        activity = outcome['sunyrdaf:includes']
        //Builds the root node for the childs
        if(i==0){
          root = buildRoot(outcome, activity);
          i = i+1;
        }
        
      });

      //Events that are showed when the user interacts with an element of the page
      paper.on('element:pointerclick', function(view, evt) {
        evt.stopPropagation();
        let currentTopic;
        const getFrame = frame["@graph"];
        getFrame.forEach(topic =>{
          if(topic['@id'] == view.model['id']){
            currentTopic = topic
          }
        })
        if(currentTopic['@id'] == "https://data.suny.edu/entities/oried/rdaf/nist/E"){
          toggleBranchRoot(view.model);
        }else{
          toggleBranch(view.model, currentTopic);
        }
        
    });
   })
   .catch(error => {
      console.error('Error:', error);
  });
}

var x = 250;
var y = 500;
//Function gets the child Node from the parent Node and links the child to the parent.
function linkChilds(parentNode, childNode){
  if(childNode['name'] != undefined){
      //Linking single childs to its parent
      const el2 = makeActivityNode(childNode['@id'], childNode['name']);
      el2.position(x+30, y+50);
      const l1 = makeLink(parentNode,el2,"A");
      graph.addCells([el2, l1]);
    }else{
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
  



function buildRoot(outcome, activity){
  const parent = makeStageNode(outcome['@id'],outcome['name']);
  const child = makeTopicNode(activity['@id'],activity['name']);
  const l1 = makeLink(parent,child,"A");
  graph.addCells([parent, child, l1]);
  setPorts(parent, ['A']);
  return child;
}


function combineNodes(parentNodeModel, parentNode){
  
  //const sunyrdafValue = Object.keys(childNode).find(key => key.includes("sunyrdaf"));
   
  var j = 0;
    for(const key in parentNode){

      if(key.startsWith('sunyrdaf')){
        linkChilds(parentNodeModel, parentNode[key])
        if(parentNode[key]['name'] != undefined){
         //Creates a single extended node
          linkChilds(parentNodeModel, parentNode[key])
        }else if(Array.isArray(parentNode[key])){
            //If the parent has multiple subtopic and those subtopics have multiple childs
            parentNode[key].forEach(childs =>{
                linkChilds(parentNodeModel,childs);
            })
          }else{
              linkChilds(parentNodeModel,parentNode[key]);
          }
      }
        j++;
      }
     
}






 //Function that is used to collapse and uncollapse the child element
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

function toggleBranchRoot(child) {
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