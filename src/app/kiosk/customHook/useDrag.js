import { useState, useEffect } from "react";

// Custom hook for managing drag functionality
export const useDrag = (dragEnabled) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  // Handle mouse down event (start dragging)
  const onMouseDown = (e) => {
    if (!dragEnabled) return; // Prevent dragging if not enabled

    setIsDragging(true);
    setStartPosition({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
  };

  // Handle mouse move event (dragging)
  const onMouseMove = (e, handleDrag) => {
    if (!isDragging || !dragEnabled) return;

    const newX = e.clientX - startPosition.x;
    const newY = e.clientY - startPosition.y;

    setCurrentPosition({ x: newX, y: newY });

    // Call handleDrag to update the position of the grid container
    if (handleDrag) {
      handleDrag({ x: newX, y: newY });
    }
  };

  // Handle mouse up event (end dragging)
  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Reset position if dragging is disabled
  useEffect(() => {
    if (!dragEnabled) {
      setCurrentPosition({ x: 0, y: 0 }); // Reset position when drag is disabled
    }
  }, [dragEnabled]);

  return { onMouseDown, onMouseMove, onMouseUp };
};
