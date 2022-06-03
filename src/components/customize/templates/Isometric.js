import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Isometric({
  borderData,
  pageData,
  setPageData,
}) {
  const [linesTop, setLinesTop] = useState([])
  const [linesSides, setLinesSides] = useState([])
  const [lineStyle, setLineStyle] = useState({})
  const lineThickness = convertToPx(pageData.thickness)
  const lineSpacing = convertToPx(pageData.spacing) + convertToPx(pageData.thickness)
  const contentWidth = convertToPx(pageData.contentWidth)
  const contentHeight = convertToPx(pageData.contentHeight)
  const marginLeft = convertToPx(pageData.marginLeft)
  const marginTop = convertToPx(pageData.marginTop)
  const angle = parseInt(pageData.angle)
  const complementaryAngle = 90 - angle

  useEffect(() => {
    function getTan(angle) {
      return Math.tan(angle * Math.PI / 180)
    }
    // create lines that start from the top X-axis
    function createLinesTop() {
      const linesArray = []
      // the amount each line will move on the X-axis
      const lineSpacingTop = getTan(angle) * lineSpacing
      // the total number of lines that fit horizontally across the width of the page
      let numOfLinesTop = contentWidth / lineSpacingTop

      if (contentWidth + marginLeft > pageData.pageWidth) {
        const newContentWidth = contentWidth - marginLeft

        numOfLinesTop = newContentWidth / lineSpacingTop
      }

      for (let numOfLines = 0; numOfLines < numOfLinesTop; numOfLines++) {
        // add one to numOfLines to escape the zero
        const realNumOfLines = numOfLines + 1
        // the side adjacent to the angle of our "triangle" used to calculate the line's x2 position
        // the triangle is formed by extending the line above the top border of the page while maintaining the angle
        const adjacentSide = realNumOfLines * lineSpacing + contentHeight
        const spacing = lineSpacingTop * realNumOfLines
        // the starting x position of the line
        const posX1 = convertFloatFixed(spacing, 3)
        const posX2 = convertFloatFixed(adjacentSide * getTan(angle), 3)
        const invertedPosX1 = convertFloatFixed(contentWidth - posX1, 3)
        let adjustedPosY2
        let adjustedPosX2

        // if the starting point of the line exceeds the width of the page, break out of the loop
        if (posX1 > contentWidth) {
          console.log("width exceeded: ", posX1 + marginLeft)
          break
        }
        // if the ending point of the line exceeds the width of the page, triangulate a new ending point
        // based on an adjacent triangle sharing a complementary angle
        if (posX2 > contentWidth) {
          adjustedPosY2 = convertFloatFixed(invertedPosX1 * getTan(complementaryAngle), 3)
        }

        const lineCoordsOne = {
          x1: posX1,
          y1: 0,
          x2: adjustedPosY2 ? contentWidth : posX2,
          y2: adjustedPosY2 || contentHeight,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        const lineCoordsTwo = {
          x1: invertedPosX1,
          y1: 0,
          x2: adjustedPosY2 ? 0 : contentWidth - posX2,
          y2: adjustedPosY2 || contentHeight,
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
      const numOfLinesSides = (contentHeight) / lineSpacing

      for (let numOfLines = 0; numOfLines < numOfLinesSides; numOfLines++) {
        // starting point of the line on the Y-axis
        const posY1 = convertFloatFixed(numOfLines * lineSpacing, 3)
        // the side adjacent to the angle of our "triangle" used to calculate the line's x2 position
        const adjacentSide = contentHeight - posY1
        // ending point of the line on the X-axis
        let posX2 = convertFloatFixed(adjacentSide * Math.tan(angle * Math.PI / 180), 3)
        let adjustedPosY2

        if (posY1 > contentHeight) {
          break
        }
        // if the ending point of the line exceeds the width of the page, triangulate a new ending point
        // based on an adjacent triangle sharing a complementary angle
        if (posX2 > contentWidth) {
          adjustedPosY2 = convertFloatFixed((contentWidth) * Math.tan(complementaryAngle * Math.PI / 180) + posY1, 3)
        }

        const lineCoordsOne = {
          x1: 0,
          y1: posY1,
          x2: adjustedPosY2 ? contentWidth : posX2,
          y2: adjustedPosY2 || contentHeight,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        const lineCoordsTwo = {
          x1: contentWidth,
          y1: posY1,
          x2: adjustedPosY2 ? 0 : convertFloatFixed(contentWidth - posX2, 3),
          y2: adjustedPosY2 || contentHeight,
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
  }, [pageData, borderData])

  return (
    <svg
      x={marginLeft}
      y={marginTop}
    >
      {borderData.toggle && (
        <rect
          width={contentWidth}
          height={contentHeight}
          strokeWidth={borderData.sync ? lineThickness : convertToPx(borderData.thickness)}
          strokeOpacity={borderData.sync ? pageData.opacity : borderData.opacity}
          fill="none"
          stroke="#000"
        />
      )}
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
    </svg>
  )
}

export default Isometric
