import React from "react"
import { convertToPx } from "../../../styles/variables"

function Ruled({ pageData }) {
  const lineRows = []
  const lineColumns = []

  if (pageData.marginTop < 3.175) {
    pageData.marginTop = 3.175
  }
  if (pageData.marginLeft < 3.175) {
    pageData.marginLeft = 3.175
  }
  if (pageData.marginRight < 3.175) {
    pageData.marginRight = 3.175
  }

  for (let i = 0; i < pageData.rows; i++) {
    // calculations and conversions to px
    const lineX1 = convertToPx(pageData.marginLeft)
    const lineX2 = pageData.pageWidth - convertToPx(pageData.marginRight)
    const lineY = (i * convertToPx(pageData.spacing)) + convertToPx(pageData.marginTop)
    // line object
    const line = {
      fill: "none",
      stroke: "#000",
      strokeWidth: pageData.thickness,
      opacity: pageData.opacity,
      x1: lineX1,
      x2: lineX2,
      y1: lineY,
      y2: lineY,
    }

    // loop will exit if the last line has passed the height of the page
    if (lineY > pageData.pageHeight - convertToPx(3.175)) {
      // change the number of rows displayed
      pageData.rows = i
      break
    }
    else {
      lineRows.push(line)
    }
  }

  for (let i = 0; i < pageData.columns; i++) {
    const lineY1 = convertToPx(pageData.marginTop)
    const lineY2 = convertToPx(pageData.marginBottom)
    const lineX = (i * convertToPx(pageData.spacing)) + convertToPx(pageData.marginLeft)

    const line = {
      fill: "none",
      stroke: "#000",
      strokeWidth: pageData.thickness,
      opacity: pageData.opacity,
      x1: lineX,
      x2: lineX,
      y1: lineY1,
      y2: lineY2,
    }

    if (lineX > pageData.pageWidth - convertToPx(3.175)) {
      pageData.columns = i
      break
    }
    else {
      lineColumns.push(line)
    }
  }

  return (
    <g>
      {lineRows.map((line, index) => (
        <line
          key={index}
          fill={line.fill}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          style={{opacity: `${line.opacity}`}}
          x1={line.x1}
          x2={line.x2}
          y1={line.y1}
          y2={line.y2}
        >
        </line>
      ))}
      {lineColumns.map((line, index) => (
        <line
          key={index}
          fill={line.fill}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          style={{opacity: `${line.opacity}`}}
          x1={line.x1}
          x2={line.x2}
          y1={line.y1}
          y2={line.y2}
        >
        </line>
      ))}
    </g>
  )
}

export default Ruled
