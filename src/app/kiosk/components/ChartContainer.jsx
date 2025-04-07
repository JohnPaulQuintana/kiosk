// import React, { useEffect, useState, useCallback, useRef } from "react";
// import * as echarts from "echarts";
// // import ReactECharts from "echarts-for-react";
// import $ from "jquery";
// import { calculateShortestPathWithEdges } from "../customHook/pathCalculation";
// import SVGLoader from "../components/SVGLoader"; // Import the SVGLoader
// import InformationModal from "./kiosk/popups/Information";
// import { useFetchSVGRects } from "../customHook/useFetchSVGRects";
// import InterractSvgMap from "./InterractSvgMap";
// import InterractModal from "./kiosk/popups/InterractModal";
// const ChartContainer = ({ target, file, data, renderMap }) => {

//   // console.log(renderMap)
//   const [isOpen, setIsOpen] = useState(false);
//   const [infos, setInfos] = useState(null)
//   const handleModalInterractOpen = (data) => {
//     setInfos(data)
//     setIsOpen(true)
//   };
//   const handleModalInterractClose = () => setIsOpen(false);

//   // use the custom hook to fetch the node on the svg file
//   const rects = useFetchSVGRects('/maps/ground_floor.svg')
//   const baseApiFile = "http://127.0.0.1:8001/api";
//   const svgfile = localStorage.getItem('filename')
//   const currentFloor = localStorage.getItem('floor')
//   // console.log(rects)

//   //save the target unit for second floor
//   localStorage.setItem('target', target.door)
//   const [modalData, setModalData] = useState(null); // State to manage modal data
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

//   // console.log(target)
//   const [svgLoaded, setSvgLoaded] = useState(true); // State to track SVG loading
//   const [showInterractMap, setShowInterractMap] = useState(false);

//   // Prevent multiple calls to handleSVGLoad
//   const handleSVGLoad = useCallback(() => {
//     setSvgLoaded(true);
//   }, []);

//   const chartRef = useRef(null);
//   const touchLayerRef = useRef(null);
//   let myChart; // Declare chart instance to use in cleanup
//   useEffect(() => {


//     const initializeChart = async () => {
//       // const svgElement = document.querySelector("#svgContainer svg");
//       // console.log("SVG Element:", svgElement);
//       // Wait until the new SVG is fully loaded into the DOM
//       const waitForSvgLoad = () =>
//         new Promise((resolve) => {
//           const checkSvg = () => {
//             const svgElement = document.querySelector("#svgContainer svg");
//             if (svgElement) {
//               resolve(svgElement);
//             } else {
//               setTimeout(checkSvg, 100); // Retry after 100ms
//             }
//           };
//           checkSvg();
//         });

//       const svgElement = await waitForSvgLoad();
//       // console.log("SVG Element Loaded:", svgElement);


//       if (!svgElement) {
//         console.error("SVG not loaded yet.");
//         return;
//       }

//       const { shortestPath, blockedPaths } = calculateShortestPathWithEdges(svgElement, target.door);
//       console.log(shortestPath)
//       if (!shortestPath || shortestPath.length === 0) {
//         console.error("Shortest path not found.");
//         return;
//       }

//       const dom = document.getElementById("chart-container");
//       // Prevent default touch behavior
//       // chartRef.current.addEventListener(
//       //   'touchstart',
//       //     (e) => e.preventDefault(),
//       //     { passive: false }
//       // );

//       myChart = echarts.init(dom, "", { renderer: "svg" });

//       // const ROOT_PATH = "maps/";
//       $.get(`${baseApiFile}${svgfile}`, (svg) => {
//         // console.log(svg)
//         echarts.registerMap("CustomMap", { svg });

//         const routeCoords = shortestPath.map((item) => [item.x + 2, item.y + 2]);
//         // console.log(routeCoords)
//         const targetCoord = routeCoords[routeCoords.length - 1]; // Get the last coordinate for the target

//         // console.log("Route Coordinates:", routeCoords);

//         // Create series dynamically from blockedPaths


