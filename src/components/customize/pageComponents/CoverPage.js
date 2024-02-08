import React from "react"
import { colors } from "../../../styles/variables"

import Holes from "./Holes"

function CoverPage({
  productData,
  selectedPage,
}) {
  const pageHeight = productData.heightPixel
  const pageWidth = productData.widthPixel

  if (selectedPage === 1) {
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
          x={(pageWidth / 2) - 40}
          y={pageHeight / 2}
          width={pageWidth}
          fill={colors.gray.nineHundred}
          style={{pointerEvents: "none", userSelect: "none"}}
        >
          Front cover
        </text>
        <Holes
          currentPageSide="left"
          pageWidth={pageWidth}
          pageHeight={pageHeight}
        />
      </svg>
    )
  }
  else if (selectedPage === productData.numOfPages) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={pageHeight}
        width={pageWidth}
        viewBox={`0 0 ${pageWidth} ${pageHeight}`}
        x={pageWidth}
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
          x={(pageWidth / 2) - 40}
          y={pageHeight / 2}
          width={pageWidth}
          fill={colors.gray.nineHundred}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          Back cover
        </text>
        <Holes
          currentPageSide="right"
          pageWidth={pageWidth}
          pageHeight={pageHeight}
        />
      </svg>
    )
  }
  else return null
}

export default CoverPage