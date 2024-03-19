import json

def explore_linked_data(node, visited, parent=None):
    # Check if the node has already been visited
    if node['@id'] in visited:
        return
    visited.add(node['@id'])

    # Print information about the current node and its parent
    print(f"Node ID: {node.get('@id')}")
    print(f"Node Name: {node.get('name')}")
    print(f"Node Type: {node.get('additionalType', 'N/A')}")
    print(f"Node Description: {node.get('description', 'N/A')}")
    if parent:
        print(f"Parent Node ID: {parent.get('@id')}")
    print("")

    # Explore linked data
    if 'sunyrdaf:includes' in node:
        for included_id in node['sunyrdaf:includes']:
            included_node = get_node_by_id(included_id)
            if included_node:
                print("Included Data:")
                explore_linked_data(included_node, visited, node)

    if 'sunyrdaf:extends' in node:
        for extended_id in node['sunyrdaf:extends']:
            extended_node = get_node_by_id(extended_id)
            if extended_node:
                print("Extended Data:")
                explore_linked_data(extended_node, visited, node)

    if 'sunyrdaf:generates' in node:
        for generated_id in node['sunyrdaf:generates']:
            generated_node = get_node_by_id(generated_id)
            if generated_node:
                print("Generated Data:")
                explore_linked_data(generated_node, visited, node)

    if 'sunyrdaf:resultsFrom' in node:
        for result_id in node['sunyrdaf:resultsFrom']:
            result_node = get_node_by_id(result_id)
            if result_node:
                print("Resulting Data:")
                explore_linked_data(result_node, visited, node)

def get_node_by_id(node_id):
    for graph_node in data['@graph']:
        if graph_node['@id'] == node_id:
            return graph_node
    return None

# Load the JSON data
with open('sample.jsonld', 'r') as file:
    data = json.load(file)

# Set to keep track of visited nodes
visited = set()

# Iterate over the graph elements and explore linked data
for node in data['@graph']:
    explore_linked_data(node, visited)
