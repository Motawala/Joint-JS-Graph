// Create a new graph
const graph = new joint.dia.Graph();

// Create a new paper
const paper = new joint.dia.Paper({
    el: document.getElementById("graph-container"),
    model: graph,
    width: 4000,
    height: 2000,
    gridSize: 10,
    drawGrid: true,
    background: {
        color: '#f9f9f9'
    },
    async: true,
    //Viewport function supports collapsing/uncollapsing behaviour on paper
    viewport: function(view) {
        // Return true if model is not hidden
        return !view.model.get('hidden');
    }
});

// Create parent elements
const parent1 = new joint.shapes.standard.Rectangle({
    position: { x: 0, y: 100 },
    size: { width: 150, height: 100 },
    attrs: {
        rect: { fill: '#3498db' },
        text: { text: 'Parent 1', fill: 'white' }
    }
});

const parent2 = new joint.shapes.standard.Rectangle({
    position: { x: 0, y: 210 },
    size: { width: 150, height: 100 },
    attrs: {
        rect: { fill: '#e74c3c' },
        text: { text: 'Parent 2', fill: 'white' }
    }
});

// Create child elements for parent 1
const child1_1 = new joint.shapes.standard.Rectangle({
    position: { x: 200, y: 130 },
    size: { width: 50, height: 30 },
    attrs: {
        rect: { fill: '#27ae60' },
        text: { text: 'Child 1.1', fill: 'white' }
    }
});

const child1_2 = new joint.shapes.standard.Rectangle({
    position: { x: 250, y: 180 },
    size: { width: 50, height: 30 },
    attrs: {
        rect: { fill: '#27ae60' },
        text: { text: 'Child 1.2', fill: 'white' }
    }
});

const child1_3 = new joint.shapes.standard.Rectangle({
    position: { x: 300, y: 230 },
    size: { width: 50, height: 30 },
    attrs: {
        rect: { fill: '#27ae60' },
        text: { text: 'Child 1.3', fill: 'white' }
    }
});

// Create child elements for parent 2
const child2_1 = new joint.shapes.standard.Rectangle({
    position: { x: 370, y: 300 },
    size: { width: 50, height: 30 },
    attrs: {
        rect: { fill: '#f39c12' },
        text: { text: 'Child 2.1', fill: 'white' }
    }
});

const child2_2 = new joint.shapes.standard.Rectangle({
    position: { x: 370, y: 350 },
    size: { width: 50, height: 30 },
    attrs: {
        rect: { fill: '#f39c12' },
        text: { text: 'Child 2.2', fill: 'white' }
    }
});

const child2_3 = new joint.shapes.standard.Rectangle({
    position: { x: 370, y: 400 },
    size: { width: 50, height: 30 },
    attrs: {
        rect: { fill: '#f39c12' },
        text: { text: 'Child 2.3', fill: 'white' }
    }
});

// Add elements to the graph
graph.addCells([parent1, parent2, child1_1, child1_2, child1_3, child2_1, child2_2, child2_3]);

// Create links between parent and child elements
const link1 = new joint.shapes.standard.Link({
    source: { id: parent1.id },
    target: { id: child1_1.id }
});

const link2 = new joint.shapes.standard.Link({
    source: { id: parent1.id },
    target: { id: child1_2.id }
});

const link3 = new joint.shapes.standard.Link({
    source: { id: parent1.id },
    target: { id: child1_3.id }
});

const link4 = new joint.shapes.standard.Link({
    source: { id: parent2.id },
    target: { id: child2_1.id }
});

const link5 = new joint.shapes.standard.Link({
    source: { id: parent2.id },
    target: { id: child2_2.id }
});

const link6 = new joint.shapes.standard.Link({
    source: { id: parent2.id },
    target: { id: child2_3.id }
});

// Add links to the graph
graph.addCells([link1, link2, link3, link4, link5, link6]);
var links = [link1, link2, link3, link4, link5, link6]
links.forEach(link =>{
    link.set('hidden', true)
    link.getTargetElement().set('hidden', true)
})

paper.on("element:pointerclick", function(view, evt) {
    if(view.model.isElement()){
        var shouldHide = view.model.get("collapsed")
        view.model.set('collapsed', !shouldHide);
        const connectedLinks = graph.getConnectedLinks(view.model, {outbound:true})
        connectedLinks.forEach(targetLinks =>{
            const element = targetLinks.getTargetElement();
            element.set('hidden', shouldHide)
            element.set('collapsed', false)
            //Make the links visible
            targetLinks.set('hidden', shouldHide)
            repositionParents();
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
        })
    }
})


function repositionParents() {
    const parent1Children = graph.getNeighbors(parent1);
    const parent2Children = graph.getNeighbors(parent2);
    console.log(parent1Children)
    const parent1Y = 100;
    const parent2Y = 210;

    if (parent1Children.length === 0) {
        parent1.position(parent1.position().x, parent1Y);
    } else {
        parent1.position(parent1.position().x, parent1Y + 350);
    }

    if (parent2Children.length === 0) {
        parent2.position(parent2.position().x, parent2Y);
    } else {
        parent2.position(parent2.position().x, parent2Y - 50);
    }
}

// Listen for changes in child elements visibility
graph.on('change:visibility', function(cell, visibility, opt) {
    if (cell.isElement() && (cell === parent1 || cell === parent2)) {
        console.log("Here")
        repositionParents();
    }
});

// Initially reposition parent elements based on their children visibility