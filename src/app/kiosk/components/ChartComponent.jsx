// components/ChartComponent.js
import React, { useEffect, useState } from "react";
import useChartSetup from "./useChartSetup";
import SVGLoaderComponent from "./SVGLoaderComponent";
import InterractModal from "./kiosk/popups/InterractModal";
import InterractSvgMap from "./InterractSvgMap";
const ChartComponent = ({ renderMap,currentFloor,handleModalInterractOpen,data,target, file, svgfile, baseApiFile }) => {
  console.log(data)
  // const [infos, setInfos] = useState(null)
  
  const {
    chartRef,
    isModalOpen,
    setIsModalOpen,
    modalData,
    showInterractMap,
    setShowInterractMap,
    svgLoaded,
    setSvgLoaded,
  } = useChartSetup(svgfile, target, baseApiFile);

  // const handleModalInterractOpen = (data) => {
  //   setInfos(data)
  //   setIsOpen(true)
  // };

  return (
    <div>
      <SVGLoaderComponent filePath={`${svgfile}`} onLoad={() => setSvgLoaded(true)} />
      {showInterractMap ? (
        // <div>Interactive Map</div>
        <InterractSvgMap key="map" onOpen={handleModalInterractOpen} currentFloor={currentFloor} floorplans={data} />
        // <InterractSvgMap onOpen={handleModalInterractOpen} currentFloor={} />
        // <SVGLoaderComponent filePath={`${svgfile}`} onLoad={() => setSvgLoaded(true)} />
      ) : (
        <div className="relative">
          <div
            ref={chartRef}
            id="chart-container"
            className="w-full h-screen border bg-slate-600 rounded-md p-2 shadow mt-16 pointer-events-auto touch-none"
          ></div>
          
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
