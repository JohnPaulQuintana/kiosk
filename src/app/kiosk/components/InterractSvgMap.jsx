import React, { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";

const InterractSvgMap = ({ onOpen, currentFloor, floorplans,shortestPath,trimmedTarget, onLoad }) => {
  const baseApiUrl = import.meta.env.VITE_API_URL;
  const svgContainerRef = useRef(null); // Reference to the container that holds the SVG
  const svgRef = useRef(null); // Reference to the SVG itself
  const [zoom, setZoom] = useState(0.2); // Initial zoom level
  const [pan, setPan] = useState({ x: 0, y: 0 }); // Initial pan position
  const touchStart = useRef({ x: 0, y: 0 }); // For tracking initial touch position
  const initialZoom = useRef(0.1); // Store the initial zoom level for pinch gesture
    console.log(shortestPath)

  // Walker animation refs
  const walkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isWalking, setIsWalking] = useState(false);
  const walkerSpeed = 6; // pixels per frame (adjust for speed)

  // Create and manage the walker element - UPDATED
  useEffect(() => {
    if (!svgRef.current) return;

    // Only create if doesn't exist and SVG is ready
    if (!walkerRef.current && svgRef.current.querySelector("svg")) {
      const walker = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "image"
      );
      walker.setAttribute("href", "person-walking.png");
      walker.setAttribute("width", "30");
      walker.setAttribute("height", "30");
      walker.setAttribute("class", "walker");
      walker.style.opacity = "0";
      walkerRef.current = walker;
      svgRef.current.querySelector("svg").appendChild(walker);
    }

    // SAFER cleanup function
    return () => {
      if (walkerRef.current?.parentNode) {
        walkerRef.current.parentNode.removeChild(walkerRef.current);
      }
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [svgRef.current]);

  // More robust animation start/stop
  const startWalkerAnimation = () => {
    if (!shortestPath.length || !walkerRef.current || !svgRef.current) {
      console.error("Animation prerequisites not met");
      return;
    }

    setIsWalking(true);
    let currentSegment = 0;
    let progress = 0;

    // Reset animation if already running
    cancelAnimationFrame(animationFrameRef.current);

    const animateWalker = () => {
      // Check if elements still exist
      if (!walkerRef.current || !svgRef.current) {
        setIsWalking(false);
        return;
      }

      if (currentSegment >= shortestPath.length - 1) {
        setIsWalking(false);
        return;
      }

      const startPoint = shortestPath[currentSegment];
      const endPoint = shortestPath[currentSegment + 1];

      const x = startPoint.x + (endPoint.x - startPoint.x) * progress;
      const y = startPoint.y + (endPoint.y - startPoint.y) * progress;

      // Safely update walker
      if (walkerRef.current) {
        walkerRef.current.setAttribute("x", x - 45);
        walkerRef.current.setAttribute("y", y - 45);
        walkerRef.current.setAttribute(
          "transform",
          `rotate(${
            (Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) *
              180) /
            Math.PI + 100
          }, ${x}, ${y})`
        );
        walkerRef.current.style.opacity = "1";
      }

      progress +=
        walkerSpeed /
        Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);

      if (progress >= 1) {
        currentSegment++;
        progress = 0;
      }

      animationFrameRef.current = requestAnimationFrame(animateWalker);
    };

    animateWalker();
  };

  // Load the SVG when floorplans or currentFloor changes
  useEffect(() => {
    const loadSVG = async () => {
      const floorplansLocal = JSON.parse(localStorage.getItem("floorplans"));
      if (!floorplansLocal) {
        console.log("No floorplans provided");
        return;
      }

      const filtered = floorplansLocal.filter(
        (plan) => plan.floor === currentFloor
      );
      console.log(filtered);

      const response = await fetch(baseApiUrl + filtered[0].filepath);
      const svgText = await response.text();
      const svgElement = new DOMParser().parseFromString(
        svgText,
        "image/svg+xml"
      ).documentElement;

      const svgContainer = svgContainerRef.current;
      if (svgContainer) {
        svgContainer.innerHTML = ""; // Clear any existing content
        svgContainer.appendChild(svgElement); // Append new SVG
        svgRef.current = svgElement; // Assign the new SVG element to the ref
        // Force initial zoom
        svgRef.current.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;

        // REINITIALIZE walker after new SVG loads
        if (walkerRef.current && walkerRef.current.parentNode) {
          walkerRef.current.parentNode.removeChild(walkerRef.current);
        }
        walkerRef.current = null;

        // COLOR THE STATIC PATH ELEMENTS - WITH OPACITY
        shortestPath.forEach((item) => {
          const element = svgElement.querySelector(
            `[id="${CSS.escape(item.id)}"]`
          );
          if (!element) return;

          // 1. Save original values if not already saved
          if (!element.dataset.originalFill) {
            element.dataset.originalFill = element.getAttribute("fill") || "";
          }
          if (!element.dataset.originalFillOpacity) {
            element.dataset.originalFillOpacity =
              element.getAttribute("fill-opacity") || "";
          }
          if (!element.dataset.originalOpacity) {
            element.dataset.originalOpacity =
              element.getAttribute("opacity") || "";
          }

          // 2. Apply ALL necessary properties
          element.setAttribute("fill", "green");
          element.setAttribute("opacity", "1");
          element.setAttribute("fill-opacity", "1"); // This is the key missing property

          // 3. Set inline styles as well to override any CSS
          element.style.fill = "green";
          element.style.opacity = "1";
          element.style.fillOpacity = "1";

          // 4. Force a reflow if needed (for stubborn cases)
          void element.offsetHeight;
        });
        console.log(trimmedTarget)
        const tElement = svgElement.querySelector(
            `[id="${CSS.escape(trimmedTarget)}"]`
          );
        console.log(tElement)
        if (!tElement) return;
        tElement.setAttribute("fill", "green");
        
        const gElements = svgElement.querySelectorAll("g");
        let lastSelectedPath = null;

        gElements.forEach((gElement, index) => {
          if (index !== 0) {
            gElement.addEventListener("click", (e) => {
              e.stopPropagation(); // Prevent event bubbling
              const gId = e.currentTarget.id; // Use e.currentTarget to get the <g> ID
              console.log("Clicked <g> with id:", gId);
              localStorage.setItem("target", gId);
              if (!gId) return;
               // Check if the string starts with 'AB1' or 'AB2'
            const startsWithAB = /^AB[12]/.test(gId);
                console.log("Starts with AB:", startsWithAB); // true or false
                let removedSpecialChar = gId
                if (startsWithAB) {
                    // Keep the first part (AB1 or AB2) and process the rest
                    const prefix = gId.slice(0, 4); // 'AB1' or 'AB2'
                    const rest = gId.slice(4);
                    // Clean the rest of the string, preserving hyphens and removing other special characters
                    const cleanedRest = rest
                    .replace(/[\u200B\u200C\u200E\u200F\u2028\u2029]/g, "")
                    .normalize("NFKD")
                    .replace(/[a-z]/g, "")
                    .replace(/[^\w\s-]/g, "") // Allow '-' character
                    .replace(/\s+/g, " ") // Replace multiple spaces with one
                    .trim();

                    removedSpecialChar = `${prefix}${cleanedRest}`; // Combine prefix with cleaned rest

                }else{
                    removedSpecialChar = gId
                .replace(/[\u200B\u200C\u200E\u200F\u2028\u2029]/g, "")
                .normalize("NFKD")
                .replace(/[a-z]/g, "")
                .replace(/[^\w\s]/g, "")
                .replace(/\s+/g, " ")
                .trim();
                }
              

                console.log("Removed special characters:", removedSpecialChar); // e.g. ground_ab1-107_classroom_door1
              const targetPathId = removedSpecialChar
                .toLowerCase()
                .replace(/\s+/g, "_");

                console.log("Target path ID:", targetPathId); // e.g. ground_ab1-107_classroom_door1

                // ground_ab1-107_classroom_door1

              // Find the <path> inside <g> that has an ID matching targetPathId
              const targetPath = gElement.querySelector(
                `path[id="${targetPathId}"]`
              );

              console.log("Target path:", targetPath);

              if (targetPath) {
                if (lastSelectedPath) {
                  lastSelectedPath.setAttribute(
                    "fill",
                    lastSelectedPath.dataset.originalFill
                  );
                //   lastSelectedPath.classList.remove("animate-blink"); // Remove animation from previous path
                }

                if (!targetPath.dataset.originalFill) {
                  targetPath.dataset.originalFill =
                    targetPath.getAttribute("fill") || "";
                }

                targetPath.setAttribute("fill", "green");
                // Apply blink animation
                // targetPath.classList.add("animate-blink");

                lastSelectedPath = targetPath;

                // open the interract modal
                onOpen({ unit: removedSpecialChar, color: "green" });
              } else {
                console.log(
                  `No matching path found for id "${targetPathId}" inside <g>`
                );
              }
            });
          }
        });

        // Start animation only after walker is ready
        requestAnimationFrame(() => {
          if (!walkerRef.current) {
            const walker = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "image"
            );
            // ... walker setup
            walker.setAttribute(
              "href",
              "/walker.png"
            ); // Replace with your image path
            walker.setAttribute("width", "100");
            walker.setAttribute("height", "100");
            walker.setAttribute("class", "walker");
            walker.style.opacity = "0"; // Start hidden
            walkerRef.current = walker;
            svgElement.appendChild(walker);
            walkerRef.current = walker;
          }
          startWalkerAnimation();
        });
      }

      if (onLoad) onLoad();
    };

    loadSVG();
  }, [floorplans, currentFloor, onLoad]);

  // Handle pinch to zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchStart.current.x;
      const dy = e.touches[0].clientY - touchStart.current.y;
      setPan((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
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
      className="relative h-screen w-full flex items-center justify-center border bg-slate-600 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div id="svgInterractContainer" ref={svgContainerRef}></div>

      {/* Zoom Controls */}
      <div className="absolute w-fit p-2 right-0 flex flex-col justify-center bg-black/50 gap-2 z-[9999999] border border-green-500">
        <h1 className="text-green-500 font-bold text-center">Controls</h1>
        <button
          onClick={() => setZoom((prev) => Math.min(prev + 0.1, 3))}
          className="px-3 py-1 bg-white text-black rounded"
        >
          Zoom In
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.1))}
          className="px-3 py-1 bg-white text-black rounded"
        >
          Zoom Out
        </button>

        {/* Add walker control button */}
        <button
          onClick={startWalkerAnimation}
          className={`px-4 py-2 rounded text-white ${
            isWalking ? "bg-red-500" : "bg-green-500"
          }`}
          disabled={isWalking}
        >
          {isWalking ? "Walking..." : "Navigate"}
        </button>
      </div>
    </div>
  );
};

export default InterractSvgMap;
