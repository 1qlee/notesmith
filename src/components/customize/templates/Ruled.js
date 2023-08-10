import React, { useState, useEffect } from "react"
import { convertToPx, convertFloatFixed } from "../../../styles/variables"

function Ruled({
  maxSvgSize,
  pageData,
  setPageData,
  setMax,
}) {
  const [lines, setLines] = useState([])
  const { thickness, spacing, opacity, rows } = pageData
  const { width, height } = maxSvgSize
  const lineThickness = convertToPx(thickness)
  const halfLineThickness = lineThickness / 2
  const lineSpacing = convertToPx(spacing)
  const maxRows = Math.floor((height + lineSpacing) / (lineThickness + lineSpacing))

  function createLines() {
    const linesArray = []

    for (let row = 0; row < rows; row++) {
      // calculations and conversions to px
      const spaceBtwnLines = row === 0 ? halfLineThickness : lineThickness * row + halfLineThickness
      const lineX1 = 0
      const lineX2 = width
      const lineY = row * lineSpacing + spaceBtwnLines
      // line object
      const line = {
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: opacity,
        x1: convertFloatFixed(lineX1, 3),
        x2: convertFloatFixed(lineX2, 3),
        y1: convertFloatFixed(lineY, 3),
        y2: convertFloatFixed(lineY, 3),
      }

      // loop will exit if the last line has passed the height of the page
      if (lineY + halfLineThickness > height) {
        // change the number of rows displayed
        setPageData({
          ...pageData,
          rows: row,
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
    setMax({
      rows: maxRows,
    })
  }, [pageData])

  return (
    <>
      {lines.map((line, index) => (
        <line
          key={index}
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
