import React, { useState, useEffect } from "react"
import { convertToPx, convertFloatFixed } from "../../../styles/variables"

function Seyes({
  maxSvgSize,
  pageData,
  setPageData,
  setMax,
}) {
  const [horizontalLines, setHorizontalLines] = useState([])
  const [verticalLines, setVerticalLines] = useState([])
  const { rows, columns, thickness, spacing, opacity, rowSpacing, columnSpacing } = pageData
  const { width, height } = maxSvgSize
  const headerSpacing = convertToPx(rowSpacing)
  const sideMarginSpacing = convertToPx(columnSpacing)
  const lineSpacing = convertToPx(spacing)
  const lineThickness = convertToPx(thickness)
  const halfLineThickness = lineThickness / 2
  const dividerThickness = lineThickness * 1.5 // the bold lines that occur every 4 lines
  const halfDividerThickness = dividerThickness / 2
  const verticalLineThickness = lineThickness * 2
  const halfVerticalLineThickness = verticalLineThickness / 2
  // const maxRows = Math.floor((height - headerSpacing) / (lineThickness + lineSpacing))
  // const maxCols = Math.floor((width - sideMarginSpacing) / (lineSpacing * 4 + verticalLineThickness)) + 1
  const maxRows = 191
  const maxCols = 31

  function createHorizontalLines() {
    const linesArray = []
    let numOfDividers = 0
    let numOfLines = -1
    let currentLineThickness = dividerThickness

    for (let row = 0; row < rows; row++) {
      let spaceBtwnLines
      
      if (row === 0) {
        spaceBtwnLines = halfDividerThickness
        numOfDividers += 1
      }
      else {
        if (row % 4 === 0) {
          numOfDividers += 1
          currentLineThickness = dividerThickness
          spaceBtwnLines = lineThickness * numOfLines + dividerThickness * numOfDividers + lineThickness / 4
        }
        else {
          numOfLines += 1
          currentLineThickness = lineThickness
          spaceBtwnLines = lineThickness * numOfLines + dividerThickness * numOfDividers + halfLineThickness
        }
        
      }

      const posX1 = 0
      const posX2 = width
      const posY = (row * lineSpacing) + headerSpacing + spaceBtwnLines
      const line = {
        fill: "none",
        stroke: "#000",
        strokeWidth: currentLineThickness, // every 4th line should be thicker when option is checked
        opacity: opacity,
        x1: convertFloatFixed(posX1, 3),
        x2: convertFloatFixed(posX2, 3),
        y1: convertFloatFixed(posY, 3),
        y2: convertFloatFixed(posY, 3),
      }

      // loop will exit if the last line has passed the height of the page
      if (posY + currentLineThickness / 2 > height) {
        console.log("🚀 ~ file: Seyes.js:71 ~ createHorizontalLines ~ row:", row)
        
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
      const posX = (col * lineSpacing * 4) + verticalLineThickness * col + sideMarginSpacing + halfVerticalLineThickness
      const posY1 = 0
      const posY2 = height
      const line = {
        fill: "none",
        stroke: "#000",
        strokeWidth: verticalLineThickness,
        opacity: opacity,
        x1: convertFloatFixed(posX, 3),
        x2: convertFloatFixed(posX, 3),
        y1: convertFloatFixed(posY1, 3),
        y2: convertFloatFixed(posY2, 3),
      }

      if (posX + halfVerticalLineThickness > width) {
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
    setMax({
      rows: maxRows,
      columns: maxCols,
    })
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
