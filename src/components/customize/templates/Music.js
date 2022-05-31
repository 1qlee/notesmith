import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Music({
  pageData,
  setPageData,
}) {
  const [staves, setStaves] = useState([])
  const { pageWidth, pageHeight, opacity, rows } = pageData
  const lineSpacing = convertToPx(pageData.spacing)
  const staffSpacing = convertToPx(pageData.groupSpacing)
  const lineThickness = convertToPx(pageData.thickness)
  const marginTop = convertToPx(pageData.marginTop)
  const marginLeft = convertToPx(pageData.marginLeft)

  function createStaves() {
    const stavesArray = []

    for (let row = 0; row < rows; row++) {
      const linesArray = []

      for (let line = 0; line < 5; line++) {
        const halfLineThickness = lineThickness / 2
        const staffHeight = lineSpacing * 4 + lineThickness * 4 // staff always has 5 lines
        const spaceBtwnStaves = row * (staffSpacing + staffHeight)
        console.log(spaceBtwnStaves)
        const spaceBtwnLines = line === 0 ? halfLineThickness : lineThickness * line + halfLineThickness
        const posX1 = marginLeft
        const posX2 = pageWidth
        const posY1 = marginTop + line * lineSpacing + spaceBtwnStaves + spaceBtwnLines
        const posY2 = posY1
        const lineProps = {
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: opacity,
          x1: posX1,
          x2: posX2,
          y1: posY1,
          y2: posY2,
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

      stavesArray.push(linesArray)
    }

    setStaves(stavesArray)
  }

  useEffect(() => {
    createStaves()
  }, [pageData])

  return (
    <>
      {staves.map(staff => (
        <g>
          {staff.map((line, index) => (
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
      ))}
    </>
  )
}

export default Music
