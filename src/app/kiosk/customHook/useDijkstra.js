import { useState } from "react";

export const useDijkstra = (rows, cols) => {
  const [grid, setGrid] = useState(generateGrid(rows, cols));
  const [path, setPath] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [animatedNodes, setAnimatedNodes] = useState([]); // Track nodes for animation

  // Create initial grid
  function generateGrid(rows, cols) {
    return Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => ({
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        distance: Infinity,
        visited: false,
        previous: null,
      }))
    );
  }

  // Set start or end node
  function handleNodeClick(row, col) {
    setGrid((prevGrid) =>
      prevGrid.map((r, rIndex) =>
        r.map((node, cIndex) => {
          if (rIndex === row && cIndex === col) {
            if (!startNode) {
              setStartNode({ row, col });
              return { ...node, isStart: true, distance: 0 };
            } else if (!endNode) {
              setEndNode({ row, col });
              return { ...node, isEnd: true };
            } else {
              // Toggle wall
              return { ...node, isWall: !node.isWall };
            }
          }
          return node;
        })
      )
    );
  }

  // Run Dijkstra's Algorithm
  function dijkstra() {
    if (!startNode || !endNode) {
      alert("Please set both start and end nodes.");
      return;
    }

    const newGrid = [...grid];
    const start = newGrid[startNode.row][startNode.col];
    const end = newGrid[endNode.row][endNode.col];
    const unvisitedNodes = [];
    const visitedNodes = [];

    // Add all nodes to unvisited list
    newGrid.forEach((row) => row.forEach((node) => unvisitedNodes.push(node)));
    resetPath()
    while (unvisitedNodes.length) {
      // Sort nodes by distance
      unvisitedNodes.sort((a, b) => a.distance - b.distance);

      const closestNode = unvisitedNodes.shift();

      // Skip walls
      if (closestNode.isWall) continue;

      // If distance is Infinity, stop (path not reachable)
      if (closestNode.distance === Infinity) break;

      closestNode.visited = true;
      visitedNodes.push(closestNode);

      // If we reached the end node
      if (closestNode === end) break;

      // Update neighbors
      updateNeighbors(closestNode, newGrid);
    }

    const shortestPath = getShortestPath(end);
    setPath(shortestPath);

    // Trigger animation
    animatePath(shortestPath);

   // Update grid to show the path and adjacent nodes
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((node) => {
          const isPath = shortestPath.some(
            (pathNode) =>
              pathNode.row === node.row && pathNode.col === node.col
          );
          const isAdjacent = shortestPath.some(
            (pathNode) =>
              (pathNode.row === node.row && 
              (pathNode.col === node.col - 1 || pathNode.col === node.col + 1)) || // Horizontal
              (pathNode.col === node.col &&
              (pathNode.row === node.row - 1 || pathNode.row === node.row + 1))    // Vertical
          );
          return {
            ...node,
            isPath,
            isAdjacent: !isPath && isAdjacent, // Only mark as adjacent if not part of the main path
          };
        })
      )
    );
  }

  // Update neighbor nodes
  function updateNeighbors(node, grid) {
    const neighbors = getNeighbors(node, grid);
    neighbors.forEach((neighbor) => {
      if (!neighbor.visited) {
        neighbor.distance = node.distance + 1; // Assume uniform cost
        neighbor.previous = node;
      }
    });
  }

  // Get valid neighbors
  function getNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;

    if (row > 0) neighbors.push(grid[row - 1][col]); // Up
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right

    return neighbors.filter((neighbor) => !neighbor.isWall);
  }

  // Backtrack to find the shortest path
  function getShortestPath(endNode) {
    const path = [];
    let currentNode = endNode;
    while (currentNode) {
      path.unshift(currentNode);
      currentNode = currentNode.previous;
    }
    return path;
  }

  function resetPath() {
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((node) => ({
          ...node,
          isPath: false,
          isAdjacent: false, // Clear adjacent markers
          visited: false,
          distance: Infinity,
          previous: null,
        }))
      )
    );
    setPath([]);
  }
  
  

  // Animate the path
function animatePath(path) {
  let delay = 0;
  path.forEach((node, index) => {
    setTimeout(() => {
      setAnimatedNodes((prevAnimatedNodes) => [
        ...prevAnimatedNodes,
        node, // Add the node to the array
      ]);
    }, delay);
    delay += 200; // Adjust the delay for sequential animations
  });
}

  return { grid, handleNodeClick, dijkstra, path, animatedNodes };
};
