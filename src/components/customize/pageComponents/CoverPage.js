import React from "react"
import { colors } from "../../../styles/variables"

import Holes from "./Holes"

function CoverPage({
  bookData,
  canvasPageSize,
  selectedPage,
}) {

  if (selectedPage === 1) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={canvasPageSize.height}
        width={canvasPageSize.width}
        viewBox={`0 0 ${canvasPageSize.width} ${canvasPageSize.height}`}
        x="0"
        y="0"
      >
        <rect
          width={canvasPageSize.width}
          height={canvasPageSize.height}
          fill={colors.white}
          stroke={colors.gray.threeHundred}
        >
        </rect>
        <text
          x={(canvasPageSize.width / 2) - 80}
          y={canvasPageSize.height / 2}
          width={canvasPageSize.width}
          fill={colors.gray.nineHundred}
        >
          THIS IS THE COVER PAGE
        </text>
        <Holes
          currentPageSide="left"
          canvasPageSize={canvasPageSize}
        />
      </svg>
    )
  }
  else if (selectedPage === bookData.numOfPages) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={canvasPageSize.height}
        width={canvasPageSize.width}
        viewBox={`0 0 ${canvasPageSize.width} ${canvasPageSize.height}`}
        x="0"
        y="0"
      >
        <rect
          width={canvasPageSize.width}
          height={canvasPageSize.height}
          fill={colors.white}
          stroke={colors.gray.threeHundred}
        >
        </rect>
        <text
          x={(canvasPageSize.width / 2) - 80}
          y={canvasPageSize.height / 2}
          width={canvasPageSize.width}
          fill={colors.gray.nineHundred}
        >
          THIS IS THE COVER PAGE
        </text>
        <Holes
          currentPageSide="right"
          canvasPageSize={canvasPageSize}
        />
      </svg>
    )
  }
  else return null
}

export default CoverPage
