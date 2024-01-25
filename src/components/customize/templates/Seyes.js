import React, { useState, useEffect } from "react"
import { convertToPx, convertFloatFixed } from "../../../utils/helper-functions"

function Seyes({
  maxSvgSize,
  pageData,
  setPageData,
  setMax,
  setSvgLoaded,
}) {
  const [horizontalLines, setHorizontalLines] = useState([])
  const [verticalLines, setVerticalLines] = useState([])
  const { rows, columns, strokeWidth, spacing, opacity, rowSpacing, columnSpacing } = pageData
  const { width, height } = maxSvgSize
  const headerSpacing = convertToPx(rowSpacing)
  const sideMarginSpacing = convertToPx(columnSpacing)
  const lineSpacing = convertToPx(spacing)
  const lineStrokeWidth = convertToPx(strokeWidth)
  const halfLineStrokeWidth = convertFloatFixed(lineStrokeWidth / 2, 3)
  const dividerStrokeWidth = convertFloatFixed(lineStrokeWidth * 1.5, 3) // the bold lines that occur every 4 lines
  const halfDividerStrokeWidth = convertFloatFixed(dividerStrokeWidth / 2, 3)
  const verticalLineStrokeWidth = convertFloatFixed(lineStrokeWidth * 2, 3)
  const halfVerticalLineStrokeWidth = convertFloatFixed(verticalLineStrokeWidth / 2, 3)
  // const maxRows = Math.floor((height - headerSpacing) / (lineStrokeWidth + lineSpacing))
  // const maxCols = Math.floor((width - sideMarginSpacing) / (lineSpacing * 4 + verticalLineStrokeWidth)) + 1
  const maxRows = 191
  const maxCols = 31

  function createHorizontalLines() {
    const linesArray = []
    let numOfDividers = 0
    let numOfLines = -1
    let currentLineStrokeWidth = dividerStrokeWidth

    for (let row = 0; row < rows; row++) {
      let spaceBtwnLines
      
      if (row === 0) {
        spaceBtwnLines = halfDividerStrokeWidth
        numOfDividers += 1
      }
      else {
        if (row % 4 === 0) {
          numOfDividers += 1
          currentLineStrokeWidth = dividerStrokeWidth
          spaceBtwnLines = lineStrokeWidth * numOfLines + dividerStrokeWidth * numOfDividers + lineStrokeWidth / 4
        }
        else {
          numOfLines += 1
          currentLineStrokeWidth = lineStrokeWidth
          spaceBtwnLines = lineStrokeWidth * numOfLines + dividerStrokeWidth * numOfDividers + halfLineStrokeWidth
        }
        
      }

      const posX1 = 0
      const posX2 = width
      const posY = (row * lineSpacing) + headerSpacing + spaceBtwnLines
      const line = {
        stroke: "#000",
        strokeWidth: currentLineStrokeWidth, // every 4th line should be thicker when option is checked
        opacity: opacity,
        x1: convertFloatFixed(posX1, 3),
        x2: convertFloatFixed(posX2, 3),
        y1: convertFloatFixed(posY, 3),
        y2: convertFloatFixed(posY, 3),
      }

      // loop will exit if the last line has passed the height of the page
      if (posY + currentLineStrokeWidth / 2 > height) {
        
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
      const posX = (col * lineSpacing * 4) + verticalLineStrokeWidth * col + sideMarginSpacing + halfVerticalLineStrokeWidth
      const posY1 = 0
      const posY2 = height
      const line = {
        stroke: "#000000",
        strokeWidth: verticalLineStrokeWidth,
        opacity: opacity,
        x1: convertFloatFixed(posX, 3),
        x2: convertFloatFixed(posX, 3),
        y1: convertFloatFixed(posY1, 3),
        y2: convertFloatFixed(posY2, 3),
      }

      if (posX + halfVerticalLineStrokeWidth > width) {
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

    setSvgLoaded(true)
  }, [pageData])

  return (
    <>
      <>
        {horizontalLines.map((line, index) => (
          <line
            key={index}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
            opacity={line.opacity}
            x1={line.x1}
            x2={line.x2}
            y1={line.y1}
            y2={line.y2}
          />
        ))}
      </>
      <>
        {verticalLines.map((line, index) => (
          <line
            key={index}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
            opacity={line.opacity}
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

export default Seyes
