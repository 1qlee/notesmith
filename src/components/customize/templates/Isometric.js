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
  const { angle } = pageData

  useEffect(() => {
    function createLinesTop() {
      const linesArray = []
      let index = 1

      for (let posX = lineSpacing; posX < pageData.pageHeight; posX += lineSpacing) {
        const additionalWidth = Math.tan(angle * Math.PI / 180) * lineSpacing * index
        const adjacentSide = pageData.pageHeight + additionalWidth
        let posX2 = adjacentSide * Math.tan(angle * Math.PI / 180)

        const lineCoordsOne = {
          x1: additionalWidth,
          y1: 0,
          x2: posX2,
          y2: pageData.pageHeight,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        const lineCoordsTwo = {
          x1: pageData.pageWidth - additionalWidth,
          y1: 0,
          x2: pageData.pageWidth - posX2,
          y2: pageData.pageHeight,
          fill: "none",
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: pageData.opacity,
        }

        linesArray.push(lineCoordsOne, lineCoordsTwo)
        index++
      }

      setLinesTop(linesArray)
    }

    function createLinesSides() {
      const linesArray = []

      for (let posY = 0; posY < pageData.pageHeight; posY += lineSpacing) {
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

    setLinesSides(linesArray)
  }

    createLinesTop()
    createLinesSides()
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
