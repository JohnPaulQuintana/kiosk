import React, { useEffect } from "react";

const SVGLoader = ({ filePath, onLoad }) => {
  useEffect(() => {
    const loadSVG = async () => {
      const response = await fetch(filePath);
      const svgText = await response.text();
      const svgElement = new DOMParser().parseFromString(svgText, "image/svg+xml").documentElement;


      const gElements = svgElement.querySelectorAll("g");
      const gIds = Array.from(gElements)
        .map((g) => g.getAttribute("id")?.trim()) // Trim spaces
        .filter((id) => {
          if (!id) {
            return false; // Exclude empty or null IDs
          }
          // Validate IDs (uppercase letters, numbers, hyphens, and spaces allowed)
          const isValid = /^[A-Z0-9-]+(?: [A-Z0-9-]+)*$/.test(id);
          // console.log(`Checking ID: '${id}' - Valid: ${isValid}`); // Debugging log
          return isValid;
        });

      // Get the first valid ID and use it as the floor value
      const floor = gIds.length > 0 ? gIds[0] : "Unknown Floor"; // Default to "Unknown Floor" if no valid IDs are found
      const level = "ground"
      // if (floor === "GROUND FLOOR"){

      // }
      // Process the remaining valid IDs, skipping the first one
      const formattedIds = gIds.slice(1).map((id) => {
        return {
          id: level+"_"+id.toLowerCase().replace(/\s+/g, '_')+"_door1", // Format ID to snake_case
          name: id.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()), // Format name with spaces and capitalization
          availability: true, // Assuming availability is true
          floor: floor, // Use the first valid ID as the floor
          image: `/resources/1ST_FLOOR/AB1-111_Classroom.jpg` // Example image path
        };
      });

      if(formattedIds.length > 0) {
        // console.log("Formatted IDs as Objects:", formattedIds);
         // Save formattedIds to localStorage
        localStorage.setItem('floor-data', JSON.stringify(formattedIds));
      }




      // Append the loaded SVG to the container
      document.getElementById("svgContainer").appendChild(svgElement);

      // Call the onLoad callback to notify that the SVG is loaded
      if (onLoad) {
        onLoad();
      }
    };

    loadSVG();
  }, [filePath, onLoad]);

  return <div id="svgContainer" style={{ display: "none" }}></div>;
};

export default SVGLoader;
