import React, { useState } from "react";

const UShapeVisualizer = () => {
  const initialDimensions = {
    width: 25,
    lengthTop: 60,
    lengthLeft: 60,
    lengthRight: 60,
  };

  const [dimensions, setDimensions] = useState(initialDimensions);

  const handleDrag = (e, side) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startDimensions = { ...dimensions };

    const onDrag = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / 2;
      const dy = (moveEvent.clientY - startY) / 2;

      if (side === "lengthTop") {
        setDimensions((prev) => ({
          ...prev,
          lengthTop: Math.max(10, startDimensions.lengthTop + dx),
        }));
      } else if (side === "lengthLeft") {
        setDimensions((prev) => ({
          ...prev,
          lengthLeft: Math.max(10, startDimensions.lengthLeft + dy),
        }));
      } else if (side === "lengthRight") {
        setDimensions((prev) => ({
          ...prev,
          lengthRight: Math.max(10, startDimensions.lengthRight + dy),
        }));
      }
    };

    const onStopDrag = () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", onStopDrag);
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", onStopDrag);
  };

  const getShapePath = () => {
    const { width, lengthTop, lengthLeft, lengthRight } = dimensions;
    return `
      M0 0
      H${lengthTop}
      V${lengthLeft}
      H${lengthTop + width}
      V${lengthLeft + lengthRight}
      H0
      V${lengthLeft}
      H${width}
      Z
    `;
  };

  const renderDragHandles = () => {
    const { width, lengthTop, lengthLeft, lengthRight } = dimensions;
    return (
      <>
        {/* Top horizontal draggable area */}
        <rect
          x="0"
          y="-10"
          width={lengthTop}
          height="10"
          fill="transparent"
          cursor="ew-resize"
          onMouseDown={(e) => handleDrag(e, "lengthTop")}
        />
        {/* Left vertical draggable area */}
        <rect
          x="-10"
          y="0"
          width="10"
          height={lengthLeft}
          fill="transparent"
          cursor="ns-resize"
          onMouseDown={(e) => handleDrag(e, "lengthLeft")}
        />
        {/* Right vertical draggable area */}
        <rect
          x={lengthTop}
          y={lengthLeft}
          width={width}
          height={lengthRight}
          fill="transparent"
          cursor="ns-resize"
          onMouseDown={(e) => handleDrag(e, "lengthRight")}
        />
      </>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${dimensions.lengthTop + dimensions.width} ${
        dimensions.lengthLeft + dimensions.lengthRight
      }`}
      style={{
        maxWidth: "100%",
        height: "auto",
        margin: "0 auto",
        display: "block",
        backgroundColor: "#f0f0f0",
      }}
    >
      <path d={getShapePath()} fill="#ffcc80" stroke="black" strokeWidth="2" />
      {renderDragHandles()}
    </svg>
  );
};

export default UShapeVisualizer;
