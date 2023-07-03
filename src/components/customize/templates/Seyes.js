import React, { useState, useEffect } from "react"
import { convertToPx, convertFloatFixed } from "../../../styles/variables"

function Seyes({
  maxSvgSize,
  pageData,
  setPageData,
}) {
  const [horizontalLines, setHorizontalLines] = useState([])
  const [verticalLines, setVerticalLines] = useState([])
  const { rows, columns, thickness, spacing, opacity, rowSpacing, columnSpacing } = pageData
  const { width, height } = maxSvgSize
  const headerSpacing = convertToPx(rowSpacing)
  const sideMarginSpacing = convertToPx(columnSpacing)
  const lineSpacing = convertToPx(spacing)
  const lineThickness = convertToPx(thickness)

  function createHorizontalLines() {
    const linesArray = []

    for (let row = 0; row < rows; row++) {
      const posX1 = 0
      const posX2 = convertFloatFixed(width, 3)
      const posY1 = convertFloatFixed((row * lineSpacing) + lineThickness * (row + 1) + headerSpacing, 3)
      const posY2 = posY1
      const line = {
        fill: "none",
        stroke: "#000",
        strokeWidth: row % 4 === 0 ? lineThickness * 2 : lineThickness, // every 4th line should be thicker when option is checked
        opacity: opacity,
        x1: posX1,
        x2: posX2,
        y1: posY1,
        y2: posY2,
      }

      // loop will exit if the last line has passed the height of the page
      if (posY1 > height) {
        // change the number of rows displayed
        return setPageData({
          ...pageData,
          rows: row,
        })
      }
      else {
        linesArray.push(line)
      }
    }

    setHorizontalLines(linesArray)
  }

  function createVerticalLines() {
    const linesArray = []

    for (let col = 0; col < columns; col++) {
      const posX1 = convertFloatFixed((col * lineSpacing * 4) + lineThickness * (col + 1) + sideMarginSpacing, 3)
      const posX2 = posX1
      const posY1 = 0
      const posY2 = convertFloatFixed(height, 3)
      const line = {
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness * 2,
        opacity: opacity,
        x1: posX1,
        x2: posX2,
        y1: posY1,
        y2: posY2,
      }

      if (posX1 > width) {
        return setPageData({
          ...pageData,
          columns: col,
        })
      }
      else {
        linesArray.push(line)
      }
    }

    setVerticalLines(linesArray)
  }

  useEffect(() => {
    createHorizontalLines()
    createVerticalLines()
  }, [pageData, maxSvgSize])

  return (
    <>
      <g>
        {horizontalLines.map((line, index) => (
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
          />
        ))}
      </g>
      <g>
        {verticalLines.map((line, index) => (
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
          />
        ))}
      </g>
    </>
  )
}

export default Seyes
