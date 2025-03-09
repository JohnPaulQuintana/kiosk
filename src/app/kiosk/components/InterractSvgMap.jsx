import React, { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";

const InterractSvgMap = ({ onOpen,currentFloor, floorplans, onLoad }) => {
    const baseApiUrl = "http://127.0.0.1:8001/api";
    const svgContainerRef = useRef(null); // Reference to the container that holds the SVG
    const svgRef = useRef(null); // Reference to the SVG itself
    const [zoom, setZoom] = useState(1); // Initial zoom level
    const [pan, setPan] = useState({ x: 0, y: 0 }); // Initial pan position
    const touchStart = useRef({ x: 0, y: 0 }); // For tracking initial touch position
    const initialZoom = useRef(1); // Store the initial zoom level for pinch gesture

    // Load the SVG when floorplans or currentFloor changes
    useEffect(() => {
        const loadSVG = async () => {
            const floorplansLocal = JSON.parse(localStorage.getItem('floorplans'));
            if (!floorplansLocal) {
                console.log("No floorplans provided");
                return;
            }

            const filtered = floorplansLocal.filter(plan => plan.floor === currentFloor);
            console.log(filtered);

            const response = await fetch(baseApiUrl + filtered[0].filepath);
            const svgText = await response.text();
            const svgElement = new DOMParser().parseFromString(svgText, "image/svg+xml").documentElement;

            const svgContainer = svgContainerRef.current;
            if (svgContainer) {
                svgContainer.innerHTML = ''; // Clear any existing content
                svgContainer.appendChild(svgElement); // Append new SVG
                svgRef.current = svgElement; // Assign the new SVG element to the ref

                const gElements = svgElement.querySelectorAll("g");
                let lastSelectedPath = null;

                gElements.forEach((gElement, index) => {
                    if (index !== 0) {
                        gElement.addEventListener("click", (e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            const gId = e.currentTarget.id; // Use e.currentTarget to get the <g> ID
                            console.log("Clicked <g> with id:", gId);

                            if (!gId) return;
                            const removedSpecialChar = gId.replace(/[\u200B\u200C\u200E\u200F\u2028\u2029]/g, "")
                                .normalize("NFKD")
                                .replace(/[a-z]/g, "")
                                .replace(/[^\w\s]/g, "")
                                .replace(/\s+/g, " ")
                                .trim();
                            const targetPathId = removedSpecialChar.toLowerCase().replace(/\s+/g, "_");

                            // Find the <path> inside <g> that has an ID matching targetPathId
                            const targetPath = gElement.querySelector(`path[id="${targetPathId}"]`);

                            if (targetPath) {
                                if (lastSelectedPath) {
                                    lastSelectedPath.setAttribute("fill", lastSelectedPath.dataset.originalFill);
                                    lastSelectedPath.classList.remove("animate-blink"); // Remove animation from previous path
                                }

                                if (!targetPath.dataset.originalFill) {
                                    targetPath.dataset.originalFill = targetPath.getAttribute("fill") || "";
                                }

                                targetPath.setAttribute("fill", "green");
                                // Apply blink animation
                                targetPath.classList.add("animate-blink");

                                lastSelectedPath = targetPath;

                                // open the interract modal
                                onOpen({unit:removedSpecialChar,color: 'green'})
                            } else {
                                console.log(`No matching path found for id "${targetPathId}" inside <g>`);
                            }
                        });
                    }
                });

            }

            if (onLoad) {
                onLoad();
            }
        };

        loadSVG();
    }, [floorplans, currentFloor, onLoad]);

    // Handle pinch to zoom
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            initialZoom.current = zoom; // Store current zoom level when two fingers start touching
        }
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            // Handle pinch-to-zoom
            const distance = Math.sqrt(
                Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) +
                Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)
            );
            const scale = distance / 200; // Adjust pinch sensitivity
            setZoom(initialZoom.current * scale);
        } else if (e.touches.length === 1) {
            // Handle panning (dragging)
            const dx = e.touches[0].clientX - touchStart.current.x;
            const dy = e.touches[0].clientY - touchStart.current.y;
            setPan({ x: pan.x + dx, y: pan.y + dy });
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    };

    const handleTouchEnd = () => {
        if (svgRef.current) {
            svgRef.current.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
        }
    };

    // Apply zoom and pan styles to the SVG
    useEffect(() => {
        if (svgRef.current) {
            svgRef.current.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
        }
    }, [zoom, pan]);

    return (
        <div
            id="svgInterractContainer"
            ref={svgContainerRef}
            className="h-screen w-full flex items-center justify-center border bg-slate-600 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        ></div>
    );
};

export default InterractSvgMap;
