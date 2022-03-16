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
      x={pageSide === "left" ? "1" : canvasPageSize.width + 2}
      y="1"
      style={isSelected ? { outline: `1px solid ${colors.primary.sixHundred}` } : null}
    >
      <rect width={canvasPageSize.width} height={canvasPageSize.height - 2} fill={colors.white}></rect>
      <Holes currentPageSide={pageSide} canvasPageSize={canvasPageSize} />
    </svg>
  )
}

export default PageBackground
