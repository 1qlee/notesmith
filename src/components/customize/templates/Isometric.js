import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Isometric({
  pageData,
  setPageData,
}) {
  const [linesTop, setLinesTop] = useState([])
  const [linesSides, setLinesSides] = useState([])
  const [lineStyle, setLineStyle] = useState({})
  const lineThickness = convertToPx(pageData.thickness)
  const lineSpacing = convertToPx(pageData.spacing)
  const { pageWidth, pageHeight } = pageData
  const angle = parseInt(pageData.angle)
  const complementaryAngle = 90 - angle

  useEffect(() => {
    function createLinesTop() {
      const linesArray = []
      // the amount each line will move on the X axis
      const lineSpacingTop = Math.tan(angle * Math.PI / 180) * lineSpacing
      // the total number of lines that must be created
      const numOfLinesTop = pageWidth / lineSpacingTop

      for (let numOfLines = 0; numOfLines < numOfLinesTop; numOfLines++) {
        // add one to numOfLines to escape the zero
        const realNumOfLines = numOfLines + 1
        // the side adjacent to the angle of our "triangle" used to calculate the line's x2 position
        const adjacentSide = realNumOfLines * lineSpacing + pageHeight
        // the starting x position of the line
        const posX1 = lineSpacingTop * realNumOfLines
        const posX2 = adjacentSide * Math.tan(angle * Math.PI / 180)
        const invertedPosX1 = pageWidth - posX1
        let adjustedPosY2

        // if the starting point of the line exceeds the width of the page, break out of the loop
        if (posX1 > pageWidth) {
          break
        }
        // if the ending point of the line exceeds the width of the page, triangulate a new ending point
        // based on a smaller "triangle"
        if (posX2 > pageWidth) {
          adjustedPosY2 = invertedPosX1 * Math.tan(complementaryAngle * Math.PI / 180)
          console.log("x2", adjustedPosY2)
        }

        const lineCoordsOne = {
          x1: posX1,
          y1: 0,
          x2: adjustedPosY2 ? pageWidth : posX2,
          y2: adjustedPosY2 || pageHeight,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        const lineCoordsTwo = {
          x1: invertedPosX1,
          y1: 0,
          x2: adjustedPosY2 ? 0 : pageWidth - posX2,
          y2: adjustedPosY2 || pageHeight,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        linesArray.push(lineCoordsOne, lineCoordsTwo)
      }

      setLinesTop(linesArray)
    }

    function createLinesSides() {
      const linesArray = []
      // the total number of lines that must be created
      const numOfLinesSides = pageHeight / lineSpacing

      for (let numOfLines = 0; numOfLines < numOfLinesSides; numOfLines++) {
        // the side adjacent to the angle of our "triangle" used to calculate the line's x2 position
        const posY1 = numOfLines * lineSpacing
        const adjacentSide = pageHeight - numOfLines * lineSpacing
        let posX2 = adjacentSide * Math.tan(angle * Math.PI / 180)
        let adjustedPosY2

        if (posX2 > pageWidth) {
          adjustedPosY2 = pageWidth * Math.tan(complementaryAngle * Math.PI / 180) + posY1
        }

        const lineCoordsOne = {
          x1: 0,
          y1: posY1,
          x2: adjustedPosY2 ? pageWidth : posX2,
          y2: adjustedPosY2 || pageHeight,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        const lineCoordsTwo = {
          x1: pageWidth,
          y1: posY1,
          x2: adjustedPosY2 ? 0 : pageWidth - posX2,
          y2: adjustedPosY2 || pageHeight,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        linesArray.push(lineCoordsOne, lineCoordsTwo)
      }

    setLinesSides(linesArray)
  }

    createLinesTop()
    createLinesSides()
  }, [pageData])

  return (
    <>
      <rect
        width={pageWidth}
        height={pageHeight}
        strokeWidth={lineThickness}
        strokeOpacity={pageData.opacity}
        fill="none"
        stroke="#000"
      />
      {linesTop.map((line, index) => (
        <line
          fill={line.fill}
          key={index}
          opacity={line.opacity}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
        />
      ))}
      {linesSides.map((line, index) => (
        <line
          fill={line.fill}
          key={index}
          opacity={line.opacity}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
        />
      ))}
    </>
  )
}

export default Isometric
