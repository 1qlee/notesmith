import React from "react"
import { colors } from "../../../styles/variables"

import Holes from "./Holes"

function PageBackground({
  currentPageSide,
  isSelected,
  canvasPageSize,
  pageSide,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id={pageSide === "left" ? "page-background-left" : "page-background-right"}
      width={canvasPageSize.width}
      height={canvasPageSize.height}
      x={pageSide === "left" ? "0" : canvasPageSize.width}
      y="0"
    >
      <rect
        width={canvasPageSize.width}
        height={canvasPageSize.height}
        fill={colors.white}
        stroke={colors.gray.threeHundred}
        strokeWidth="2px"
        style={isSelected ? { stroke: colors.primary.sixHundred } : null}
      ></rect>
      <Holes currentPageSide={pageSide} canvasPageSize={canvasPageSize} />
    </svg>
  )
}

export default PageBackground
