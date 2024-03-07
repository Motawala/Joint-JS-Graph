
var PORT_WIDTH = 90;
const PORT_HEIGHT = 20;
const PORT_GAP = 20;



function makeLink(from,to) {
    const link = new joint.shapes.standard.Link({
       source: { id: from.id},
       target: { id: to.id },
       attr:{
        '.connection': { stroke: 'red', 'stroke-dasharray': '5,5' }
       }
     });
     // see https://resources.jointjs.com/docs/jointjs/v3.7/joint.html#routers
     // I haven't tried the other algorithms but it might be worth experimenting
     // with them all to see which works best
     link.router('manhattan');
     link.connector('jumpover');
     link.set('hidden', true);
      return link
 }


function createStage(id, name){
    const node = new joint.shapes.standard.Rectangle({
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
                  //magnet: "active", //this allows the user to drag an connect ports
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
      //node.set('hidden', true);
      return node
}



function createTopics(id, name){
    const node = new joint.shapes.standard.Rectangle({
        id: id,
        //position: {
        //  x: 250,
        //  y: 500
        //},
        size: {
          width: '250',
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
            fill: "#4d80b3",
            cursor: "grab"
          },
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
                  width: "85",
                  height: "calc(h)",
                  fill: "white",
                  stroke: "#333333",
                  strokeWidth: 2,
                  //magnet: "active", //this allows the user to drag an connect ports
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
              size: { width: PORT_WIDTH, height: PORT_HEIGHT }
              //position: "absolute"
            },
          },
          items: []
        }
      });
      node.set('hidden', true);
      return node
 }

 function createRoles(id, name){

    return new joint.shapes.standard.Rectangle({
        id: id,
        //position: { x:100, y: 50 },
        size: { width: 100, height: 40 },
        attrs: {
            rect: { fill: 'lightblue', stroke: 'blue', 'stroke-width': 2 },
            text: { text: 'Rect', fill: 'black' },
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
        },
        body: {
            strokeWidth: 2,
            fill: "#336699",
            cursor: "grab"
        }
    });
 }

 function considerations(id, name){

    return new joint.shapes.standard.Rectangle({
        id: id,
        //position: { x:100, y: 50 },
        size: { width: 100, height: 40 },
        attrs: {
            rect: { fill: 'lightblue', stroke: 'blue', 'stroke-width': 2 },
            text: { text: 'Rect', fill: 'black' },
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
        },
        body: {
            strokeWidth: 2,
            fill: "#336699",
            cursor: "grab"
        }
    });
 }


 function createMethods(id, name){

    return new joint.shapes.standard.Rectangle({
        id: id,
        //position: { x:100, y: 50 },
        size: { width: 100, height: 40 },
        attrs: {
            rect: { fill: 'lightblue', stroke: 'blue', 'stroke-width': 2 },
            text: { text: 'Rect', fill: 'black' },
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
        },
        body: {
            strokeWidth: 2,
            fill: "#336699",
            cursor: "grab"
        }
    });
 }

 function createOutcomes(id, name){
    const textWidth = name.length * 6; // Approximate width based on font size and average character width
    const width = Math.max(textWidth, 100); // Ensure a minimum width to accommodate shorter text
    const node =  new joint.shapes.standard.Rectangle({
        id: id,
        //position: {
        //  x: 250,
        //  y: 500
        //},
        size: {
          width: width,
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
            fill: "#4d80b3",
            cursor: "grab"
          },
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
                  width: "85",
                  height: "calc(h)",
                  fill: "white",
                  stroke: "#333333",
                  strokeWidth: 2,
                  //magnet: "active", //this allows the user to drag an connect ports
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
              size: { width: PORT_WIDTH, height: PORT_HEIGHT }
              //position: "absolute"
            },
          },
          items: []
        }
      });
      node.set('hidden', true);
      return node
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
          x: "90%",
          y: "50%"
        },
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
