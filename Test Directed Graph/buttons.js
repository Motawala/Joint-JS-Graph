/*
    CIRCLE BUTTON 
*/
function radioButton(port, index){
    var button  = new joint.elementTools.Button({
      markup: [
        {
          tagName: 'circle',
          attributes: {
            'id': port.id,
            'r': 15,
            'fill': 'white', // Button background color
            'stroke': 'black', // Button border color
            'stroke-width': 2, // Button border width
            'cursor': 'pointer',
          }
        },
        {
          tagName: 'text',
          selector: 'label',
          textContent: port.id, // Text displayed on the button
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
      x: (index) % 2 === 0 ? "60%" : "90%", // Set position based on index
      y: 50 + Math.floor(index / 2) * 100, // Adjust y position based on index
      offset: { x: -8, y: -8 },
      action: function(evt, elementView, buttonView) {
        //Finds the button from the button View
        //Loop over the button view and check for all the buttons
        var circleElements = buttonView.el.querySelectorAll('circle');
        circleElements.forEach(circleElement =>{
          //Still need to wrap around this event because we just need to set one button at a time not all should be selected.
          var fill = circleElement.getAttribute('fill');
          //Change the color of the element when clicked
          if(fill == 'white' && circleElement.id == `${port.id}`){
            circleElement.setAttribute('fill', '#b33c00')
          }else{
            circleElement.setAttribute('fill', 'white')
          }
        })
        // Access the fill attribute of the <circle> element
        
        
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
  // Test case to test the circle buttons on and elements, Changes the color of the button on click,
  //Even is handled in the radioButton itself just for now.
  var port1 = createPort('Not Started', 'out');
  var port2 = createPort('In Progress', 'out');
  // Add custom tool buttons for each port
  var tools = [];
  rect.addPort(port1);
  tools.push(radioButton(port1,0))
  tools.push(radioButton(port2, 1))
  graph.addCells(rect);
  toolsView = new joint.dia.ToolsView({ tools: tools});
  rect.findView(paper).addTools(toolsView);
  

/*
  BUTTONS VIEW: Adds the button to the tools View 
*/
function buttonView(portName, element){
    var port = createPort(portName, 'out', 'Port 3');
      // Add custom tool buttons for each port
      var tool = [];
      element.addPort(port);
      //Create the Button
      if(portName == "Considerations"){
        tool.push(createConsiderationButton(port))
      }else{
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
  