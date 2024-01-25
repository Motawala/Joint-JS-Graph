
// Derived from https://www.jointjs.com/demos/optional-ports
const { dia, elementTools, shapes, linkTools, util } = joint;

const paperContainer = document.getElementById("paper-container");

const graph = new dia.Graph({}, { cellNamespace: shapes });
const paper = new dia.Paper({
  model: graph,
  cellViewNamespace: shapes,
  width: "100%",
  height: "100%",
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
      width: 400,
      height: 90
    },
    attrs: {
      root: {
        magnet: false
      },
      body: {
        strokeWidth: 2,
        fill: "#555555",
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




function makeActivityNode(id, name) {
    return new joint.shapes.standard.Rectangle({
      id: id,
      position: {
        x: 250,
        y: 500
      },
      size: {
        width: '400',
        height: 90
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
         }
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
            }
        },
        "@type": "https://data.suny.edu/vocabs/oried/rdaf/suny/Outcome",
        "sunyrdaf:resultsFrom": {
	  "@type":  "https://data.suny.edu/vocabs/oried/rdaf/suny/Activity"
	},
        "sunyrdaf:includes": {
	  "@type": "https://schema.org/Thing"  // for some reason it doesn't expand this to the fully object - need to investigate why
	}
   }))
   .then(frame => {
      // example of pulling a single Outcome and linked Activity from the input data file
      // in reality we want to navigate the entire graph
      outcome = frame['@graph'][0]
      //activities of the outcome
      activity = outcome['sunyrdaf:resultsFrom']
      const el1 = makeOutcomeNode(outcome['@id'],outcome['name']);
      const el2 = makeActivityNode(activity['@id'],activity['name']);
      const l1 = makeLink(el1,el2,"A");
      graph.addCells([el1, el2, l1]);
      setPorts(el1, ['A']);



      //Events that are showed when the user interacts with an element of the page
      paper.on('element:pointerclick', function(view, evt) {
        evt.stopPropagation();
        toggleBranch(view.model);
        
      });
    

      //Function that is used to collapse and uncollapse the child element
      function toggleBranch(child) {
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

    
   })
   .catch(error => {
      console.error('Error:', error);
  });
}




getGraph();