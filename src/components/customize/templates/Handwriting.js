import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Handwriting({
  dashedLineData,
  pageData,
  setPageData,
}) {
  const [writingRows, setWritingRows] = useState([])
  const { pageWidth, pageHeight, opacity, rows, spacing, groupSpacing, thickness} = pageData
  const dashOffset = convertToPx(dashedLineData.dashOffset)
  const lineSpacing = convertToPx(spacing)
  const rowSpacing = convertToPx(groupSpacing)
  const lineThickness = convertToPx(thickness)
  const halfLineThickness = lineThickness / 2
  const marginTop = convertToPx(pageData.marginTop)
  const marginLeft = convertToPx(pageData.marginLeft)
  const marginRight = convertToPx(pageData.marginRight)

  function parseDashArray(value) {
    if (value.length > 0) {
      let dummyArray = []
      // create an array from the dash array prop by splitting btwn spaces
      let newDashArray = value.split(" ")
      newDashArray.map(elem => {
        dummyArray.push(convertToPx(parseFloat(elem)))
      })

      return dummyArray
    }
  }

  function createWritingRows() {
    const rowsArray = []
    const dashArray = parseDashArray(dashedLineData.dashArray)

    for (let row = 0; row < rows; row++) {
      const linesArray = []

      for (let line = 0; line < 3; line++) {
        const rowHeight = lineSpacing * 2 + lineThickness * 2 // row always has 3 lines, but multiply by 2 because first line doesn't really count
        const spaceBtwnRows = row * (rowSpacing + rowHeight + lineThickness)
        const spaceBtwnLines = (line === 0 && row === 0) ? halfLineThickness : lineThickness * line + halfLineThickness
        const posX1 = marginLeft
        const posX2 = pageWidth - marginRight
        const posY1 = marginTop + line * lineSpacing + spaceBtwnRows + spaceBtwnLines
        const posY2 = posY1
        let lineProps

        // middle line is a dashed line
        if (line === 1 && !dashedLineData.sync) {
          lineProps = {
            fill: "none",
            stroke: "#000",
            strokeWidth: dashedLineData.thickness,
            strokeDasharray: dashedLineData.dashArray,
            strokeDashoffset: dashOffset,
            opacity: dashedLineData.opacity,
            x1: posX1,
            x2: posX2,
            y1: posY1,
            y2: posY2,
          }
        }
        else {
          lineProps = {
            fill: "none",
            stroke: "#000",
            strokeWidth: lineThickness,
            strokeDasharray: line === 1 && 2,
            opacity: opacity,
            x1: posX1,
            x2: posX2,
            y1: posY1,
            y2: posY2,
          }
        }

        // break the loop if we are past the height of the page
        if (posY1 > pageHeight) {
          setPageData({
            ...pageData,
            rows: row,
          })
          break
        }

        linesArray.push(lineProps)
      }

      rowsArray.push(linesArray)
    }

    setWritingRows(rowsArray)
  }

  useEffect(() => {
    createWritingRows()
  }, [pageData, dashedLineData])

  return (
    <>
      {writingRows.map((row, index) => (
        <g key={index}>
          {row.map((line, index) => (
            <line
              key={index}
              fill={line.fill}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              strokeDasharray={line.strokeDasharray ? line.strokeDasharray : null}
              strokeDashoffset={line.strokeDashoffset ? line.strokeDashoffset : null}
              opacity={line.opacity}
              x1={line.x1}
              x2={line.x2}
              y1={line.y1}
              y2={line.y2}
            />
          ))}
        </g>
      ))}
    </>
  )
}

export default Handwriting
