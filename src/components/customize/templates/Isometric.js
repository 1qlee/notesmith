import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Isometric({
  pageData,
  setPageData,
}) {
  const [lines, setLines] = useState([])
  const [linesTwo, setLinesTwo] = useState([])
  const [lineStyle, setLineStyle] = useState({})
  const lineThickness = convertToPx(pageData.thickness)
  const lineSpacing = convertToPx(pageData.spacing)
  const { angle } = pageData

  useEffect(() => {
    function createLines() {
      const linesArray = []

      for (let posX = 0; posX < pageData.pageWidth; posX += lineSpacing) {
        const sideLength = pageData.pageWidth - posX
        let posY = sideLength * Math.tan(angle * Math.PI / 180)

        const lineCoordsOne = {
          x1: posX,
          y1: 0,
          x2: pageData.pageWidth,
          y2: posY,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        const lineCoordsTwo = {
          x1: sideLength,
          y1: 0,
          x2: 0,
          y2: posY,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        const lineCoordsThree = {
          x1: posX,
          y1: pageData.pageHeight,
          x2: pageData.pageWidth,
          y2: pageData.pageHeight - posY,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        const lineCoordsFour = {
          x1: sideLength,
          y1: pageData.pageHeight,
          x2: 0,
          y2: pageData.pageHeight - posY,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        linesArray.push(lineCoordsOne, lineCoordsTwo, lineCoordsThree, lineCoordsFour)
      }

      setLines(linesArray)
    }

    function createLinesTwo() {
      const linesArray = []

      for (let posY = -pageData.pageHeight; posY < pageData.pageHeight; posY += lineSpacing) {
        const sideLength = pageData.pageHeight - posY
        let posX = sideLength * Math.tan(angle * Math.PI / 180)

        const lineCoordsOne = {
          x1: 0,
          y1: posY,
          x2: posX,
          y2: pageData.pageHeight,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        const lineCoordsTwo = {
          x1: pageData.pageWidth,
          y1: posY,
          x2: pageData.pageWidth - posX,
          y2: pageData.pageHeight,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        linesArray.push(lineCoordsOne, lineCoordsTwo)
      }

    setLinesTwo(linesArray)
  }

    createLinesTwo()
  }, [pageData])

  return (
    <>
      <rect
        width={pageData.pageWidth}
        height={pageData.pageHeight}
        strokeWidth={lineThickness}
        strokeOpacity={pageData.opacity}
        fill="none"
        stroke="#000"
      />
      {lines.map((line, index) => (
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
      {linesTwo.map((line, index) => (
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
