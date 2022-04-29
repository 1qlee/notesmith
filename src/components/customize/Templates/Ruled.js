import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Ruled({
  pageData,
  setPageData,
}) {
  const [lines, setLines] = useState([])
  const [lineStyle, setLineStyle] = useState({})

  function createLines() {
    const linesArray = []
    const lineThickness = convertToPx(pageData.thickness)

    for (let i = 0; i < pageData.rows; i++) {
      // calculations and conversions to px
      const lineX1 = convertToPx(pageData.marginLeft)
      const lineX2 = pageData.pageWidth - convertToPx(pageData.marginRight)
      const lineY = (i * convertToPx(pageData.spacing)) + convertToPx(pageData.marginTop) + lineThickness * (i + 1)
      setLineStyle({
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: pageData.opacity,
      })
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
      if (lineY > pageData.pageHeight) {
        console.log(lineY, pageData.pageHeight)
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
