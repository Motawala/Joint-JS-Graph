function toggleBranch(child) {
    if(child.isElement()){
        //retrives the value of the collapsed attribute from the root model.
        var shouldHide = child.get('collapsed');
        child.set('collapsed', !shouldHide);
        const links = openBranch(child, shouldHide)
    }
}

function openBranch(child, shouldHide){
    //Finds the outgoing links to the element the user is interacting with
    const findTarget = graph.getConnectedLinks(child, {outbound:true})
    //Using each link that is connected find the target Elements and play with them
    findTarget.forEach(targetLink =>{
        //elements connected to the child, those in the 1st rank of the graph
        const element = targetLink.getTargetElement()
        element.set('hidden', shouldHide)
        element.set('collapsed', false)
        //Make the links visible
        targetLink.set('hidden', shouldHide)
        if(!element.get('collapsed')){
            console.log(element.get('collapsed'))
            const subElementsLinks = graph.getConnectedLinks(element, {outbound:true})
            subElementsLinks.forEach(miniLinks =>{
                if(!miniLinks.get('collapsed')){
                    const miniElements = miniLinks.getTargetElement();
                    miniElements.set('hidden', shouldHide)
                    miniElements.set('collapse', false)
                    miniLinks.set('hidden', shouldHide)
                }
            })
            
        }
        
    })

}





