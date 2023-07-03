import React from "react"

function Blank({
  pageData,
  maxSvgSize
}) {

  return (
    <rect
      width={maxSvgSize.width}
      height={maxSvgSize.height}
      fill="#FFF"
    >
    </rect>
  )
}

export default Blank
