import React from "react"

function Blank({
  pageData,
  currentPageSide
}) {

  return (
    <rect
      width={pageData.pageWidth}
      height={pageData.pageHeight}
      fill="#FFF"
    >
    </rect>
  )
}

export default Blank
