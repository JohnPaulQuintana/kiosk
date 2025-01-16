import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import $ from "jquery";
import { calculateShortestPathWithEdges } from "../customHook/pathCalculation";
import SVGLoader from "../components/SVGLoader"; // Import the SVGLoader

const ChartContainer = () => {
  const [svgLoaded, setSvgLoaded] = useState(false); // State to track SVG loading

  // This function is triggered once the SVG is loaded
  const handleSVGLoad = () => {
    setSvgLoaded(true); // Set SVG as loaded
  };

  useEffect(() => {
    const initializeChart = async () => {
      const svgElement = document.querySelector("#svgContainer svg");
      console.log("SVG Element:", svgElement); // Log SVG element to check if it's loaded correctly

      if (!svgElement) {
        console.error("SVG not loaded yet.");
        return;
      }

      const { shortestPath } = calculateShortestPathWithEdges(svgElement);

      if (!shortestPath || shortestPath.length === 0) {
        console.error("Shortest path not found.");
        return;
      }

      const dom = document.getElementById("chart-container");
      const myChart = echarts.init(dom, "", { renderer: "svg" });

      const ROOT_PATH = "maps/";
      $.get(`${ROOT_PATH}ground_level.svg`, (svg) => {
        console.log("SVG Data:", svg); // Log to ensure the SVG data is loaded
        echarts.registerMap("CustomMap", { svg });

        const routeCoords = shortestPath.map((item) => [item.x + 5, item.y + 5]);
        console.log("Route Coordinates:", routeCoords);

        const option = {
          title: { text: "Level 1", left: "center", bottom: 10 },
          tooltip: {},
          geo: {
            map: "CustomMap",
            roam: true,
            emphasis: { itemStyle: { color: undefined }, label: { show: false } },
          },
          series: [
            {
              name: "Route",
              type: "lines",
              coordinateSystem: "geo",
              polyline: true,
              lineStyle: {
                color: "#0D832C",
                width: 5,
                type: "dotted",
              },
              effect: {
                show: true,
                period: 8,
                color: "#0D832C",
                constantSpeed: 50,
                trailLength: 0,
                symbolSize: [20, 12],
                symbol:'path://M35.5 40.5c0-22.16 17.84-40 40-40s40 17.84 40 40c0 1.6939-.1042 3.3626-.3067 5H35.8067c-.2025-1.6374-.3067-3.3061-.3067-5zm90.9621-2.6663c-.62-1.4856-.9621-3.1182-.9621-4.8337 0-6.925 5.575-12.5 12.5-12.5s12.5 5.575 12.5 12.5a12.685 12.685 0 0 1-.1529 1.9691l.9537.5506-15.6454 27.0986-.1554-.0897V65.5h-28.7285c-7.318 9.1548-18.587 15-31.2715 15s-23.9535-5.8452-31.2715-15H15.5v-2.8059l-.0937.0437-8.8727-19.0274C2.912 41.5258.5 37.5549.5 33c0-6.925 5.575-12.5 12.5-12.5S25.5 26.075 25.5 33c0 .9035-.0949 1.784-.2753 2.6321L29.8262 45.5h92.2098z'
              },
              data: [{ coords: routeCoords }],
            },
          ],
        };

        console.log("Initializing ECharts...");
        myChart.setOption(option);
        console.log("Chart initialized successfully!");
      });
    };

    // Initialize chart only after SVG has been loaded
    if (svgLoaded) {
      initializeChart();
    }
  }, [svgLoaded]); // Only run when svgLoaded is true

  return (
    <div>
      {/* SVGLoader component */}
      <SVGLoader filePath={"maps/ground_level.svg"} onLoad={handleSVGLoad} />

      {/* Only render chart container once SVG is loaded */}
      {svgLoaded && (
        <div
          id="chart-container"
          style={{ width: "100%", height: "90vh", border: "1px solid #ccc" }}
        />
      )}
    </div>
  );
};

export default ChartContainer;
