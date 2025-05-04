// Main function to calculate the shortest path with edges.
export const calculateShortestPathWithEdges = (target) => {
    // console.log(target);
    
    // Split the target string to determine the floor (indicator)
    let indicator = target.split('_'); // Split by underscore and take the first part
    // console.log(indicator)
    // Step 2: Check each word if it contains a hyphen, then split by hyphen
    let result = [];
    indicator.forEach(word => {
        if (word.includes('-')) {
            // If the word contains a hyphen, split by hyphen and add all parts to the result
            let parts = word.split('-');
            result.push(...parts); // Spread the parts to avoid nesting
        } else {
            // If the word doesn't contain a hyphen, just add it to the result as is
            result.push(word);
        }
    });
    // console.log(result)
    let process = 0
    let pathGroupSelector = []

    // Define process steps and path groups based on the floor (first, second, third, etc.)
    switch (result[0]) {
        case 'ground':
        case 'first':
            process = 1; // Ground or First maps to 1
            pathGroupSelector.push(["Path"])
            break;
        case 'second':
            process = 2; // Second maps to 2
            pathGroupSelector.push(["Path","Path2"])
            break;
        case 'third':
            process = 3; // Third maps to 3
            pathGroupSelector.push(["Path","Path2","Path3"])
            break;
        default:
            process = 4; // Any other value maps to 4
            pathGroupSelector.push(["Path","Path2","Path3","Path4"])
            break;
    }

    // console.log(pathGroupSelector[0][1])

    // Select the SVG container element
    const svgElement = document.querySelector("#svgContainer svg");

    // Initialize an array to store merged paths
    let mergedPaths = []; 

    // Loop through each path group (depending on the floor or level)
    for (let index = 1; index <= process; index++) {
        
        let nodes = [];  // Array to store the nodes (rectangles and kiosk).
        
        // Select the path group corresponding to the current floor/level
        let pathGroup = svgElement.querySelector(`[id="${pathGroupSelector[0][index-1]}"]`);
        // console.log(`${pathGroupSelector[0][index-1]}`)
        // console.log(pathGroup)
        
        // Select the kiosk (starting point) for this level
        let kiosk = svgElement.querySelector(`${index > 1 ? "#ground_"+result[1]+"_stairs_a_door1" : "#kiosk"}`);
        if(!kiosk){
            kiosk = svgElement.querySelector(`${index > 1 ? "#ground_stairs_"+result[1]+"_a_door1" : "#kiosk"}`);
        }
        // console.log(kiosk)

        // Process the path group (all rectangles within the path).
        if (pathGroup) {
            let rects = pathGroup.querySelectorAll("rect"); // Get all rectangles.
            rects.forEach((rect) => {
                let id = rect.id || "No ID";  // Default to "No ID" if no ID is found.
                let x = parseFloat(rect.getAttribute("x")) || 0;  // Get the x-coordinate.
                let y = parseFloat(rect.getAttribute("y")) || 0;  // Get the y-coordinate.
                nodes.push({ id, x, y });  // Add node with ID and coordinates to the nodes array.
            });
        }

        // Process the kiosk (the starting point).
        if (kiosk) {
            let id = kiosk.id || "kiosk";  // Default to "kiosk" if no ID is found.
            let x = parseFloat(kiosk.getAttribute("x")) || 0;  // Get the x-coordinate.
            let y = parseFloat(kiosk.getAttribute("y")) || 0;  // Get the y-coordinate.
            nodes.push({ id, x, y });  // Add the kiosk node to the nodes array.
        }
        // console.log(nodes);

        // Find the start node (kiosk) and end node (a specific rectangle).
        let startNode = nodes.find((node) => node.id === `${index > 1 ? "ground_"+result[1]+"_stairs_a_door1" : "kiosk"}`);
        if(!startNode){
            startNode = nodes.find((node) => node.id === `${index > 1 ? "ground_stairs_"+result[1]+"_a_door1" : "kiosk"}`);
        }
        // console.log(startNode);
        let endNode = nodes.find((node) => node.id.trim().toLowerCase() === target.trim().toLowerCase());
        if (!endNode) {
            // Fallback if the end node wasn't found by its exact target ID
            // console.log('yes')
            endNode = nodes.find((node) => node.id.trim().toLowerCase() === `ground_${result[1]}_stairs_a_door1`)
            if(!endNode){
                endNode = nodes.find((node) => node.id.trim().toLowerCase() === `ground_stairs_${result[1]}_a_door1`)
            }
        }
        // console.log(endNode, target);

        // If the start or end node isn't found, log an error and return an empty path.
        if (!startNode || !endNode) {
            console.error("Start or End node not found.");
            return { shortestPath: [{
                "id": "kiosk",
                "x": 1998,
                "y": 3789,
                "distance": 198.23828291342596
            }], totalDistance: 0 };
        }

        // Calculate an adaptive threshold based on the distance between nodes
        const distances = nodes.map((node) => {
            return {
                node,
                distance: getDistance(startNode, node)
            };
        });

        // Calculate the average distance between nodes
        const averageDistance = distances.reduce((sum, { distance }) => sum + distance, 0) / distances.length;
        console.log(`Average Distance: ${averageDistance}`);

        // Set threshold as a percentage of the average distance (or adjust as necessary)
        const threshold = Math.max(averageDistance * 100, 100);  // Set threshold to 100% of average distance, or a minimum of 100.
        console.log(`Threshold: ${threshold}`);

        // Call the function to calculate the shortest path.
        let shortestPathResult = calculateShortestPath(nodes, startNode, endNode, threshold);
        console.log(shortestPathResult)

        // Merge the result by adding to the mergedPaths array
        mergedPaths = [...mergedPaths, ...shortestPathResult.shortestPath]; // Assuming shortestPathResult has a 'shortestPath' array.
        console.log(mergedPaths);
        console.log("loopcount" + index);
        
    }
    // Return the merged paths and total distance (currently set to 0)
    return { shortestPath: mergedPaths, totalDistance: 0 }
};


