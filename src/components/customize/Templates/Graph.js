import React, { useEffect, useState } from "react"
import { convertToPx } from "../../../styles/variables"

function Ruled({ pageData, setPageData }) {
  const [lineRows, setLineRows] = useState([])
  const [lineColumns, setLineColumns] = useState([])
  const lineThickness = convertToPx(pageData.thickness)

  function createColumns() {
    // placeholder array
    const lineColumnsArray = []
    // grid column lines
    for (let i = 0; i < pageData.columns; i++) {
      const lineY1 = convertToPx(pageData.marginTop - (pageData.thickness / 2))
      const lineY2 = convertToPx((pageData.rows - 1) * pageData.spacing) + convertToPx(pageData.marginTop + (pageData.thickness / 2))
      const lineX = (i * convertToPx(pageData.spacing)) + convertToPx(pageData.marginLeft)
      // line object that holds line properties
      const line = {
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: pageData.opacity,
        x1: lineX,
        x2: lineX,
        y1: lineY1,
        y2: lineY2,
      }

      // break the loop if columns break past the right side margin
      if (lineX > pageData.pageWidth - convertToPx(3.175)) {
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
      const lineX1 = convertToPx(pageData.marginLeft)
      const lineX2 = convertToPx((pageData.columns - 1) * pageData.spacing + pageData.marginLeft)
      const lineY = (i * convertToPx(pageData.spacing)) + convertToPx(pageData.marginTop)
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
      if (lineY > pageData.pageHeight - convertToPx(3.175)) {
        // change the number of rows displayed
        setPageData({
          ...pageData,
          rows: i
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
    <g>
      {lineRows && lineRows.map((line, index) => (
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
      {lineColumns && lineColumns.map((line, index) => (
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
