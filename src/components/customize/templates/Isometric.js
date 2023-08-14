import React, { useState, useEffect } from "react"
import { convertToPx, convertFloatFixed } from "../../../utils/helper-functions"

function Isometric({
  pageData,
  setPageData,
  maxSvgSize,
}) {
  const [linesTop, setLinesTop] = useState([])
  const [linesSides, setLinesSides] = useState([])
  const { strokeWidth, opacity, spacing, borderData } = pageData
  const { width, height } = maxSvgSize
  const contentHeight = height
  const contentWidth = width
  const lineStrokeWidth = convertToPx(strokeWidth)
  const halfLineStrokeWidth = lineStrokeWidth / 2
  const borderStrokeWidth = convertToPx(borderData.strokeWidth)
  const halfBorderStrokeWidth = borderStrokeWidth / 2
  const syncedBorderWidth = borderData.sync ? halfLineStrokeWidth : halfBorderStrokeWidth
  const lineSpacing = convertToPx(spacing) + lineStrokeWidth
  const angle = parseInt(pageData.angle)
  const complementaryAngle = 90 - angle
  const borderPosition = {
    x: syncedBorderWidth,
    y: syncedBorderWidth,
    x2: contentWidth - syncedBorderWidth,
    y2: contentHeight - syncedBorderWidth,
  }
  const adjustedWidth = contentWidth - halfLineStrokeWidth

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
      let numOfLinesTop = Math.floor(contentWidth / lineSpacingTop)

      for (let numOfLines = 0; numOfLines < numOfLinesTop; numOfLines++) {
        // add one to numOfLines to escape the zero
        const realNumOfLines = numOfLines + 1
        // the side adjacent to the angle of our "triangle" used to calculate the line's x2 position
        // the triangle is formed by extending the line above the top border of the page while maintaining the angle
        const adjacentSide = realNumOfLines * lineSpacing + contentHeight
        const spacing = lineSpacingTop * realNumOfLines
        // the starting x position of the line
        const posX1 = convertFloatFixed(spacing, 3)
        const posX2 = convertFloatFixed(adjacentSide * getTan(angle), 3) - halfLineStrokeWidth
        const invertedPosX1 = convertFloatFixed(contentWidth - posX1, 3)
        let adjustedPosY2

        // if the ending point of the line exceeds the width of the page, triangulate a new ending point
        // based on an adjacent triangle sharing a complementary angle
        if (posX2 > contentWidth) {
          adjustedPosY2 = convertFloatFixed(invertedPosX1 * getTan(complementaryAngle), 3)
        }

        // lines going left to right (diagonally)
        const lineCoordsOne = {
          x1: posX1,
          y1: 0,
          x2: adjustedPosY2 ? adjustedWidth : posX2,
          y2: adjustedPosY2 || contentHeight,
          stroke: "#000",
          strokeWidth: lineStrokeWidth,
          opacity: opacity,
        }

        // lines going right to left (diagonally)
        const lineCoordsTwo = {
          x1: invertedPosX1,
          y1: 0,
          x2: adjustedPosY2 ? halfLineStrokeWidth : contentWidth - posX2,
          y2: adjustedPosY2 || contentHeight,
          stroke: "#000",
          strokeWidth: lineStrokeWidth,
          opacity: opacity,
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
        let posX2 = convertFloatFixed(adjacentSide * Math.tan(angle * Math.PI / 180), 3) - halfLineStrokeWidth
        let adjustedPosY2

        if (posY1 > contentHeight) {
          break
        }
        // if the ending point of the line exceeds the width of the page, triangulate a new ending point
        // based on an adjacent triangle sharing a complementary angle
        if (posX2 > contentWidth) {
          adjustedPosY2 = convertFloatFixed((contentWidth) * Math.tan(complementaryAngle * Math.PI / 180) + posY1, 3)
        }

        // lines on left side
        const lineCoordsOne = {
          x1: 0,
          y1: posY1,
          x2: adjustedPosY2 ? adjustedWidth : posX2,
          y2: adjustedPosY2 || contentHeight,
          stroke: "#000",
          strokeWidth: lineStrokeWidth,
          opacity: opacity,
        }

        // lines on right side
        const lineCoordsTwo = {
          x1: adjustedWidth,
          y1: posY1,
          x2: adjustedPosY2 ? halfLineStrokeWidth : convertFloatFixed(contentWidth - posX2, 3),
          y2: adjustedPosY2 || contentHeight,
          stroke: "#000",
          strokeWidth: lineStrokeWidth,
          opacity: opacity,
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
      {linesTop.map((line, index) => (
        <path
          key={index}
          opacity={line.opacity}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          d={`M${line.x1} ${line.y1} L${line.x2} ${line.y2}`}
        />
      ))}
      {linesSides.map((line, index) => (
        <path
          key={index}
          opacity={line.opacity}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          d={`M${line.x1} ${line.y1} L${line.x2} ${line.y2}`}
        />
      ))}
      {borderData.toggle && (
        <>
          <path 
            d={`M 0,${borderPosition.y} L ${contentWidth},${borderPosition.y} z`}
            strokeWidth={borderData.sync ? lineStrokeWidth : borderStrokeWidth}
            strokeOpacity={borderData.sync ? opacity : borderData.opacity}
            stroke="#000"
          />
          <path
            d={`M ${borderPosition.x2},0 L ${borderPosition.x2},${contentHeight} z`}
            strokeWidth={borderData.sync ? lineStrokeWidth : borderStrokeWidth}
            strokeOpacity={borderData.sync ? opacity : borderData.opacity}
            stroke="#000"
          />
          <path
            d={`M ${contentWidth},${borderPosition.y2} L 0,${borderPosition.y2} z`}
            strokeWidth={borderData.sync ? lineStrokeWidth : borderStrokeWidth}
            strokeOpacity={borderData.sync ? opacity : borderData.opacity}
            stroke="#000"
          />
          <path
            d={`M ${borderPosition.x},${contentHeight} L ${borderPosition.x},0 z`}
            strokeWidth={borderData.sync ? lineStrokeWidth : borderStrokeWidth}
            strokeOpacity={borderData.sync ? opacity : borderData.opacity}
            stroke="#000"
          />
        </>
      )}
    </>
  )
}

export default Isometric
