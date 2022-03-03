import React from "react"
import { colors } from "../../../styles/variables"

import Holes from "./Holes"

function PageBackground({
  currentPageSide,
  canvasPageWidth,
  canvasPageHeight,
  isSelected,
  pageSide,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id={pageSide === "left" ? "page-background-left" : "page-background-right"}
      width={canvasPageWidth}
      height={canvasPageHeight}
      x={pageSide === "left" ? "1" : canvasPageWidth + 2}
      y="1"
      style={isSelected ? { outline: `1px solid ${colors.primary.sixHundred}` } : null}
    >
      <rect width={canvasPageWidth} height={canvasPageHeight - 2} fill={colors.white}></rect>
      <Holes currentPageSide={pageSide} canvasPageWidth={canvasPageWidth} canvasPageHeight={canvasPageHeight} />
    </svg>
  )
}

export default PageBackground
