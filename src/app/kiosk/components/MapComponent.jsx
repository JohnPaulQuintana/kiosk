import React, { useEffect } from "react";
import { Label, useMap } from "@mappedin/react-sdk";
// import { useMap } from "@mappedin/react-sdk";

const MapComponent = () => {
    const { mapView, mapData } = useMap(); // Access `mapView` and `mapData` from context

     // Get all floors from mapData
     const floors = mapData.getByType("floor");

     // Log each floor's name and level
     floors.forEach((floor) => {
         console.log(`Floor Name: ${floor.name}`);
     });

    // Enable interactivity for spaces
    useEffect(() => {
        if (mapData && mapView) {
            const spaces = mapData.getByType("space"); // Get all spaces from `mapData`

             // Step 2: Find starting and destination spaces
            const startingSpace = spaces.find(
                (space) => space.name === "Back Kitchen" && space.floor.name === "Level 1"
            );
            const destinationSpace = spaces.find(
                (space) => space.name === "Lab" && space.floor.name === "Level 2"
            );

            // Step 3: Ensure the spaces exist
            if (!startingSpace || !destinationSpace) {
                console.error("Starting or destination space not found.");
                return;
            }

            // Step 4: Get directions
            const directions = mapData.getDirectionsMultiDestination(startingSpace, destinationSpace);

            if (!directions) {
                console.error("Unable to calculate directions.");
                return;
            }

            // Step 5: Draw the route
            mapView.Navigation.draw(directions);
            
            console.log("Wayfinding directions:", directions);

            // Show each floor as the path is drawn
            mapView.setFloor(startingSpace.floor); // Show the starting floor
            mapView.setFloor(destinationSpace.floor); // Show the destination floor

            // console.log(spaces)
            spaces.forEach((space) => {
                mapView.updateState(space, {
                    interactive: true, // Enable interactivity
                });
            });
        }
    }, [mapData, mapView]); // Dependency array ensures this runs when `mapData` or `mapView` is available

    // Render labels for spaces
    if (!mapData) return null; // Guard against `mapData` being undefined
    return mapData.getByType("space").map((space, index) => {
        if (!space.center || !space.name) return null; // Ensure valid properties
        return <Label key={index} target={space.center} text={space.name} />;
    });
};

export default MapComponent;
