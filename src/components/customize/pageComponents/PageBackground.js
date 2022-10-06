import React from "react"
import { colors } from "../../../styles/variables"

import Holes from "./Holes"

function PageBackground({
  isSelected,
  pageHeight,
  pageWidth,
  pageSide,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pageWidth}
      height={pageHeight}
      x={pageSide === "left" ? "0" : pageWidth}
      y="0"
    >
      <rect
        width={pageWidth}
        height={pageHeight}
        fill={colors.white}
        stroke={colors.gray.threeHundred}
        strokeWidth="2px"
        style={isSelected ? { stroke: colors.primary.sixHundred } : null}
      ></rect>
      <Holes 
        currentPageSide={pageSide} 
        pageHeight={pageHeight}
        pageWidth={pageWidth}
      />
    </svg>
  )
}

export default PageBackground