// Function to calculate the shortest path using Dijkstra's algorithm.
const calculateShortestPath = (nodes, startNode, endNode, threshold) => {
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
            .filter((neighbor) => neighbor.distance <= threshold); // Filter neighbors based on threshold.

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
    let blockedPaths = []; // To store the index of 'Rectangle 150'
    let zoneIndex = []
    // Loop to trace the path from end to start using the previous nodes.
    while (traceNodeId) {
        const node = nodes.find((n) => n.id === traceNodeId);  // Get the node from the previous node ID.
        if (node) {
            coords.unshift({ id: node.id, x: node.x, y: node.y, distance: totalDistance })

            // Stop the checking if the current node's ID starts with "Zone"
            // if (node.id.startsWith("ab2_zone")) {
            //     zoneIndex.push([node.x,node.y]); // Get the index in coords
            //     console.log(zoneIndex)
            //     // return { shortestPath: coords, totalDistance, blockedPaths }; // Include the Zone as the final destination
            // }
            // Check if the current node is 'Rectangle 150'
            // if (node.id === "Rectangle 150") {
            //     blockedPath = [node.x, node.y];  // Assign x, y values to blockedPath
            // }
            // Check if the current node's id matches "Blocked_A" to "Blocked_Z"
            if (/^Blocked_[A-Z]$/.test(node.id)) {
                blockedPaths.push([node.x, node.y]);  // Collect blocked path with coordinates
            }




        }
        // Add node to path.

        const prevNodeId = previous[traceNodeId];  // Get the previous node ID.
        if (prevNodeId) {
            const prevNode = nodes.find((n) => n.id === prevNodeId);  // Get the previous node.
            if (prevNode) totalDistance += getDistance(prevNode, node);  // Add the distance to the total.
        }
        traceNodeId = previous[traceNodeId];  // Move to the previous node.
    }

    // console.log(coords)

    // Find the index of the first object where id starts with "ab2_zone"
    // const zIndex = coords.findIndex((obj) => obj.id.startsWith("ab2_zone"));
    // let filteredCoords = []
    // if (zIndex !== -1) {
    //     // Keep all objects up to and including the "Zone" object
    //     filteredCoords = coords.slice(0, zIndex + 1);
    //     // console.log(filteredCoords);
    // } else {
    //     // No object with id starting with "ab2_zone", return the original array
    //     // console.log(coords);
    // }
    // console.log(filteredCoords)
    // Return the shortest path and total distance.
    return { shortestPath: coords, totalDistance };
};

// Function to calculate the Euclidean distance between two nodes.
const getDistance = (nodeA, nodeB) => {
    const dx = (nodeA.x - nodeB.x);  // Calculate the difference in x-coordinates.
    const dy = (nodeA.y - nodeB.y);  // Calculate the difference in y-coordinates.
    return Math.sqrt(dx * dx + dy * dy) - 12;  // Return the Euclidean distance.
};