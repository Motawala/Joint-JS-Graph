
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
        position: {
          x: 250,
          y: 500
        },
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
              size: { width: PORT_WIDTH, height: PORT_HEIGHT },
              position: "absolute"
            },
          },
          items: []
        }
      });
      node.set('hidden', true);
      return node
 }


function createActivities(id, name){
    const node = new joint.shapes.standard.Rectangle({
        id: id,
        position: {
          x: 250,
          y: 500
        },
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
            fill: "#4db366",
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
              size: { width: PORT_WIDTH, height: PORT_HEIGHT },
              position: "absolute"
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
        position: { x:100, y: 50 },
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

 function createConsiderations(id, name){
    const textWidth = name.length * 6; // Approximate width based on font size and average character width
    const width = Math.max(textWidth, 100); // Ensure a minimum width to accommodate shorter text
    const node =  new joint.shapes.standard.Rectangle({
        id: id,
        position: {
          x: 250,
          y: 500
        },
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
            fill: "#6b2e2e",
            cursor: "grab"
          },
        },
      });
      node.set('hidden', true);
      return node
 }



 function createMethods(id, name){

    const textWidth = name.length * 6; // Approximate width based on font size and average character width
    const width = Math.max(textWidth, 100); // Ensure a minimum width to accommodate shorter text
    const node =  new joint.shapes.standard.Rectangle({
        id: id,
        position: {
          x: 250,
          y: 500
        },
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
      });
      node.set('hidden', true);
      return node
 }

 function createOutcomes(id, name){
    const textWidth = name.length * 6; // Approximate width based on font size and average character width
    const width = Math.max(textWidth, 100); // Ensure a minimum width to accommodate shorter text
    const node =  new joint.shapes.standard.Rectangle({
        id: id,
        position: {
          x: 250,
          y: 500
        },
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
            fill: "#d19494",
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
              size: { width: PORT_WIDTH, height: PORT_HEIGHT },
              position: "absolute"
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
                    x: x+20,
                    y: 5
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
        
    return rdafPorts;
    
  }


function considerationButton(){
    const button = new joint.shapes.standard.Rectangle({
        position: { x: 100, y: 100 },
        size: { width: 100, height: 20 },
        attrs: {
            body: { fill: 'Red', stroke: 'black' } // Specify fill and stroke colors
        }
    });
    return button
}
 
function outcomeButton(){
     
}
 


function checkActivities(topic, arr, parentNode){
    for (const key in topic){
      if(key.startsWith('sunyrdaf')){
          if(key == "sunyrdaf:resultsFrom"){
            //If a topic has more than one outcome
              if(Array.isArray(topic[key])){
                  topic[key].forEach(outcomes =>{
                      console.log(outcomes['name'])
                      const out = createActivities(outcomes['@id'], outcomes['name'])
                      const linkTopicToOutcome = makeLink(parentNode, out)
                      setPorts(parentNode, ['Outcomes' ])
                      out.prop('type', 'Activities')
                      linkTopicToOutcome.labels([{
                        attrs:{
                          text:{
                            text:"Activities"
                          }
                        }
                      }])
                      arr.push([out])
                      arr.push([linkTopicToOutcome])
                      //checkActivities(outcomes, arr, out)
                  })
              }// If a topic generates only one outcome
              else{
                if((topic[key])['name'] != undefined){
                  const out = createActivities(topic[key]['@id'], topic[key]['name'])
                  const linkTopicToOutcome = makeLink(parentNode, out)
                  setPorts(parentNode, ['Outcomes' ])
                  out.prop('type', 'Activities')
                  linkTopicToOutcome.labels([{
                    attrs:{
                      text:{
                        text:"Activities"
                      }
                    }
                  }])
                  arr.push([out])
                  arr.push([linkTopicToOutcome])
                }
                else{
                  duplicateFrame.forEach(duplicateNode =>{
                    if(topic[key] == duplicateNode['@id']){
                      const out = createActivities(duplicateNode['@id'], duplicateNode['name'])
                      const linkTopicToOutcome = makeLink(parentNode, out)
                      setPorts(parentNode, ['Outcomes' ])
                      out.prop('type', 'Outcomes')
                      linkTopicToOutcome.labels([{
                        attrs:{
                          text:{
                            text:"Activities"
                          }
                        }
                    }])
                      arr.push([out])
                      arr.push([linkTopicToOutcome])
                    }
                  })
              }
              }
          }
      }if(key == "sunyrdaf:includes"){
        if(Array.isArray(topic[key])){
          topic[key].forEach(outcomes =>{
              if(outcomes['name'] != undefined){
                const out = createConsiderations(outcomes['@id'], outcomes['name'])
                const linkTopicToOutcome = makeLink(parentNode, out)
                setPorts(parentNode, ['Outcomes' ])
                out.prop('type', 'Considerations')
                linkTopicToOutcome.labels([{
                  attrs:{
                    text:{
                      text:"Considerations"
                    }
                  }
                }])
                arr.push([out])
                arr.push([linkTopicToOutcome])
                
              }else{
                duplicateFrame.forEach(duplicateNode =>{
                  if(outcomes == duplicateNode['@id']){
                    const out = createConsiderations(duplicateNode['@id'], duplicateNode['name'])
                    const linkTopicToOutcome = makeLink(parentNode, out)
                    setPorts(parentNode, ['Outcomes' ])
                    out.prop('type', 'Considerations')
                    linkTopicToOutcome.labels([{
                      attrs:{
                        text:{
                          text:"Considerations"
                        }
                      }
                    }])
                    arr.push([out])
                    arr.push([linkTopicToOutcome])
                  }
                })
              }
          })
      }// If a topic generates only one outcome
      else{
        if((topic[key])['name'] != undefined){
          const out = createConsiderations(topic[key]['@id'], topic[key]['name'])
          const linkTopicToOutcome = makeLink(parentNode, out)
          setPorts(parentNode, ['Outcomes' ])
          out.prop('type', 'Considerations')
          linkTopicToOutcome.labels([{
            attrs:{
              text:{
                text:"Considerations"
              }
            }
          }])
          arr.push([out])
          arr.push([linkTopicToOutcome])
        }
        else{
          duplicateFrame.forEach(duplicateNode =>{
            if(topic[key] == duplicateNode['@id']){
              const out = createConsiderations(duplicateNode['@id'], duplicateNode['name'])
              const linkTopicToOutcome = makeLink(parentNode, out)
              setPorts(parentNode, ['Outcomes' ])
              out.prop('type', 'Considerations')
              linkTopicToOutcome.labels([{
                attrs:{
                  text:{
                    text:"Considerations"
                  }
                }
              }])
              arr.push([out])
              arr.push([linkTopicToOutcome])
            }
          })
        } 
      }
    }
  
    }
  }

  

  function checkOutcomes(topic, arr, parentNode){
    for (const key in topic){
        if(key.startsWith('sunyrdaf')){
            if(key == "sunyrdaf:generates"){
              //If a topic has more than one outcome
                if(Array.isArray(topic[key])){
                    topic[key].forEach(outcomes =>{
                        const out = createOutcomes(outcomes['@id'], outcomes['name'])
                        const linkTopicToOutcome = makeLink(parentNode, out)
                        setPorts(out, ['Outcomes' ])
                        out.prop('type', 'Outcomes')
                        linkTopicToOutcome.labels([{
                          attrs:{
                            text:{
                              text:"Outcomes"
                            }
                          }
                        }])
                        arr.push([out])
                        arr.push([linkTopicToOutcome])
                        checkActivities(outcomes, arr, out)
                    })
                }// If a topic generates only one outcome
                else{
                  const out = createOutcomes(topic[key]['@id'], topic[key]['name'])
                  const linkTopicToOutcome = makeLink(parentNode, out)
                  setPorts(parentNode, ['Outcomes'])
                  out.prop('type', 'Outcomes')
                  linkTopicToOutcome.labels([{
                    attrs:{
                      text:{
                        text:"Outcomes"
                      }
                    }
                  }])
                  arr.push([out])
                  arr.push([linkTopicToOutcome])
                }
            }
        }
    
    }
    
  }
  
  
  
  
  
  function checkConsiderstions(topic, arr, parentNode){
    for(const key in topic){
      if(key.startsWith('sunyrdaf')){
        if(key == 'sunyrdaf:includes'){
          if(Array.isArray(topic[key])){
            topic[key].forEach(consideration =>{
              const considerations = createConsiderations(consideration['@id'], consideration['name'])
              const linkTopicToConsideration = makeLink(parentNode, considerations)
              //const port = setPorts(parentNode, ['Outcomes', 'considerations'])
              considerations.prop('type', 'Considerations')
              linkTopicToConsideration.labels([{
                attrs:{
                  text:{
                    text:"Considerations"
                  }
                }
              }])
              arr.push([considerations])
              arr.push([linkTopicToConsideration])
            })
          }else{
            const considerations = createConsiderations(topic['@id'], topic['name'])
            const linkTopicToConsideration = makeLink(parentNode, considerations)
            setPorts(parentNode, ['Considerations' ])
            considerations.prop('type', 'Considerations')
            linkTopicToConsideration.labels([{
              attrs:{
                text:{
                  text:"Considerations"
                }
              }
            }])
            arr.push([considerations])
            arr.push([linkTopicToConsideration])
          }
        }
      }
    }
  }