//         const option = {
//           title: { text: "Floorplan Layout", left: "center", bottom: 10 },
//           tooltip: {},
//           geo: {
//             map: "CustomMap",
//             roam: false,
//             center: routeCoords[routeCoords.length - 1],
//             zoom: 10,
//             scaleLimit: {
//               min: 1,
//               max: 10, // Control zooming limits
//             },
//             selectedMode: 'single', // ✅ Enables individual element selection
//             emphasis: { itemStyle: { color: undefined }, label: { show: true } },
//           },
//           series: [
//             {
//               name: "Route",
//               type: "lines",
//               coordinateSystem: "geo",
//               polyline: true,
//               lineStyle: {
//                 color: "#0D832C",
//                 width: 5,
//                 type: "dotted",
//               },
//               effect: {
//                 show: true,
//                 period: 8,
//                 color: "#0D832C",
//                 constantSpeed: 80,
//                 trailLength: 0,
//                 symbolSize: [20, 12],
//                 symbol: "path://M35.5 40.5c0-22.16 17.84-40 40-40s40 17.84 40 40c0 1.6939-.1042 3.3626-.3067 5H35.8067c-.2025-1.6374-.3067-3.3061-.3067-5zm90.9621-2.6663c-.62-1.4856-.9621-3.1182-.9621-4.8337 0-6.925 5.575-12.5 12.5-12.5s12.5 5.575 12.5 12.5a12.685 12.685 0 0 1-.1529 1.9691l.9537.5506-15.6454 27.0986-.1554-.0897V65.5h-28.7285c-7.318 9.1548-18.587 15-31.2715 15s-23.9535-5.8452-31.2715-15H15.5v-2.8059l-.0937.0437-8.8727-19.0274C2.912 41.5258.5 37.5549.5 33c0-6.925 5.575-12.5 12.5-12.5S25.5 26.075 25.5 33c0 .9035-.0949 1.784-.2753 2.6321L29.8262 45.5h92.2098z",
//               },
//               data: [{ coords: routeCoords }],
//             },
//             {
//               name: target.door,
//               type: "scatter", // Use scatter for markers
//               coordinateSystem: "geo", // Specifies that the map uses geographic coordinates (latitude, longitude)
//               symbol: "pin", // Pin is used as the marker symbol
//               symbolSize: 20, // Size of the pin symbol
//               itemStyle: {
//                 color: "#0D832C", // Green color for the target pin
//                 borderColor: "#fff", // White border around the pin
//                 borderWidth: 2, // Width of the border
//                 opacity: 0.8, // Transparency of the marker
//               },
//               label: {
//                 show: true, // Display a label
//                 position: "top", // Position of the label relative to the pin
//                 formatter: `{b}`, // Display the name of the target
//                 fontSize: 12, // Font size for the label
//                 color: "#fff", // Color of the label text
//                 fontWeight: "bold", // Bold font weight on hover
//                 padding: [5, 10, 5, 10], // Padding around the label
//                 backgroundColor: "rgba(0, 0, 0, 0.7)", // Background color of the label with transparency
//                 borderRadius: 5, // Rounded corners of the label background
//               },
//               tooltip: {
//                 show: false, // Enable the tooltip
//                 formatter: `{b}
//                   <div class="flex flex-col items-center">
//                     <span class="text-xs">${target.unit}</span>
//                   </div>`, // Tooltip content with coordinates
//                 backgroundColor: "rgba(0, 0, 0, 0.7)", // Background color of the tooltip
//                 borderColor: "#fff", // Border color of the tooltip
//                 borderWidth: 1, // Border width of the tooltip
//                 padding: [10, 15], // Padding for the tooltip
//                 textStyle: {
//                   color: "#fff", // Color of the text inside the tooltip
//                   fontSize: 14, // Font size for the tooltip text
//                 },
//               },
//               data: [
//                 {
//                   name: target.unit, // Name of the target point
//                   value: targetCoord, // The coordinates [longitude, latitude] of the target destination
//                 },
//               ],
//               emphasis: {
//                 itemStyle: {
//                   // color: "#FF6347", // Color when the target is hovered (use a different color on hover)
//                 },
//                 label: {
//                   show: true, // Show label when the marker is hovered
//                   // color: "#FF6347", // Color of the label when hovered
//                   fontWeight: "bold", // Bold font weight on hover
//                 },
//               },
//             }

//           ],
//         };

//         myChart.setOption(option);

//         // ✅ Add Click Event Listener for SVG elements
//         myChart.on('click', function (params) {
//           // console.log("Clicked Element:", params);

//           if (params.componentType === 'geo') {
//             const clickedElement = params.name || "Unknown Element";

//             // Highlight the clicked element (Optional)
//             myChart.dispatchAction({
//               type: 'highlight',
//               geoIndex: 0, // Index of the geo component
//               name: clickedElement, // Element name
//             });

