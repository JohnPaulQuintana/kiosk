import React, { useState } from "react";
import SVGLoader from "../components/SVGLoader";
import ChartContainer from "../components/ChartContainer";

const Home = () => {
  const [svgLoaded, setSvgLoaded] = useState(false); // Track the loading state of SVG

  const handleSVGLoad = () => {
    setSvgLoaded(true); // Update the state when SVG is loaded
  };

  return (
    <div className="p-4">
      {/* Pass the handleSVGLoad function as the onLoad prop to SVGLoader */}
      <SVGLoader filePath={"maps/ground_level_version2.svg"} onLoad={handleSVGLoad} />
      
      <div className="grid grid-cols-1">
            {/* <div></div> */}
            {/* Pass svgLoaded state to ChartContainer to control when it initializes */}
            <div className="col-span-2">
                {svgLoaded && <ChartContainer />}
            </div>
      </div>
    </div>
  );
};

export default Home;
