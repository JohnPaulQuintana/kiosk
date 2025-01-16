import { useState } from "react";

export const useZoom = (initialScale = 1, minScale = 0.5, maxScale = 2) => {
  const [scale, setScale] = useState(initialScale);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, maxScale));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, minScale));
  const resetZoom = () => setScale(initialScale);

  return { scale, zoomIn, zoomOut, resetZoom };
};