//             // Example: Open Modal
//             setModalData({ name: clickedElement });
//             setIsModalOpen(true);
//           }
//         });

//         // Event listener for user click on marker
//         myChart.on('click', function (params) {
//           if (params.componentType === 'series' && params.seriesName === target.door) {
//             // console.log(params.seriesName)
//             // Trigger any other action here, such as updating UI or sending data
//             // Set modal data and open modal
//             setModalData(target);
//             setIsModalOpen(true);

//             // alert(`You clicked on ${targetName} at coordinates: (${longitude}, ${latitude})`);
//           }
//         });

//         let startX = 0;
//         let startY = 0;

//         const handleTouchStart = (e) => {
//           const touch = e.touches[0];
//           startX = touch.clientX;
//           startY = touch.clientY;
//         };

//         const handleTouchMove = (e) => {
//           e.preventDefault();
    
//           const touch = e.touches[0];
//           const dx = touch.clientX - startX;
//           const dy = touch.clientY - startY;
    
//           myChart.dispatchAction({
//             type: 'geoRoam',
//             dx,
//             dy,
//           });
    
//           startX = touch.clientX;
//           startY = touch.clientY;
//         };

//         const touchLayer = touchLayerRef.current;
//         touchLayer.addEventListener('touchstart', handleTouchStart);
//         touchLayer.addEventListener('touchmove', handleTouchMove, { passive: false });

//         return () => {
//           touchLayer.removeEventListener('touchstart', handleTouchStart);
//           touchLayer.removeEventListener('touchmove', handleTouchMove);
//           chartInstance.current?.dispose();
//         };
//       });
//     };

//     // Initialize chart only after SVG is loaded and target changes
//     if (svgLoaded) initializeChart();


//     return () => {
//       // Cleanup chart instance to avoid memory leaks
//       if (myChart) myChart.dispose();
//     };
//   }, [svgLoaded, target, svgfile]); // Include `target` as a dependency

//   // handle click event for enable interract

//   const enableInterract = () => {
//     setShowInterractMap(true);
//     setSvgLoaded(false)
//   }
//   return (
//     <div>
//       {/* SVGLoader component */}
//       <SVGLoader filePath={`${svgfile}`} onLoad={handleSVGLoad} />

//       {/* Only render chart container once SVG is loaded */}
//       {showInterractMap  ? (
        
//         <InterractSvgMap key="map" onOpen={handleModalInterractOpen} currentFloor={currentFloor} floorplans={data} />
//       ) : (
//         // <InterractSvgMap currentFloor={currentFloor} floorplans={defaultFloorplans} />
//         <div className="relative" key="chart">
//           <div
//             ref={chartRef}
//             id="chart-container"
//             className="w-full h-screen border bg-slate-600 rounded-md p-2 shadow mt-16 pointer-events-auto touch-none">
//           </div>
//           <div
//               ref={touchLayerRef}
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 background: 'transparent',
//                 zIndex: 10,
//                 touchAction: 'none', // block default browser gestures
//               }}
//             />
//           <div className="absolute bottom-20 right-10 opacity-80 animate-infiniteScale">
//             <button onClick={() => enableInterract()} type="button" className="bg-green-500 p-1 text-xl text-white rounded-md">Enable Interract</button>
//           </div>
//         </div>
//       )}

//       {/* popups */}
//       {/* Modal */}
//       {isModalOpen && (
//         <InformationModal data={target} onClose={() => setIsModalOpen(false)} />
//       )}

//       <InterractModal isOpen={isOpen} infos={infos} onClose={handleModalInterractClose} />
//     </div>
//   );
// };

// export default ChartContainer;


// components/ChartContainer.js
import React, { useState } from "react";
import ChartComponent from "./ChartComponent";
import InformationModal from "./kiosk/popups/Information";

const ChartContainer = ({ target, file, data, renderMap }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [infos, setInfos] = useState(null);

  const handleModalInterractOpen = (data) => {
    setInfos(data);
    setIsOpen(true);
  };

  const handleModalInterractClose = () => setIsOpen(false);

  return (
    <div>
      <ChartComponent
        target={target}
        file={file}
        svgfile={localStorage.getItem("filename")}
        baseApiFile="http://127.0.0.1:8001/api"
      />
      {isOpen && <InformationModal data={target} onClose={handleModalInterractClose} />}
    </div>
  );
};

export default ChartContainer;
