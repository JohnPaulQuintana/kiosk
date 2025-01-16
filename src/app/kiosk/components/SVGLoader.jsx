import React, { useEffect } from "react";

const SVGLoader = ({ filePath, onLoad }) => {
  useEffect(() => {
    const loadSVG = async () => {
      const response = await fetch(filePath);
      const svgText = await response.text();
      const svgElement = new DOMParser().parseFromString(svgText, "image/svg+xml").documentElement;

      // Append the loaded SVG to the container
      document.getElementById("svgContainer").appendChild(svgElement);

      // Call the onLoad callback to notify that the SVG is loaded
      if (onLoad) {
        onLoad();
      }
    };

    loadSVG();
  }, [filePath, onLoad]);

  return <div id="svgContainer" style={{display:"none"}}></div>;
};

export default SVGLoader;
