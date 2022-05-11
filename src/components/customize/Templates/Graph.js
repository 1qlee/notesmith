import React, { useEffect, useState } from "react"
import { convertToPx, convertFloatFixed } from "../../../styles/variables"

function Graph({ pageData, setPageData }) {
  const [lineRows, setLineRows] = useState([])
  const [lineColumns, setLineColumns] = useState([])
  const lineThickness = convertToPx(pageData.thickness)
  const lineOffset = lineThickness / 2
  const spacing = convertToPx(pageData.spacing)
  const marginLeft = convertToPx(pageData.marginLeft)
  const marginTop = convertToPx(pageData.marginTop)

  function createColumns() {
    // placeholder array
    const lineColumnsArray = []
    // grid column lines
    for (let i = 0; i < pageData.columns; i++) {
      const lineY1 = marginTop
      const lineY2 = pageData.rows * (spacing + lineThickness) + lineY1 + lineThickness
      const lineXFirst = marginLeft + lineOffset
      const lineX = lineXFirst + (i + 1) * (spacing + lineThickness)
      // first  column
      const firstColumnLine = {
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: pageData.opacity,
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
        opacity: pageData.opacity,
        x1: convertFloatFixed(lineX, 3),
        x2: convertFloatFixed(lineX, 3),
        y1: convertFloatFixed(lineY1, 3),
        y2: convertFloatFixed(lineY2, 3),
      }

      if (i === 0) {
        lineColumnsArray.push(firstColumnLine)
      }

      // break the loop if columns break past the right side margin
      if (lineX + lineOffset > pageData.pageWidth) {
        setPageData({
          ...pageData,
          columns: i,
        })
        break
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
    for (let i = 0; i < pageData.rows; i++) {
      // calculations and conversions to px
      const lineX1 = marginLeft + lineOffset
      const lineX2 = pageData.columns * (spacing + lineThickness) + lineX1
      const lineYFirst = marginTop + lineOffset
      const lineY = lineYFirst + (i + 1) * (spacing + lineThickness)
      // first row line
      const firstRowLine = {
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: pageData.opacity,
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
        opacity: pageData.opacity,
        x1: lineX1,
        x2: lineX2,
        y1: lineY,
        y2: lineY,
      }

      if (i === 0) {
        lineRowsArray.push(firstRowLine)
      }

      // loop will exit if the last line has passed the height of the page
      if (lineY + lineOffset > pageData.pageHeight) {
        // change the number of rows displayed
        setPageData({
          ...pageData,
          rows: i,
        })
        break
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
  }, [pageData])

  return (
    <>
      <g>
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
      </g>
      <g>
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
      </g>
    </>
  )
}

export default Graph
