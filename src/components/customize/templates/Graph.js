import React, { useEffect, useState } from "react"
import { convertToPx, convertFloatFixed } from "../../../styles/variables"

function Graph({ 
  maxSvgSize,
  pageData, 
  setPageData,
}) {
  const [lineRows, setLineRows] = useState([])
  const [lineColumns, setLineColumns] = useState([])
  const { thickness, opacity, columns, rows, columnSpacing, rowSpacing } = pageData
  const { width, height } = maxSvgSize
  const lineColumnSpacing = convertToPx(columnSpacing)
  const lineRowSpacing = convertToPx(rowSpacing)
  const lineThickness = convertToPx(thickness)
  const lineOffset = lineThickness / 2

  function createColumns() {
    // placeholder array
    const lineColumnsArray = []
    // grid column lines
    for (let column = 0; column < columns; column++) {
      const lineY1 = 0
      const lineY2 = rows * (lineRowSpacing + lineThickness) + lineY1 + lineThickness
      const lineXFirst = lineOffset
      const lineX = lineXFirst + (column + 1) * (lineColumnSpacing + lineThickness)
      // first  column
      const firstColumnLine = {
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: opacity,
        x1: convertFloatFixed(lineXFirst, 3),
        x2: convertFloatFixed(lineXFirst, 3),
        y1: convertFloatFixed(lineY1, 3),
        y2: convertFloatFixed(lineY2, 3),
      }
      // line object that holds line properties
      const line = {
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: opacity,
        x1: convertFloatFixed(lineX, 3),
        x2: convertFloatFixed(lineX, 3),
        y1: convertFloatFixed(lineY1, 3),
        y2: convertFloatFixed(lineY2, 3),
      }

      if (column === 0) {
        lineColumnsArray.push(firstColumnLine)
      }

      // break the loop if columns break past the right side margin
      if (lineX + lineOffset > width) {
        return setPageData({
          ...pageData,
          columns: column,
        })
      }
      else {
        lineColumnsArray.push(line)
      }
    }

    setLineColumns(lineColumnsArray)
  }

  function createRows() {
    // placeholder array
    const lineRowsArray = []
    // grid row lines
    for (let row = 0; row < rows; row++) {
      // calculations and conversions to px
      const lineX1 = lineOffset
      const lineX2 = columns * (lineColumnSpacing + lineThickness) + lineX1
      const lineYFirst = lineOffset
      const lineY = lineYFirst + (row + 1) * (lineRowSpacing + lineThickness)
      // first row line
      const firstRowLine = {
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: opacity,
        x1: lineX1,
        x2: lineX2,
        y1: lineYFirst,
        y2: lineYFirst,
      }
      // line object
      const line = {
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: opacity,
        x1: lineX1,
        x2: lineX2,
        y1: lineY,
        y2: lineY,
      }

      if (row === 0) {
        lineRowsArray.push(firstRowLine)
      }

      // loop will exit if the last line has passed the height of the page
      if (lineY + lineOffset > height) {
        // change the number of rows displayed
        return setPageData({
          ...pageData,
          rows: row,
        })
      }
      else {
        lineRowsArray.push(line)
      }
    }

    setLineRows(lineRowsArray)
  }

  useEffect(() => {
    createRows()
    createColumns()
  }, [pageData, maxSvgSize])

  return (
    <>
      <>
        {lineRows && lineRows.map((line, index) => (
          <line
            key={index}
            fill={line.fill}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
            strokeOpacity={line.opacity}
            x1={line.x1}
            x2={line.x2}
            y1={line.y1}
            y2={line.y2}
          >
          </line>
        ))}
      </>
      <>
        {lineColumns && lineColumns.map((line, index) => (
          <line
            key={index}
            fill={line.fill}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
            strokeOpacity={line.opacity}
            x1={line.x1}
            x2={line.x2}
            y1={line.y1}
            y2={line.y2}
          />
        ))}
      </>
    </>
  )
}

export default Graph
