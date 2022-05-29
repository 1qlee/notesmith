import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Seyes({
  pageData,
  setPageData,
}) {
  const [horizontalLines, setHorizontalLines] = useState([])
  const [verticalLines, setVerticalLines] = useState([])
  const { pageWidth, pageHeight } = pageData
  const spacing = convertToPx(pageData.spacing)
  const lineThickness = convertToPx(pageData.thickness)
  const marginTop = convertToPx(pageData.marginTop)
  const marginLeft = convertToPx(pageData.marginLeft)

  useEffect(() => {
    function createHorizontalLines() {
      const linesArray = []

      for (let row = 0; row < pageData.rows; row++) {
        const posX1 = 0
        const posX2 = pageWidth
        const posY1 = convertFloatFixed((row * spacing) + marginTop + lineThickness * (row + 1), 3)
        const posY2 = posY1
        const line = {
          fill: "none",
          stroke: "#000",
          strokeWidth: row % 4 === 0 ? lineThickness * 2 : lineThickness, // every 4th line should be thicker when option is checked
          opacity: pageData.opacity,
          x1: posX1,
          x2: posX2,
          y1: posY1,
          y2: posY2,
        }

        // loop will exit if the last line has passed the height of the page
        if (posY1 > pageHeight) {
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

      setHorizontalLines(linesArray)
    }

    function createVerticalLines() {
      const linesArray = []

      for (let col = 0; col < pageData.columns; col++) {
        const posX1 = (col * spacing * 4) + marginLeft + lineThickness * (col + 1)
        const posX2 = (col * spacing * 4) + marginLeft + lineThickness * (col + 1)
        const posY1 = 0
        const posY2 = pageHeight - lineThickness * 2
        const line = {
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness * 2,
          opacity: pageData.opacity,
          x1: posX1,
          x2: posX2,
          y1: posY1,
          y2: posY2,
        }

        if (posX1 > pageWidth) {
          setPageData({
            ...pageData,
            columns: col,
          })
          break
        }
        else {
          linesArray.push(line)
        }
      }

      setVerticalLines(linesArray)
    }

    createHorizontalLines()
    createVerticalLines()
  }, [pageData])

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
