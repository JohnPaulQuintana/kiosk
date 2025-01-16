import React, { useState, useRef } from "react";
import { useZoom } from "../customHook/useZoom";
import { useDrag } from "../customHook/useDrag";
import { useDijkstra } from "../customHook/useDijkstra";
import GridNode from "./GridNode";

const FloorplanGrid = ({ rows = 100, cols = 100 }) => {
    const [gridSize] = useState(1000); // Base grid size in pixels
    const [dragEnabled, setDragEnabled] = useState(false); // Toggle dragging
    const { grid, handleNodeClick, dijkstra, resetPath, path, animatedNodes } = useDijkstra(rows, cols);

    const gridContainerRef = useRef(null);
    // Zoom logic from `useZoom` hook
    const { scale, zoomIn, zoomOut, resetZoom } = useZoom();

    // Dragging logic from `useDrag` hook
    const { onMouseDown, onMouseMove, onMouseUp } = useDrag(dragEnabled);

    // Handle drag updates for the grid
    const handleDrag = (offset) => {
        if (gridContainerRef.current) {
            gridContainerRef.current.style.transform = `translate(${offset.x}px, ${offset.y}px) scale(${scale})`;
        }
    };

    //get the x and y
    const handleCoordinates = (x, y) => {
        alert(`X:${x}, Y:${y}`)
    }
    return (
        <div className="flex gap-4 space-y-4">
            {/* Zoom Controls */}
            <div className="flex flex-col gap-2 space-x-2">
                <h1 className="text-lg font-bold">Zoomable Grid Surface</h1>
                <button
                    onClick={zoomIn}
                    className="px-4 py-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Zoom In
                </button>
                <button
                    onClick={zoomOut}
                    className="px-4 py-2 font-medium text-white bg-red-500 rounded hover:bg-red-600"
                >
                    Zoom Out
                </button>
                <button
                    onClick={resetZoom}
                    className="px-4 py-2 font-medium text-white bg-gray-500 rounded hover:bg-gray-600"
                >
                    Reset Zoom
                </button>
                <button
                    onClick={() => setDragEnabled((prev) => !prev)}
                    className={`px-4 py-2 font-medium text-white rounded ${dragEnabled ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
                        }`}
                >
                    {dragEnabled ? "Disable Drag" : "Enable Drag"}
                </button>
                <button
                    onClick={dijkstra}
                    className="px-4 py-2 font-medium text-white bg-purple-500 rounded hover:bg-purple-600"
                >
                    Find Path
                </button>
                {/* <button onClick={resetPath} className="btn btn-secondary ml-2">
                    Reset Path
                </button> */}
                <p className="text-sm text-gray-500">
                    Use the buttons above to zoom in or out.
                </p>
            </div>

            {/* Grid Container */}
            <div
                className="overflow-auto border border-gray-300"
                onMouseDown={onMouseDown}
                onMouseMove={(e) => onMouseMove(e, handleDrag)}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp} // Stop dragging if mouse leaves the grid
            >
                {/* Grid with Zoom */}
                <div
                    ref={gridContainerRef}
                    className="grid"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        width: gridSize + "px",
                        height: gridSize + "px",
                        transform: `scale(${scale})`, // Scale the grid
                        transformOrigin: "center", // Set scaling origin
                    }}
                >
                    {grid.map((row, rowIndex) =>
                        row.map((node, colIndex) => (
                            <GridNode
                                key={`${rowIndex}-${colIndex}`}
                                node={node}
                                animatedNodes={animatedNodes || []} // Pass animated nodes here
                                onClick={() => handleNodeClick(rowIndex, colIndex)}
                                className={`${node.isStart ? "bg-green-500" :
                                    node.isEnd ? "bg-red-500" :
                                    node.isWall ? "bg-gray-700" :
                                    node.isPath ? "bg-blue-500" :
                                    "bg-white"
                                    }`}
                            />

                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default FloorplanGrid;
