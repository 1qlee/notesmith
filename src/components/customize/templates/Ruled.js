import React, { useState, useEffect, useMemo } from "react"
import { convertToPx, convertFloatFixed } from "../../../utils/helper-functions"

function Ruled({
  maxSvgSize,
  pageData,
  setPageData,
  setMax,
  setSvgLoaded,
}) {
  const [lines, setLines] = useState([])
  const { strokeWidth, spacing, opacity, rows } = pageData
  const { width, height } = maxSvgSize
  const lineStrokeWidth = convertToPx(strokeWidth)
  const halfLineStrokeWidth = lineStrokeWidth / 2
  const lineSpacing = convertToPx(spacing)
  const maxRows = Math.floor(height / (lineSpacing + lineStrokeWidth)) + 1

  const memoCreateLines = useMemo(() => function createLines() {
    const linesArray = []

    for (let row = 0; row < rows; row++) {
      // calculations and conversions to px
      const spaceBtwnLines = row === 0 ? halfLineStrokeWidth : lineStrokeWidth * row + halfLineStrokeWidth
      const lineX1 = 0
      const lineX2 = width
      const lineY = row * lineSpacing + spaceBtwnLines
      // line object
      const line = {
        stroke: "#000",
        strokeWidth: lineStrokeWidth,
        opacity: `${opacity}%`,
        x1: convertFloatFixed(lineX1, 3),
        x2: convertFloatFixed(lineX2, 3),
        y1: convertFloatFixed(lineY, 3),
        y2: convertFloatFixed(lineY, 3),
      }

      // loop will exit if the last line has passed the height of the page
      // 0.002 is a small buffer to account for rounding errors
      if (lineY + halfLineStrokeWidth - 0.004 > height) {
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
  }, [pageData])

  useEffect(() => {
    memoCreateLines()
    setMax({
      rows: maxRows,
    })
    setSvgLoaded(true)
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
          id={`svg_${index + 1}`}
        >
        </line>
      ))}
    </>
  )
}

export default Ruled
