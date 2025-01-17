export const calculateShortestPathWithEdges = (svgElement) => {
    const nodes = [];
    const pathGroup = svgElement.querySelector("#Path");
    const kiosk = svgElement.querySelector("#kiosk");
  
    if (pathGroup) {
      const rects = pathGroup.querySelectorAll("rect");
      rects.forEach((rect) => {
        const id = rect.id || "No ID";
        const x = parseFloat(rect.getAttribute("x")) || 0;
        const y = parseFloat(rect.getAttribute("y")) || 0;
        nodes.push({ id, x, y });
      });
    }
  
    if (kiosk) {
      const id = kiosk.id || "kiosk";
      const x = parseFloat(kiosk.getAttribute("x")) || 0;
      const y = parseFloat(kiosk.getAttribute("y")) || 0;
      nodes.push({ id, x, y });
    }
  
    const startNode = nodes.find((node) => node.id === "kiosk");
    const endNode = nodes.find((node) => node.id === "Rectangle 73");
  
    if (!startNode || !endNode) {
      console.error("Start or End node not found.");
      return { shortestPath: [], totalDistance: 0 };
    }
  
    return calculateShortestPath(nodes, startNode, endNode);
  };
  
  const calculateShortestPath = (nodes, startNode, endNode) => {                     
    const distances = {};
    const previous = {};
    const unvisited = new Set(nodes.map((node) => node.id));
  
    nodes.forEach((node) => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
  
    distances[startNode.id] = 0;
  
    while (unvisited.size > 0) {
      const currentNodeId = [...unvisited].reduce((closest, nodeId) =>
        !closest || distances[nodeId] < distances[closest] ? nodeId : closest
      );
  
      if (!currentNodeId || currentNodeId === endNode.id) break;
      unvisited.delete(currentNodeId);
  
      const currentNode = nodes.find((n) => n.id === currentNodeId);
      const neighbors = nodes
        .map((node) => ({
          id: node.id,
          distance: getDistance(currentNode, node),
        }))
        .filter((neighbor) => neighbor.distance < 14);
  
      neighbors.forEach((neighbor) => {
        if (!unvisited.has(neighbor.id)) return;
  
        const newDistance = distances[currentNodeId] + neighbor.distance;
        if (newDistance < distances[neighbor.id]) {
          distances[neighbor.id] = newDistance;
          previous[neighbor.id] = currentNodeId;
        }
      });
    }
  
    const coords = [];
    let traceNodeId = endNode.id;
    let totalDistance = 0;
  
    while (traceNodeId) {
      const node = nodes.find((n) => n.id === traceNodeId);
      if (node) coords.unshift({ id: node.id, x: node.x, y: node.y, distance: totalDistance });
  
      const prevNodeId = previous[traceNodeId];
      if (prevNodeId) {
        const prevNode = nodes.find((n) => n.id === prevNodeId);
        if (prevNode) totalDistance += getDistance(prevNode, node);
      }
      traceNodeId = previous[traceNodeId];
    }
  
    return { shortestPath: coords, totalDistance };
  };
  
  const getDistance = (nodeA, nodeB) => {
    const dx = nodeA.x - nodeB.x;
    const dy = nodeA.y - nodeB.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  