var namespace = joint.shapes;
var graph = new joint.dia.Graph({}, { cellNamespace: namespace });
var paper = new joint.dia.Paper({
  el: document.getElementById('diagram'),
  width: 600,
  height: 400,
  model: graph,
});

var rect = new joint.shapes.standard.Rectangle({
    position: { x: 275, y: 50 },
    size: { width: 90, height: 90 },
    attrs: {
        body: {
            fill: '#8ECAE6'
        }
    },
    ports: {
        items: [ ] 
    }
});

function createPort(id,group,label) {
  var port = {
    id: id,
    label: {
      position: {
        name: 'left'
      },
      markup: [{
         tagName: 'text',
            selector: 'label'
        }]
    },
    attrs: {
        portBody: {
            magnet: true,
            width: 16,
            height: 16,
            x: -8,
            y: -8,
            fill:  '#03071E'
        },
        label: {
            text: label
        }
    },
    markup: [{
        tagName: 'rect',
        selector: 'portBody'
    }]
  };
  return port
}
function createButton(port,pos) {
  var button  = new joint.elementTools.Button({
    position: {
      name: 'left'
    },
    markup: [
      {
        tagName: 'circle',
        selector: 'button',
        attributes: {
          'r': 10,
          'fill': '#cc0000',
          'cursor': 'pointer'
        }
      },
      {
        tagName: 'text',
        textContent: port.id,
        selector: 'text',
        attributes: {
          'fill': '#ffffff',
          'font-size': 10,
          'font-family': 'Arial, helvetica, sans-serif',
          'text-anchor': 'middle',
          'pointer-events': 'none',
        }
      }
    ],
    x: '100%',
    y: '100%',
    offset: { x: -8, y: -8 },
    action: function(evt) {
      alert(`Clicked button for port ${port.id}`);
      // You can perform any action you want here
    }
   });
   return button;
}
var port1 = createPort('port1', 'out', 'Port 1');
var port2 = createPort('port2', 'out', 'Port 2');
// Add custom tool buttons for each port
var tools = [];
[port1, port2].forEach(port => {
  rect.addPort(port);
  tools.push(createButton(port))
});
graph.addCells(rect);
toolsView = new joint.dia.ToolsView({ tools: tools});
rect.findView(paper).addTools(toolsView);
