export const parseSVG = (svgData) => {
    return new DOMParser().parseFromString(svgData, "image/svg+xml").documentElement;
  };
  