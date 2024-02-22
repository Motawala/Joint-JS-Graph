/*
    CIRCLE BUTTON 
*/
function radioButton(port, index, name){
    var button  = new joint.elementTools.Button({
      markup: [
        {
          tagName: 'circle',
          attributes: {
            'id': port.id,
            'r': 10,
            'fill': 'white', // Button background color
            'stroke': 'black', // Button border color
            'stroke-width': 2, // Button border width
            'cursor': 'pointer',
          }
        },
        {
          tagName: 'text',
          selector: 'label',
          textContent: name, // Text displayed on the button
          attributes: {
            'fill': 'black', // Text color
            'font-size': '15px',
            'font-family': 'Arial',
            'text-anchor': 'middle',
            'x':-40,
            'y': -20, // Adjust text position
            'cursor': 'pointer',
          }
          },
      ],
      x: 200 + index*100, // Set position based on index
      y: 100 , // Adjust y position based on index
      offset: { x: -8, y: -8 },
      action: function(evt, elementView) {
        radioButtonEvents(elementView, port)
      },
    });
    return button;
}


//Test Case to test circle button
var rect = new joint.shapes.standard.Rectangle({
    position: { x: 275, y: 50 },
    size: { width: 400, height: 40 },
    attrs: {
        body: {
            fill: '#8ECAE6'
        },
    },
    ports: {
        items: [ ],
        selector: 'portBody'
    },
});

  
//This function takes in a list of ports that are to be embeded into the element,
//Make sure the port Ids of the ports are always different
//Creates a set of 3 circle buttons that are required in the Activities
function radioButtonView(portName, element, tools){
  var port1 = createPort(portName[0], 'out');
  var port2 = createPort(portName[1],'out');
  var port3 = createPort(portName[2], 'out');
  
  element.addPort(port1)
  element.addPort(port2)
  element.addPort(port3)
  tools.push(radioButton(port1,0, 'Not Started'))
  tools.push(radioButton(port2, 1, 'In Progress'))
  tools.push(radioButton(port3, 2, "Achieved"))
}

/*
  BUTTONS VIEW: Adds the button to the tools View 
*/
function buttonView(portName, element, portNameList){
  
  var port = createPort(portName, 'out', 'Port 3');
  var considerationPort = createPort("Considerations", "out", "Port 4")
  // Add custom tool buttons for each port
  var tool = [];
  element.addPort(port);
  element.addPort(considerationPort)
  //Create the Button
  if(portName == "Considerations"){
    tool.push(createConsiderationButton(port))
  }if(portName == "Activities"){
    tool.push(createConsiderationButton(considerationPort))
    tool.push(createButton(port))
    //Push the circle buttons to the same list
    tool.push(radioButtonView(portNameList, element, tool))
  }
  if(portName == "Outcomes"){
    tool.push(createButton(port))
  }
  //Add the element to the graph
  graph.addCells(element);
  //Create the tools view
  toolsView = new joint.dia.ToolsView({ tools: tool});
  //Create an element view
  var elementView = element.findView(paper)
  //Embed tthe tools view in to the element view
  elementView.addTools(toolsView);

  
}



/*
    CONSIDERATION BUTTON
*/
function createConsiderationButton(port,pos) {
    var button  = new joint.elementTools.Button({
      markup: [
        {
          tagName: 'rect',
          selector: 'button',
          attributes: {
              'id': port.id,
              'width': 120,
              'height': 20,
              'rx': 10, // Border radius
              'ry': 10, // Border radius
              'fill': '#ffbf80', // Button background color
              'stroke': 'black', // Button border color
              'stroke-width': 2, // Button border width
              'cursor': 'pointer'
          }
        },
          {
            tagName: 'text',
            selector: 'text',
            textContent: port.id, // Text displayed on the button
            attributes: {
              'fill': 'black', // Text color
              'font-size': '15px',
              'font-family': 'Arial',
              'text-anchor': 'middle',
              'x':60,
              'y': 15, // Adjust text position
              'cursor': 'pointer'
          }
        }
      ],
      x: "90%", // Button position X
      y: "70%", // Button position Y
      offset: { x: -8, y: -8 },
      action: function(evt,elementView) {
        //Event Handle for the button.
        toggelButton(this.model, `${port.id}`)
      },
    });
    return button;
}

function createSubTopicButton(port, pos){
  var button  = new joint.elementTools.Button({
    markup: [
      {
        tagName: 'rect',
        selector: 'button',
        attributes: {
            'id': port.id,
            'width': 120,
            'height': 20,
            'rx': 10, // Border radius
            'ry': 10, // Border radius
            'fill': '#ffbf80', // Button background color
            'stroke': 'black', // Button border color
            'stroke-width': 2, // Button border width
            'cursor': 'pointer'
        }
      },
        {
          tagName: 'text',
          selector: 'text',
          textContent: port.id, // Text displayed on the button
          attributes: {
            'fill': 'black', // Text color
            'font-size': '15px',
            'font-family': 'Arial',
            'text-anchor': 'middle',
            'x':60,
            'y': 15, // Adjust text position
            'cursor': 'pointer'
        }
      }
    ],
    x: "90%", // Button position X
    y: "70%", // Button position Y
    offset: { x: -8, y: -8 },
    action: function(evt,elementView) {
      //Event Handle for the button.
      toggelButton(this.model, `${port.id}`)
    },
  });
  return button;
}

/*
    GENERIC BUTTONS
*/
function createButton(port,pos) {
    var button  = new joint.elementTools.Button({
      markup: [
          {
              tagName: 'rect',
              selector: 'button',
              attributes: {
                  'id': port.id,
                  'width': 80,
                  'height': 20,
                  'rx': 10, // Border radius
                  'ry': 10, // Border radius
                  'fill': '#ffffb3', // Button background color
                  'stroke': 'black', // Button border color
                  'stroke-width': 2, // Button border width
                  'cursor': 'pointer'
              }
          },
          {
              tagName: 'text',
              selector: 'text',
              textContent: port.id, // Text displayed on the button
              attributes: {
                'fontweight':'bold',
                  'fill': 'black', // Text color
                  'font-size': '15px',
                  'font-family': 'Arial',
                  'text-anchor': 'middle',
                  'x': 40,
                  'y': 15, // Adjust text position
                  'cursor': 'pointer'
              }
          }
      ],
      x: "90%", // Button position X
      y: "10%", // Button position Y
      action: function(evt, elementView) {
        //alert('View id: ' + this.id + '\n' + 'Model id: ' + this.model);
        //console.log( `Clicked button for port ${port.id}`)
        //toggleBranch(this.model)
        toggelButton(this.model, `${port.id}`)
      },
    });
    return button;
}


  