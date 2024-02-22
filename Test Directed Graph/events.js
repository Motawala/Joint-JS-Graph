function toggleBranch(child) {
    if(child.isElement()){
        //retrives the value of the collapsed attribute from the root model.
        var shouldHide = child.get('collapsed');
        child.set('collapsed', !shouldHide);
        const links = openBranch(child, shouldHide)
    }
}

function openBranch(child, shouldHide){
    // TODO: openBranch should only open the next level of the tree, not the
    // full tree - this might also help with the initial layout

    //Finds the outgoing links to the element the user is interacting with
    const findTarget = graph.getConnectedLinks(child, {outbound:true})
    //Using each link that is connected find the target Elements and play with them
    findTarget.forEach(targetLink =>{
        //elements connected to the child, those in the 1st rank of the graph
        //Target Elements only allow access to the first connected Element of the parent.
        const element = targetLink.getTargetElement()
        element.set('hidden', shouldHide)
        element.set('collapsed', false)
        //Make the links visible
        targetLink.set('hidden', shouldHide)
        if(!element.get('collapsed')){
            //This condition closes all the nodes when the user intereacts with the parentNode
            const subElementsLinks = graph.getConnectedLinks(element, {outbound:true})
            subElementsLinks.forEach(subLinks =>{
                    subLinks.set('hidden', true)
            });

            const successrorCells = graph.getSubgraph([
                ...graph.getSuccessors(element),
            ])
            successrorCells.forEach(function(successor) {
                successor.set('hidden', true);
                successor.set('collapsed', false);
            });
        
        }
        //closeTheRest(element)
	// I don't think I'm calling this correctly, or in the right
	// place but see https://resources.jointjs.com/docs/jointjs/v3.7/joint.html#dia.LinkView.prototype.requestConnectionUpdate
	// in theory it should help with recalculating the routes after
	// things move
	paper.findViewByModel(targetLink).requestConnectionUpdate();
        //What I have implemented below works fine and is a good way to hide when we stop at one point in the tree, but I look into it and see if it helps 
    })

}


/*
    This function takes and element and routes through all of its child element and hides all the elements
*/
function closeTheRest(element){
    //This condition closes all the nodes when the user intereacts with the parentNode
    const subElementsLinks = graph.getConnectedLinks(element, {outbound:true})
    subElementsLinks.forEach(subLinks =>{
            subLinks.set('hidden', true)
    });

    const successrorCells = graph.getSubgraph([
        ...graph.getSuccessors(element),
    ])
    successrorCells.forEach(function(successor) {
        successor.set('hidden', true);
        successor.set('collapsed', false);
    });
    
}


/*
    This function handles the event when a button is clicked. Collapse and hide the child nodes
    for now its just closes the first connected childs but later when we create the child (participants, roles, methods, etc. ) for activities we can use
    the above close the Rest to close the rest of the tree
*/
function toggelButton(node, typeOfPort){
    
    var shouldHide = node.get('collapsed');
    
    node.set('collapsed', !shouldHide);
    if(typeOfPort == "Outcomes"){
        defaultEvent(node, typeOfPort)
        
    }
    if(typeOfPort == "Considerations"){
        
        defaultEvent(node, typeOfPort)
    }
    if(typeOfPort == "Activities"){
        defaultEvent(node, typeOfPort)
    }
    if(typeOfPort == "RDaF Subtopic"){
        
        const OutboundLinks = graph.getConnectedLinks(node, {outbound:true})
        defaultEvent(node, typeOfPort)
    }
}


//This function handles the event for the 3 buttons on the outcomes node
function radioButtonEvents(elementView, port){
    var circleElements = elementView._toolsView.$el[0].querySelectorAll('circle')
    circleElements.forEach(circleElement =>{
    //Still need to wrap around this event because we just need to set one button at a time not all should be selected.
    var fill = circleElement.getAttribute('fill');
    var activityButton = elementView._toolsView.tools[1].$el[0]
    var considerationButton = elementView._toolsView.tools[0].$el[0]
    //Change the color of the element when clicked
    if(circleElement.id == `${port.id}`){
        if(circleElement.id.startsWith('A')){
            //When clicked on Achieved, hide the activity button
            activityButton.style.visibility = "hidden"
            considerationButton.style.visibility = "hidden"
            circleElement.setAttribute('fill', 'Green')
        }
        
        if(circleElement.id.startsWith('P')){
            //When clicked on In Progress button, show the activity button
            activityButton.style.visibility = "visible"
            considerationButton.style.visibility = "visible"
            circleElement.setAttribute('fill', 'Orange')
        }
        if(circleElement.id.startsWith('N')){
            //When clicked on Not Started Button, show the activity button
            activityButton.style.visibility = "visible"
            considerationButton.style.visibility = "visible"
            circleElement.setAttribute('fill', 'Red')
        }
    }else{
        //unhighlights the rest of the elements that the user is not interacting with
        circleElement.setAttribute('fill', 'white')
    }
    })
}


function defaultEvent(node, typeOfPort){
    
    if(node.get('collapsed')){
        const OutboundLinks = graph.getConnectedLinks(node, {outbound:true})
        if(Array.isArray(OutboundLinks)){
            OutboundLinks.forEach(links =>{
                if(links.getTargetElement().prop('name/first') == typeOfPort){
                    if(typeOfPort == "Considerations"){
                        console.log('subbhbf')
                    }
                    links.getTargetElement().set('hidden', false)
                    links.getTargetElement().set('collapsed', true)
                    //Make the links visible
                    links.set('hidden', false)
                    if(typeOfPort == "Outcomes"){
                    //Using the html element (Activity button) instead to hide and show the particular button from the entire ElementView
                        var ActivitiesButton = links.getTargetElement().findView(paper)
                        if(ActivitiesButton.hasTools()){
                            //Query's for the Activity Button on the and hides it
                            Actbutton = ActivitiesButton._toolsView.tools[1].$el[0]
                            ConsiderationButtton = ActivitiesButton._toolsView.tools[0].$el[0]
                            Actbutton.style.visibility = "hidden"
                            ConsiderationButtton.style.visibility = "hidden"
                        }
                    }
                }
            })
        }
    }else{
        const OutboundLinks = graph.getConnectedLinks(node, {outbound:true})
        OutboundLinks.forEach(links =>{
            if(links.getTargetElement().prop('name/first') == typeOfPort){
                links.getTargetElement().set('hidden', true)
                links.getTargetElement().set('collapsed', false)
                //Make the links visible
                links.set('hidden', true)
                closeTheRest(links.getTargetElement())
                if(typeOfPort == "Outcomes"){
                    //Using the html element (Activity button) instead to hide and show the particular button from the entire ElementView
                    var ActivitiesButton = links.getTargetElement().findView(paper)
                    if(ActivitiesButton.hasTools()){
                        //Query's for the Activity Button on the and hides it
                        Actbutton = ActivitiesButton._toolsView.tools[1].$el[0]
                        ConsiderationButtton = ActivitiesButton._toolsView.tools[0].$el[0]
                        Actbutton.style.visibility = "hidden"
                        ConsiderationButtton.style.visibility = "hidden"
                    }
                }
            }
        })
            
    }
}




  