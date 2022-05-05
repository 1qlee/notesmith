import React, { useEffect, useState } from "react"
import { convertToPx, convertFloatFixed } from "../../../styles/variables"

function Graph({ pageData, setPageData }) {
  const [lineRows, setLineRows] = useState([])
  const [lineColumns, setLineColumns] = useState([])
  const lineThickness = convertToPx(pageData.thickness)

  function createColumns() {
    // placeholder array
    const lineColumnsArray = []
    const lineThickness = convertToPx(pageData.thickness)
    // grid column lines
    for (let col = 0; col < pageData.columns; col++) {
      const lineY1 = convertToPx(pageData.marginTop)
      const lineY2 = convertToPx(pageData.rows * pageData.spacing) + lineY1
      const lineX = col * convertToPx(pageData.spacing) + convertToPx(pageData.marginLeft) + lineThickness
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

      // break the loop if columns break past the right side margin
      if (lineX > pageData.pageWidth) {
        setPageData({
          ...pageData,
          columns: col,
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
    for (let row = 0; row < pageData.rows; row++) {
      // calculations and conversions to px
      const lineX1 = convertToPx(pageData.marginLeft) + lineThickness
      const lineX2 = convertToPx((pageData.columns) * pageData.spacing + pageData.marginLeft) + lineThickness
      const lineY = row * convertToPx(pageData.spacing) + convertToPx(pageData.marginTop) + lineThickness
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

      // loop will exit if the last line has passed the height of the page
      if (lineY > pageData.pageHeight) {
        // change the number of rows displayed
        setPageData({
          ...pageData,
          rows: row,
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
            opacity={line.opacity}
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
            opacity={line.opacity}
            x1={line.x1}
            x2={line.x2}
            y1={line.y1}
            y2={line.y2}
          >
          </line>
        ))}
      </g>
    </>
  )
}

export default Graph
