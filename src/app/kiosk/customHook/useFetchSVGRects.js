import { useEffect, useState } from "react";

export const useFetchSVGRects = (filePath) => {
  const [rects, setRects] = useState([]);

  useEffect(() => {
    const fetchSVG = async () => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch SVG: ${response.statusText}`);
        }

        const svgText = await response.text();

        // console.log(svgText)
        // Parse the SVG as XML
        const parser = new DOMParser();
        const svgDocument = parser.parseFromString(svgText, "image/svg+xml");

        // console.log(svgDocument)
        // Manually locate the "Path" group and its <rect> children
        const pathGroup = svgDocument.getElementById("Path");

        if (!pathGroup) {
          console.warn(`No element with ID "Path" found in the SVG.`);
          setRects([]);
          return;
        }

        // Collect all <rect> elements in the "Path" group
        const rectElements = Array.from(pathGroup.getElementsByTagName("rect"));

        // Map the <rect> elements to their attributes
        const rectData = rectElements.map((rect) => ({
          id: rect.getAttribute("id") || "No ID",
          x: parseFloat(rect.getAttribute("x")) || 0,
          y: parseFloat(rect.getAttribute("y")) || 0,
          width: parseFloat(rect.getAttribute("width")) || 0,
          height: parseFloat(rect.getAttribute("height")) || 0,
          fill: rect.getAttribute("fill") || "none",
        }));

        setRects(rectData);
      } catch (error) {
        console.error("Error fetching or parsing SVG:", error);
      }
    };

    fetchSVG();
  }, [filePath]);

  return rects;
};
