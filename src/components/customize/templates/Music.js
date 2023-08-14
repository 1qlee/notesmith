import React, { useState, useEffect } from "react"
import { convertToPx, convertFloatFixed } from "../../../utils/helper-functions"

function Music({
  maxSvgSize,
  pageData,
  setPageData,
  setMax,
}) {
  const [staves, setStaves] = useState([])
  const { opacity, spacing, strokeWidth} = pageData
  const { height, width } = maxSvgSize
  const lineSpacing = convertToPx(spacing)
  const lineStrokeWidth = convertToPx(strokeWidth)
  const halfLineStrokeWidth = lineStrokeWidth / 2
  const staffSpacing = convertToPx(pageData.staffSpacing)
  const staffHeight = lineSpacing * 4 + lineStrokeWidth * 4 // staff always has 5 lines, but multiply by 4 since first line doesn't count
  const maxStaves = Math.floor((height + staffSpacing - halfLineStrokeWidth) / (staffHeight + staffSpacing))

  function createStaves() {
    const stavesArray = []

    for (let staff = 0; staff < pageData.staves; staff++) {
      const linesArray = []

      for (let line = 0; line < 5; line++) {
        const spaceBtwnStaves = staff * (staffSpacing + staffHeight + lineStrokeWidth) // have to add lineStrokeWidth to escape the previous staff's last line
        const spaceBtwnLines = (line === 0 && staff === 0) ? halfLineStrokeWidth : lineStrokeWidth * line + halfLineStrokeWidth // the first line of the page needs to escape deadspace at the top
        const posX1 = 0
        const posX2 = width
        const posY1 = line * lineSpacing + spaceBtwnStaves + spaceBtwnLines
        const posY2 = posY1
        const lineProps = {
          stroke: "#000",
          strokeWidth: lineStrokeWidth,
          opacity: opacity,
          x1: convertFloatFixed(posX1, 3),
          x2: convertFloatFixed(posX2, 3),
          y1: convertFloatFixed(posY1, 3),
          y2: convertFloatFixed(posY2, 3),
        }

        // break the loop if we are past the height of the page
        if (posY1 + halfLineStrokeWidth > height) {
          console.log("🚀 ~ file: Music.js:47 ~ createStaves ~ posY1:", posY1)
          
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
    setMax({
      staves: maxStaves,
    })
  }, [pageData])

  return (
    <>
      {staves.map((staff, index) => (
        <g key={index}>
          {staff.map((line, index) => (
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
        </g>
      ))}
    </>
  )
}

export default Music
