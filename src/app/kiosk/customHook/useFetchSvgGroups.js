import { useEffect, useState } from "react";

export const useFetchSvgGroups = (filePath) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!filePath) return; // Skip if filePath is null or undefined

    // Ensure the filePath is treated as an absolute URL
    // const absoluteFilePath = filePath.startsWith("http") ? filePath : `http://${filePath}`;


    const fetchSVG = async () => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error("Failed to fetch SVG file.");
        }

        const svgText = await response.text();
        const svgElement = new DOMParser()
          .parseFromString(svgText, "image/svg+xml")
          .documentElement;

        // Extract <g> elements
        const gElements = svgElement.querySelectorAll("g");
        const gIds = Array.from(gElements)
          .map((g) => g.getAttribute("id")?.trim()) // Trim spaces
          .filter((id) => {
            if (!id) return false; // Exclude empty or null IDs
            // Validate IDs (uppercase letters, numbers, hyphens, and spaces allowed)
            return /^[A-Z0-9-]+(?: [A-Z0-9-]+)*$/.test(id);
          });

        // Get the first valid ID and use it as the floor value
        const floor = gIds.length > 0 ? gIds[0] : "Unknown Floor";

        let level = "ground"; // Default value
        switch (floor.toLowerCase()) {
          case "ground floor":
            level = "ground";
            break;
          case "second floor":
            level = "second";
            break;
          case "third floor":
            level = "third";
            break;
          case "fourth floor":
            level = "fourth";
            break;
          default:
            level = "undefined floor";
            break;
        }

        // Process the remaining valid IDs, skipping the first one
        const formattedIds = gIds.slice(1).map((id) => {
          return {
            id: `${level}_${id.toLowerCase().replace(/\s+/g, "_")}_door1`, // Format ID to snake_case
            name: id
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase()), // Format name with capitalization
            availability: true, // Assuming availability is true
            floor: floor, // Use the first valid ID as the floor
            image: "", // Example image path (placeholder)
          };
        });

        if (formattedIds.length > 0) {
          setGroups(formattedIds); // Save to state
        }
      } catch (error) {
        console.error("Error fetching or parsing SVG:", error);
      }
    };

    fetchSVG();
  }, [filePath]);

  return groups; // Return the state
};
