import { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import $ from "jquery";
import { calculateShortestPathWithEdges } from "../customHook/pathCalculation";

const useChartSetup = (svgfile, target, baseApiFile) => {
  const [svgLoaded, setSvgLoaded] = useState(false);
  const chartRef = useRef(null);
  const touchLayerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [showInterractMap, setShowInterractMap] = useState(false);
  const myChartRef = useRef(null); // Updated to useRef
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let zoomLevel = 1.2; // Default zoom level
  let prevTouchDistance = 0;

  useEffect(() => {
    const initializeChart = async () => {
      // SVG loading logic
      const waitForSvgLoad = () => {
        return new Promise((resolve) => {
          const checkSvg = () => {
            const svgElement = document.querySelector("#svgContainer svg");
            if (svgElement) {
              resolve(svgElement);
            } else {
              setTimeout(checkSvg, 100);
            }
          };
          checkSvg();
        });
      };

      const svgElement = await waitForSvgLoad();
      if (!svgElement) return;

      const { shortestPath, blockedPaths } = calculateShortestPathWithEdges(svgElement, target.door);
      if (!shortestPath || shortestPath.length === 0) return;

      const dom = document.getElementById("chart-container");
      myChartRef.current = echarts.init(dom, "", { renderer: "svg" }); // Assign chart to ref
      const myChart = myChartRef.current;

      $.get(`${baseApiFile}${svgfile}`, (svg) => {
        echarts.registerMap("CustomMap", { svg, useDirty: false, touchEvents: true });
        const routeCoords = shortestPath.map((item) => [item.x + 2, item.y + 2]);
        const targetCoord = routeCoords[routeCoords.length - 1];

        const option = {
          geo: {
            map: "CustomMap",
            roam: true,
            // roam: "move", // Disable default roam functionality
            // center: routeCoords[routeCoords.length - 1],
            zoom: zoomLevel,
          },
          series: [
            {
              name: "Route",
              type: "lines",
              coordinateSystem: "geo",
              polyline: true,
              lineStyle: { color: "#0D832C", width: 5, type: "dotted" },
              effect: {
                show: true,
                period: 8,
                color: "#0D832C",
                constantSpeed: 80,
                trailLength: 0,
                symbolSize: [20, 12],
                symbol: "path://M35.5 40.5c0-22.16 17.84-40 40-40s40 17.84 40 40c0 1.6939-.1042 3.3626-.3067 5H35.8067c-.2025-1.6374-.3067-3.3061-.3067-5zm90.9621-2.6663c-.62-1.4856-.9621-3.1182-.9621-4.8337 0-6.925 5.575-12.5 12.5-12.5s12.5 5.575 12.5 12.5a12.685 12.685 0 0 1-.1529 1.9691l.9537.5506-15.6454 27.0986-.1554-.0897V65.5h-28.7285c-7.318 9.1548-18.587 15-31.2715 15s-23.9535-5.8452-31.2715-15H15.5v-2.8059l-.0937.0437-8.8727-19.0274C2.912 41.5258.5 37.5549.5 33c0-6.925 5.575-12.5 12.5-12.5S25.5 26.075 25.5 33c0 .9035-.0949 1.784-.2753 2.6321L29.8262 45.5h92.2098z",
              },
              data: [{ coords: routeCoords }], // Path data
            },
            {
              name: target.door,
              type: "scatter",
              coordinateSystem: "geo",
              symbol: "pin",
              symbolSize: 20,
              itemStyle: { color: "#0D832C", borderColor: "#fff", borderWidth: 2 },
              label: {
                show: true,
                position: "top",
                formatter: `{b}`,
                fontSize: 12,
                color: "#fff",
              },
              tooltip: { show: false, formatter: `{b}`, backgroundColor: "rgba(0, 0, 0, 0.7)" },
              data: [{ name: target.unit, value: targetCoord }], // Target point data
            },
          ],
        };

        myChart.setOption(option);

        // Handle chart click event
        myChart.on("click", (params) => {
          if (params.componentType === "geo") {
            const clickedElement = params.name || "Unknown Element";
            myChart.dispatchAction({
              type: "highlight",
              geoIndex: 0,
              name: clickedElement,
            });

            setModalData({ name: clickedElement });
            setIsModalOpen(true);
          }
        });
      });

      // Touch Events for dragging
      // const handleTouchStart = (e) => {
      //   e.preventDefault();
      //   if (e.touches.length === 1) {
      //     isDragging = true;
      //     const touch = e.touches[0];
      //     startX = touch.clientX;
      //     startY = touch.clientY;
      //   } else if (e.touches.length === 2) {
      //     prevTouchDistance = getTouchDistance(e.touches);
      //   }
      // };

      // const handleTouchMove = (e) => {
      //   if (isDragging && e.touches.length === 1) {
      //     const touch = e.touches[0];
      //     const dx = touch.clientX - startX;
      //     const dy = touch.clientY - startY;
      //     myChart.dispatchAction({
      //       type: "geoRoam",
      //       dx,
      //       dy,
      //     });
      //     startX = touch.clientX;
      //     startY = touch.clientY;
      //   } else if (e.touches.length === 2) {
      //     const newTouchDistance = getTouchDistance(e.touches);
      //     const scale = newTouchDistance / prevTouchDistance;
      //     zoomLevel *= scale;
      //     myChart.setOption({
      //       geo: { zoom: zoomLevel },
      //     });
      //     prevTouchDistance = newTouchDistance;
      //   }
      // };

      // const handleTouchEnd = (e) => {
      //   if (e.touches.length === 0) {
      //     isDragging = false;
      //   }
      // };

      // Calculate the distance between two touches
      // const getTouchDistance = (touches) => {
      //   const dx = touches[0].clientX - touches[1].clientX;
      //   const dy = touches[0].clientY - touches[1].clientY;
      //   return Math.sqrt(dx * dx + dy * dy);
      // };

      // Add touch event listeners to chart container
      // const chartContainer = document.getElementById("chart-container");
      // chartContainer.addEventListener("touchstart", handleTouchStart, { passive: false });
      // chartContainer.addEventListener("touchmove", handleTouchMove, { passive: false });
      // chartContainer.addEventListener("touchend", handleTouchEnd, { passive: false });
    };

    if (svgLoaded) {
      initializeChart();
    }

    return () => {
      if (myChartRef.current) {
        myChartRef.current.dispose();
        myChartRef.current = null;
      }
    };
  }, [svgLoaded, target]);

  return {
    chartRef,
    touchLayerRef,
    isModalOpen,
    setIsModalOpen,
    modalData,
    setModalData,
    showInterractMap,
    setShowInterractMap,
    svgLoaded,
    setSvgLoaded,
  };
};

export default useChartSetup;
