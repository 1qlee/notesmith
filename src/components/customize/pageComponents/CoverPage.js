import React from "react"
import { colors } from "../../../styles/variables"

import Holes from "./Holes"

function CoverPage({
  pageHeight,
  pageWidth,
  currentPageSide,
}) {
  console.log("CoverPage", currentPageSide)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={pageHeight}
      width={pageWidth}
      viewBox={`0 0 ${pageWidth} ${pageHeight}`}
      x="0"
      y="0"
    >
      <rect
        width={pageWidth}
        height={pageHeight}
        fill={colors.white}
        stroke={colors.gray.threeHundred}
      >
      </rect>
      <text
        x={(pageWidth / 2) - 80}
        y={pageHeight / 2}
        width={pageWidth}
        fill={colors.gray.nineHundred}
      >
        THIS IS THE COVER PAGE
      </text>
      <Holes
        currentPageSide={currentPageSide}
        pageWidth={pageWidth}
        pageHeight={pageHeight}
      />
    </svg>
  )
}

export default CoverPage