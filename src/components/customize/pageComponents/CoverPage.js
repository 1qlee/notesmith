import React from "react"
import { colors } from "../../../styles/variables"

import Holes from "./Holes"

function CoverPage({
  bookData,
  pageHeight,
  pageWidth,
  selectedPage,
}) {

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
          x={(pageWidth / 2) - 80}
          y={pageHeight / 2}
          width={pageWidth}
          fill={colors.gray.nineHundred}
        >
          THIS IS THE COVER PAGE
        </text>
        <Holes
          currentPageSide="left"
          pageWidth={pageWidth}
          pageHeight={pageHeight}
        />
      </svg>
    )
  }
  else if (selectedPage === bookData.numOfPages) {
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
