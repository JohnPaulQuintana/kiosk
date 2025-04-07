// components/ChartComponent.js
import React, { useEffect } from "react";
import useChartSetup from "./useChartSetup";
import SVGLoaderComponent from "./SVGLoaderComponent";
import InterractModal from "./kiosk/popups/InterractModal";

const ChartComponent = ({ target, file, svgfile, baseApiFile }) => {
  const {
    chartRef,
    touchLayerRef,
    isModalOpen,
    setIsModalOpen,
    modalData,
    showInterractMap,
    setShowInterractMap,
    svgLoaded,
    setSvgLoaded,
  } = useChartSetup(svgfile, target, baseApiFile);

  return (
    <div>
      <SVGLoaderComponent filePath={`${svgfile}`} onLoad={() => setSvgLoaded(true)} />
      {showInterractMap ? (
        <div>Interactive Map</div>
      ) : (
        <div className="relative">
          <div
            ref={chartRef}
            id="chart-container"
            className="w-full h-screen border bg-slate-600 rounded-md p-2 shadow mt-16 pointer-events-auto touch-none"
          ></div>
          <div
            ref={touchLayerRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "transparent",
              zIndex: 10,
              touchAction: "none",
            }}
          />
          <button
            onClick={() => setShowInterractMap(true)}
            className="bg-green-500 p-1 text-xl text-white rounded-md absolute bottom-20 right-10 opacity-80 animate-infiniteScale"
          >
            Enable Interract
          </button>
        </div>
      )}
      {isModalOpen && <InterractModal isOpen={isModalOpen} data={modalData} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ChartComponent;
