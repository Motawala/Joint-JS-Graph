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
    }else{
        //Implement the function to create the parent node
        console.log(`Node ID: ${node['@id']}`)
    }
    console.log("");

    // Explore linked data
    if (node['sunyrdaf:includes']) {
        node['sunyrdaf:includes'].forEach(included_id => {
            let includedNode = getNodeById(included_id);
            if (includedNode) {
                console.log("Included Data:");
                exploreLinkedData(includedNode, visited, node);
            }
        });
    }

    if (node['sunyrdaf:extends']) {
        node['sunyrdaf:extends'].forEach(extended_id => {
            let extendedNode = getNodeById(extended_id);
            if (extendedNode) {
                console.log("Extended Data:");
                exploreLinkedData(extendedNode, visited, node);
            }
        });
    }

    if (node['sunyrdaf:generates']) {
        node['sunyrdaf:generates'].forEach(generated_id => {
            let generatedNode = getNodeById(generated_id);
            if (generatedNode) {
                console.log("Generated Data:");
                exploreLinkedData(generatedNode, visited, node);
            }
        });
    }

    if (node['sunyrdaf:resultsFrom']) {
        node['sunyrdaf:resultsFrom'].forEach(result_id => {
            let resultNode = getNodeById(result_id);
            if (resultNode) {
                console.log("Resulting Data:");
                exploreLinkedData(resultNode, visited, node);
            }
        });
    }
}

function getNodeById(nodeId) {
    console.log(nodeId)
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
    })
    .catch(error => console.error('Error reading JSON file:', error));



