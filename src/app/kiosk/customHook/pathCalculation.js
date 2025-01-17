// Main function to calculate the shortest path with edges.
export const calculateShortestPathWithEdges = (svgElement) => {
    const nodes = [];  // Array to store the nodes (rectangles and kiosk).
    const pathGroup = svgElement.querySelector("#Path"); // Find the path group in the SVG.
    const kiosk = svgElement.querySelector("#kiosk"); // Find the kiosk node in the SVG.
  
    // Process the path group (all rectangles within the path).
    if (pathGroup) {
        const rects = pathGroup.querySelectorAll("rect"); // Get all rectangles.
        rects.forEach((rect) => {
            const id = rect.id || "No ID";  // Default to "No ID" if no ID is found.
            const x = parseFloat(rect.getAttribute("x")) || 0;  // Get the x-coordinate.
            const y = parseFloat(rect.getAttribute("y")) || 0;  // Get the y-coordinate.
            nodes.push({ id, x, y });  // Add node with ID and coordinates to the nodes array.
        });
    }
  
    // Process the kiosk (the starting point).
    if (kiosk) {
        const id = kiosk.id || "kiosk";  // Default to "kiosk" if no ID is found.
        const x = parseFloat(kiosk.getAttribute("x")) || 0;  // Get the x-coordinate.
        const y = parseFloat(kiosk.getAttribute("y")) || 0;  // Get the y-coordinate.
        nodes.push({ id, x, y });  // Add the kiosk node to the nodes array.
    }
  
    // Find the start node (kiosk) and end node (a specific rectangle).
    const startNode = nodes.find((node) => node.id === "kiosk");
    const endNode = nodes.find((node) => node.id === "Rectangle 73");
  
    // If the start or end node isn't found, log an error and return an empty path.
    if (!startNode || !endNode) {
        console.error("Start or End node not found.");
        return { shortestPath: [], totalDistance: 0 };
    }
  
    // Call the function to calculate the shortest path.
    return calculateShortestPath(nodes, startNode, endNode);
};
  
// Function to calculate the shortest path using Dijkstra's algorithm.
const calculateShortestPath = (nodes, startNode, endNode) => {
    const distances = {};  // Object to store the shortest distance for each node.
    const previous = {};  // Object to store the previous node in the shortest path.
    const unvisited = new Set(nodes.map((node) => node.id)); // Set of unvisited nodes.
  
    // Initialize all distances to infinity and previous nodes to null.
    nodes.forEach((node) => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
    });
  
    // Distance to the start node is 0.
    distances[startNode.id] = 0;
  
    // Main loop of Dijkstra's algorithm.
    while (unvisited.size > 0) {
        // Find the unvisited node with the smallest distance.
        const currentNodeId = [...unvisited].reduce((closest, nodeId) =>
            !closest || distances[nodeId] < distances[closest] ? nodeId : closest
        );
  
        // Stop if we reach the end node or if there's no more nodes to visit.
        if (!currentNodeId || currentNodeId === endNode.id) break;
        unvisited.delete(currentNodeId);
  
        const currentNode = nodes.find((n) => n.id === currentNodeId);  // Get the current node.
        
        // Get the neighbors of the current node (nodes within a certain distance).
        const neighbors = nodes
            .map((node) => ({
                id: node.id,
                distance: getDistance(currentNode, node), // Calculate distance to each neighbor.
            }))
            .filter((neighbor) => neighbor.distance < 12); // Filter neighbors within 12 units of distance.
  
        // Loop through the neighbors and update distances.
        neighbors.forEach((neighbor) => {
            if (!unvisited.has(neighbor.id)) return;  // Skip visited neighbors.
  
            const newDistance = distances[currentNodeId] + neighbor.distance;  // Calculate new distance.
            if (newDistance < distances[neighbor.id]) {  // If new distance is smaller, update.
                distances[neighbor.id] = newDistance;
                previous[neighbor.id] = currentNodeId;  // Set the previous node for backtracking.
            }
        });
    }
  
    // Backtrack from the end node to the start node to get the shortest path.
    const coords = [];
    let traceNodeId = endNode.id;
    let totalDistance = 0;
  
    // Loop to trace the path from end to start using the previous nodes.
    while (traceNodeId) {
        const node = nodes.find((n) => n.id === traceNodeId);  // Get the node from the previous node ID.
        if (node) coords.unshift({ id: node.id, x: node.x, y: node.y, distance: totalDistance });  // Add node to path.
  
        const prevNodeId = previous[traceNodeId];  // Get the previous node ID.
        if (prevNodeId) {
            const prevNode = nodes.find((n) => n.id === prevNodeId);  // Get the previous node.
            if (prevNode) totalDistance += getDistance(prevNode, node);  // Add the distance to the total.
        }
        traceNodeId = previous[traceNodeId];  // Move to the previous node.
    }
  
    // Return the shortest path and total distance.
    return { shortestPath: coords, totalDistance };
};
  
// Function to calculate the Euclidean distance between two nodes.
const getDistance = (nodeA, nodeB) => {
    const dx = nodeA.x - nodeB.x;  // Calculate the difference in x-coordinates.
    const dy = nodeA.y - nodeB.y;  // Calculate the difference in y-coordinates.
    return Math.sqrt(dx * dx + dy * dy);  // Return the Euclidean distance.
};
