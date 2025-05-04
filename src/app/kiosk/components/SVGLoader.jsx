import React, { useEffect } from "react";

const SVGLoader = ({ filePath, onLoad }) => {
  let baseApiUrl = import.meta.env.VITE_API_URL;
  // Check if the filename in localStorage is the same as the new filePath
  const storedFileName = localStorage.getItem("filename");
  useEffect(() => {
    const loadSVG = async () => {
      // console.log(filePath)
      // Only run the load process if filePath is valid
      if (!filePath) {
        console.log("No file path provided");
        return;
      }

      
      const currentFilePath = filePath;
      
      // if (storedFileName === currentFilePath) {
      //   console.log("File already save to local and ready to display");
      //   return; // If the SVG is already loaded, skip fetching it again
      // }

      // console.log(currentFilePath);
      localStorage.setItem("filename", currentFilePath);

      // Fetch the new SVG
      const response = await fetch(baseApiUrl + currentFilePath);
      const svgText = await response.text();
      const svgElement = new DOMParser().parseFromString(svgText, "image/svg+xml").documentElement;

      // Clear previous content in svgContainer before appending new SVG
      const svgContainer = document.getElementById("svgContainer");
      if (svgContainer) {
        svgContainer.innerHTML = ''; // Clear any existing SVGs
        svgContainer.appendChild(svgElement); // Append the new SVG
      }

      // // Process the SVG and save formatted IDs to localStorage
      // const gElements = svgElement.querySelectorAll("g");
      // const gIds = Array.from(gElements)
      //   .map((g) => g.getAttribute("id")?.trim())
      //   .filter((id) => {
      //     if (!id) return false;
      //     const isValid = /^[A-Z0-9-]+(?: [A-Z0-9-]+)*$/.test(id);
      //     return isValid;
      //   });

      // const floor = gIds.length > 0 ? gIds[0] : "Unknown Floor";
      // const level = "ground";
      // const formattedIds = gIds.slice(1).map((id) => {
      //   return {
      //     id: level + "_" + id.toLowerCase().replace(/\s+/g, "_") + "_door1",
      //     name: id.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      //     availability: true,
      //     floor: floor,
      //     image: `/resources/1ST_FLOOR/AB1-111_Classroom.jpg`,
      //   };
      // });

      // if (formattedIds.length > 0) {
      //   localStorage.setItem("floor-data", JSON.stringify(formattedIds));
      // }

      // Call the onLoad callback to notify that the SVG is loaded
      if (onLoad) {
        onLoad();
      }
    };

    loadSVG();
  }, [filePath, onLoad]); // Depend on filePath and onLoad to trigger the effect when either changes

  return <div id="svgContainer" style={{ display: "none" }}></div>;
};

export default SVGLoader;
