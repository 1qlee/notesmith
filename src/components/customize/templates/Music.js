import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Music({
  maxSvgSize,
  pageData,
  setPageData,
}) {
  const [staves, setStaves] = useState([])
  const { opacity, spacing, staffSpacing, thickness} = pageData
  const { height, width } = maxSvgSize
  const lineSpacing = convertToPx(spacing)
  const lineThickness = convertToPx(thickness)
  const halfLineThickness = lineThickness / 2
  const stavesSpacing = convertToPx(staffSpacing)

  function createStaves() {
    const stavesArray = []

    for (let staff = 0; staff < pageData.staves; staff++) {
      const linesArray = []

      for (let line = 0; line < 5; line++) {
        const staffHeight = lineSpacing * 4 + lineThickness * 4 // staff always has 5 lines, but multiply by 4 since first line doesn't really count
        const spaceBtwnStaves = staff * (stavesSpacing + staffHeight + lineThickness) // have to add lineThickness to escape the previous staff's last line
        const spaceBtwnLines = (line === 0 && staff === 0) ? halfLineThickness : lineThickness * line + halfLineThickness // the first line of the page needs to escape deadspace at the top
        const posX1 = 0
        const posX2 = width
        const posY1 = line * lineSpacing + spaceBtwnStaves + spaceBtwnLines
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
        if (posY1 > height) {
          return setPageData({
            ...pageData,
            staves: staff,
          })
        }

        linesArray.push(lineProps)
      }

      stavesArray.push(linesArray)
    }

    setStaves(stavesArray)
  }

  useEffect(() => {
    createStaves()
  }, [pageData, maxSvgSize])

  return (
    <>
      {staves.map((staff, index) => (
        <g key={index}>
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
