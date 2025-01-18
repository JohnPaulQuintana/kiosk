import React, { useState } from "react";
import SVGLoader from "../components/SVGLoader";
import ChartContainer from "../components/ChartContainer";
import MainSection from "../components/kiosk/Main";
// import Footer from "../components/kiosk/footer";
import HeaderSection from "../components/kiosk/HeaderSection";

const HomePage = () => {
  const [svgLoaded, setSvgLoaded] = useState(false); // Track the loading state of SVG

  const handleSVGLoad = () => {
    setSvgLoaded(true); // Update the state when SVG is loaded
  };

  return (
    <div className="wider:w-[1920px] h-screen relative">
      {/* header */}
      <HeaderSection />

      {/* body */}
      <MainSection />

      {/* <Footer /> */}
      {/* Pass the handleSVGLoad function as the onLoad prop to SVGLoader */}
      <SVGLoader filePath={"maps/ground_level.svg"} onLoad={handleSVGLoad} />
    </div>
  );
};

export default HomePage;
