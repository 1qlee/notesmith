import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Ruled({
  pageData,
  setPageData,
}) {
  const [lines, setLines] = useState([])
  const { pageWidth, pageHeight, thickness, spacing } = pageData
  const marginLeft = convertToPx(pageData.marginLeft)
  const marginRight = convertToPx(pageData.marginRight)
  const marginTop = convertToPx(pageData.marginTop)
  const lineThickness = convertToPx(thickness)
  const lineSpacing = convertToPx(spacing)

  function createLines() {
    const linesArray = []

    for (let i = 0; i < pageData.rows; i++) {
      // calculations and conversions to px
      const halfLineThickness = lineThickness / 2
      const spaceBtwnLines = i === 0 ? halfLineThickness : lineThickness * i + halfLineThickness
      const lineX1 = marginLeft
      const lineX2 = pageWidth - marginRight
      const lineY = i * lineSpacing + marginTop + spaceBtwnLines
      // line object
      const line = {
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: pageData.opacity,
        x1: convertFloatFixed(lineX1, 3),
        x2: convertFloatFixed(lineX2, 3),
        y1: convertFloatFixed(lineY, 3),
        y2: convertFloatFixed(lineY, 3),
      }

      // loop will exit if the last line has passed the height of the page
      if (lineY > pageHeight) {
        // change the number of rows displayed
        setPageData({
          ...pageData,
          rows: i,
        })
        break
      }
      else {
        linesArray.push(line)
      }
    }

    setLines(linesArray)
  }

  useEffect(() => {
    createLines()
  }, [pageData])

  return (
    <>
      {lines.map((line, index) => (
        <line
          key={index}
          fill={line.fill}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          opacity={line.opacity}
          x1={line.x1}
          x2={line.x2}
          y1={line.y1}
          y2={line.y2}
        >
        </line>
      ))}
    </>
  )
}

export default Ruled
