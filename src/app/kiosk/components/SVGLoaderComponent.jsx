// components/SVGLoaderComponent.js
import React, { useEffect } from "react";
import SVGLoader from "./SVGLoader"; 

const SVGLoaderComponent = ({ filePath, onLoad }) => {
  return <SVGLoader filePath={filePath} onLoad={onLoad} />;
};

export default SVGLoaderComponent;
