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
function buttonView(portName, element, portNameList, parentNode){
  
  var port = createPort(portName, 'out', 'Port 3');
  var considerationPort = createPort("Considerations", "out", "Port 4")
  var subTopicPort = createPort("RDaF Subtopic", 'out', 'Port 5')
  // Add custom tool buttons for each port
  var tool = [];
  element.addPort(port);
  element.addPort(considerationPort)
  element.addPort(subTopicPort)
  //Create the Button
  if(portName == "Considerations"){
    tool.push(createConsiderationButton(port))
  }if(portName == "Activities"){
    tool.push(createConsiderationButton(considerationPort))
    tool.push(createButton(port))
    //Push the circle buttons to the same list
    tool.push(radioButtonView(portNameList, element, tool))
    tool.push(createSubTopicButton(subTopicPort))
  }
  if(portName == "Outcomes"){
    tool.push(createButton(port))
  }
  if(portName == "Definition"){
    tool.push(createDefinitionButton(port))
  }
  createElementView(element, tool)
  
}

function createElementView(element, tool){
  //Add the element to the graph
  graph.addCells(element);
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
            'height': 30,
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
            'font-size': '17px',
            'font-family': 'Arial',
            'text-anchor': 'middle',
            'x':60,
            'y': 15, // Adjust text position
            'cursor': 'pointer'
        }
      }
    ],
    x: "0%", // Button position X
    y: "0%", // Button position Y
    offset: { x: -8, y: -8 },
    action: function(evt,elementView) {
      //Event Handle for the button.
    },
  });
  return button;
}

//In order to see the effect of this function minimize the page to 25% because the subtopic elements are scattered througout the page
//Show the subtopic when the enters the cell view of the subtopic button
paper.on('cell:mouseenter', function(cellView) {
  try {
    //From the element view look for the element tools
    var toolsArray = cellView._toolsView.tools
    toolsArray.forEach(element => {
      if (element.childNodes && element.childNodes.button) {
        if(element.childNodes.button.id == "RDaF Subtopic"){
          const subtopicButton = element.$el[0]
          subtopicButton.addEventListener('mouseenter', function() {
              // Your mouseover event handling code here
            var bbox = cellView.model.getBBox();
            var paperRect1 = paper.localToPaperRect(bbox);
            // Set the position of the element according to the pointer and make it visible
            var testFind = document.getElementById(cellView.model.id)
            testFind.style.left = ((paperRect1.x) + 10) + 'px';
            testFind.style.top = ((paperRect1.y) + 55) + 'px';
            testFind.style.visibility = "visible"
          });
        }if(element.childNodes.button.id == "Definition"){
          var bbox = cellView.model.getBBox();
          var paperRect1 = paper.localToPaperRect(bbox);
          // Set the position of the element according to the pointer and make it visible
          var testFind = document.getElementById(cellView.model.id)
          testFind.style.left = ((paperRect1.x) + 10) + 'px';
          testFind.style.top = ((paperRect1.y) + 55) + 'px';
          testFind.style.visibility = "visible"
          
        }
      }else {
        console.log();
      }
    });
  } catch (error) {
    console.error();
  }
});

//In order to see the effect of this function minimize the page to 25% because the subtopic elements are scattered througout the page
//Hide the subtopic when the mouse pointer leaves the button
paper.on('cell:mouseleave', function(cellView) {
  try {
    //From the element View look for the element tools
    var toolsArray = cellView._toolsView.tools
    toolsArray.forEach(element => {
      if (element.childNodes && element.childNodes.button) {
        //Look for any events on subtopic button
        if(element.childNodes.button.id == "RDaF Subtopic"){
          const subtopicButton = element.$el[0]
          subtopicButton.addEventListener('mouseleave', function() {
            // Set the position of the element according to the pointer and make it visible
            var testFind = document.getElementById(cellView.model.id)
            testFind.style.visibility = "hidden"
          });
        }if(element.childNodes.button.id == "Definition"){
          // Set the position of the element according to the pointer and make it visible
          var testFind = document.getElementById(cellView.model.id)
          testFind.style.visibility = "hidden"
          
        }
      }else {
        console.log();
      }
    });
  } catch (error) {
    console.error();
  }
})




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


function createDefinitionButton(port,pos) {
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
            'fill': 'black', // Button background color
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
            'fill': 'white',
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
      //Event Handler for the button.
    },
  });
  return button;
}


  