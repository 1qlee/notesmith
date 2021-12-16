import React, { useState, useEffect } from "react"
import { convertToPx } from "../../../styles/variables"

function Blank({
  pageData,
  currentPageSide
}) {

  return (
    <g>
      <rect
        width={pageData.pageWidth}
        height={pageData.pageHeight}
        fill="#FFF"
      >
      </rect>
    </g>
  )
}

export default Blank
