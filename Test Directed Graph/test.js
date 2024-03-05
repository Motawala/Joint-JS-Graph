const { dia, elementTools, shapes, linkTools, util } = joint;
// Create a new directed graph
const graph = new dia.Graph({}, { cellNamespace: shapes });

// Create a new paper, which is a wrapper around SVG element
const paper = new dia.Paper({
    el: document.getElementById('graph-container'),
    model: graph,
    width: 10000,
    height: 10000,
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



let Elements = [];

function exploreLinkedData(node, visited, parent) {
    // Check if the node has already been visited
    if (visited.has(node['@id'])) {
        return;
    }
    visited.add(node['@id']);

    // Print information about the current node and its parent
    console.log(`Node ID: ${node['@id']}`);
    console.log(`Node Name: ${node['name']}`);
    console.log(`Node Type: ${node['additionalType'] || 'N/A'}`);
    console.log(`Node Description: ${node['description'] || 'N/A'}`);
    if (parent) {
        //Create the child node, every node has a parent ID tag, look for the parentID in the graph and link the child
        console.log(`Parent Node ID: ${parent['@id']}`);
    }
    console.log("");

    if(node['additionalType'] == "RdAF Stage"){
        const stage = createStage(node['@id'], node['name'])
        graph.addCells(stage)
    }
    // Explore linked data
    if (node['sunyrdaf:includes']) {
        node['sunyrdaf:includes'].forEach(included_id => {
            let includedNode = getNodeById(included_id);
            if (includedNode) {
                console.log("Included Data:");
                const topics = createStage(includedNode['@id'], includedNode['name']);
                const parentNode = findParent(node)
                console.log(parentNode)
                const link = makeLink(parentNode, topics);
                //Elements.push([topics, link])
                graph.addCells([topics, link])
                exploreLinkedData(includedNode, visited, node);
            }
        });
    }

    if (node['sunyrdaf:extends']) {
        node['sunyrdaf:extends'].forEach(extended_id => {
            let extendedNode = getNodeById(extended_id);
            if (extendedNode) {
                console.log("Extended Data:");
                console.log("Included Data:");
                const topics = createStage(extendedNode['@id'], extendedNode['name']);
                const parentNode = findParent(node)
                const link = makeLink(parentNode, topics);
                //Elements.push([topics, link])
                graph.addCells([topics, link])
                exploreLinkedData(extendedNode, visited, node);
            }
        });
    }

    if (node['sunyrdaf:generates']) {
        node['sunyrdaf:generates'].forEach(generated_id => {
            let generatedNode = getNodeById(generated_id);
            if (generatedNode) {
                console.log("Generated Data:");
                console.log("Included Data:");
                const topics = createStage(generatedNode['@id'], generatedNode['name']);
                const parentNode = findParent(node)
                const link = makeLink(parentNode, topics);
                //Elements.push([topics, link])
                graph.addCells([topics, link])
                exploreLinkedData(generatedNode, visited, node);
            }
        });
    }

    if (node['sunyrdaf:resultsFrom']) {
        node['sunyrdaf:resultsFrom'].forEach(result_id => {
            let resultNode = getNodeById(result_id);
            if (resultNode) {
                console.log("Resulting Data:");
                console.log("Included Data:");
                const topics = createStage(resultNode['@id'], resultNode['name']);
                const parentNode = findParent(node)
                const link = makeLink(parentNode, topics);
                //Elements.push([topics, link])
                graph.addCells([topics, link])
                exploreLinkedData(resultNode, visited, node);
            }
        });
    }
}

function getNodeById(nodeId) {
    for (let graphNode of dataG['@graph']) {
        if (graphNode['@id'] == nodeId) {
            return graphNode;
        }
    }
    return null;
}
let dataG;

// Assuming 'data' contains the loaded JSON data
let visited = new Set();

// Assuming 'sample.jsonld' is in the same directory as the HTML file
fetch('graph.jsonld')
    .then(response => response.json())
    .then(data => {
        let visited = new Set();
        dataG = data
        // Iterate over the graph elements and explore linked data
        for (let node of data['@graph']) {
            exploreLinkedData(node, visited);
        }
        console.log(graph)
        doLayout();
    })
    .catch(error => console.error('Error reading JSON file:', error));

function findParent(node){
    let parent
    graph.getElements().forEach(data=> {
        if(data['id'] == node['@id']){
            parent = data;
        }
    })
    return parent
}

function doLayout() {
    // Apply layout using DirectedGraph plugin
    layout = joint.layout.DirectedGraph.layout(graph, {
    // commenting these out had no effect - maybe they are overridden by the router algorithm?
      //      setLinkVertices: false, // Optional: Prevent the plugin from setting link vertices
      //      nodeSep: 50,
       //     edgeSep: 80,
        rankDir: "LR",
        ranker: 'tight-tree',
        resizeClusters: false
    });
    return layout;
}

