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
        
    })

}

function closeTheRest(element){
    if(element.get('collapsed')){
        const subElementsLinks = graph.getConnectedLinks(element, {outbound:true})
        subElementsLinks.forEach(miniLinks =>{
            if(!miniLinks.get('collapsed')){
                const miniElements = miniLinks.getTargetElement();
                miniElements.set('hidden', true)
                miniElements.set('collapse', false)
                miniLinks.set('hidden', true)
                closeTheRest(miniElements)
            }
        })
    }
    
}



