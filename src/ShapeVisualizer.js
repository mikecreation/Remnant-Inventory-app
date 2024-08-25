import React, { useCallback } from "react";
import UShapeVisualizer from "./UShapeVisualizer"; // Import the new UShapeVisualizer component
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  shapeSvg: {
    width: "100%",
    height: "auto",
    maxWidth: "400px",
    margin: "0 auto",
    display: "block",
    cursor: "pointer",
  },
});

const ShapeVisualizer = React.memo(({ shape, dimensions, onSideClick }) => {
  const classes = useStyles();

  const getShapePath = useCallback(() => {
    switch (shape) {
      case "rectangle":
        return `M0 0 V${dimensions.length} H${dimensions.width} V0 Z`;
      case "L-shape":
        return `M0 0 V${dimensions.length1} H${dimensions.width2} V${dimensions.length2} H${dimensions.width1} V0 Z`;
      default:
        return "";
    }
  }, [shape, dimensions]);

  const getColor = useCallback(() => {
    switch (shape) {
      case "rectangle":
        return "#90caf9";
      case "L-shape":
        return "#ffd54f";
      default:
        return "#e0e0e0";
    }
  }, [shape]);

  const renderSides = useCallback(() => {
    const sides = [];
    switch (shape) {
      case "rectangle":
        sides.push(
          <rect
            key="side-top"
            x="0"
            y="-10"
            width={dimensions.width}
            height="10"
            fill="transparent"
            onClick={() => onSideClick("length")}
          />,
          <rect
            key="side-bottom"
            x="0"
            y={dimensions.length}
            width={dimensions.width}
            height="10"
            fill="transparent"
            onClick={() => onSideClick("length")}
          />,
          <rect
            key="side-left"
            x="-10"
            y="0"
            width="10"
            height={dimensions.length}
            fill="transparent"
            onClick={() => onSideClick("width")}
          />,
          <rect
            key="side-right"
            x={dimensions.width}
            y="0"
            width="10"
            height={dimensions.length}
            fill="transparent"
            onClick={() => onSideClick("width")}
          />
        );
        break;
      case "L-shape":
        sides.push(
          <rect
            key="side-top1"
            x="0"
            y="-10"
            width={dimensions.width1}
            height="10"
            fill="transparent"
            onClick={() => onSideClick("width1")}
          />,
          <rect
            key="side-right1"
            x={dimensions.width1}
            y="0"
            width="10"
            height={dimensions.length1}
            fill="transparent"
            onClick={() => onSideClick("length1")}
          />,
          <rect
            key="side-bottom1"
            x="0"
            y={dimensions.length1}
            width={dimensions.width2}
            height="10"
            fill="transparent"
            onClick={() => onSideClick("width2")}
          />,
          <rect
            key="side-left2"
            x={dimensions.width1 + dimensions.width2}
            y={dimensions.length1 - dimensions.length2}
            width="10"
            height={dimensions.length2}
            fill="transparent"
            onClick={() => onSideClick("length2")}
          />
        );
        break;
      default:
        break;
    }
    return sides;
  }, [shape, dimensions, onSideClick]);

  const svgWidth =
    shape === "L-shape"
      ? dimensions.width1 + dimensions.width2
      : dimensions.width;

  const svgHeight =
    shape === "L-shape"
      ? Math.max(dimensions.length1, dimensions.length2)
      : dimensions.length;

  // Add some padding
  const padding = 30;
  const viewBoxWidth = svgWidth + padding * 2;
  const viewBoxHeight = svgHeight + padding * 2;

  return shape === "U-shape" ? (
    <UShapeVisualizer dimensions={dimensions} onSideClick={onSideClick} />
  ) : (
    <svg
      className={classes.shapeSvg}
      viewBox={`${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}`}
    >
      <path
        d={getShapePath()}
        fill={getColor()}
        stroke="black"
        strokeWidth="2"
      />
      {renderSides()}
    </svg>
  );
});

export default ShapeVisualizer;
