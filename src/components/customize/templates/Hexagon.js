import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Hexagon({
  pageData,
  setPageData,
}) {
  const [hexagons, setHexagons] = useState([])

  useEffect(() => {
    function createHexagons() {
      // creates the shape of the hexagon by generating its points
      function createPoints(x, y, radius, col, row) {
        const pointsArray = []

        for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
          // each point is a pair of x and y coordinates
          const pointX = convertFloatFixed(x + radius * Math.sin(theta), 2)
          const pointY = convertFloatFixed(y + radius * Math.cos(theta), 2)

          // dont let rows or columns pass the length of the page plus a hexagon (length) and a half
          if (pointX > pageData.pageWidth + radius * 2.5) {
            return { col: col }
          }
          else if (pointY > pageData.pageHeight + radius * 2.5) {
            return { row: row }
          }
          else {
            pointsArray.push(pointX + ',' + pointY)
          }
        }

        return pointsArray.join(' ')
      }

      const hexagonsArray = []
      const radius = convertToPx(pageData.hexagonRadius)
      const strokeWidth = convertToPx(pageData.thickness)
      const marginLeft = convertToPx(pageData.marginLeft)
      const marginTop = convertToPx(pageData.marginTop)

      for (let col = 0; col < pageData.columns; col++) {
        for (let row = 0; row < pageData.rows; row++) {
          const offset = (Math.sqrt(3) * radius) / 2
          let x = marginLeft + offset * col * 2
          let y = marginTop + offset * row * Math.sqrt(3) + strokeWidth

          if (row % 2 !== 0) {
            x += offset
          }

          const points = createPoints(x, y, radius, col, row)

          if (points.col) {
            return setPageData({
              ...pageData,
              columns: col,
            })
          }
          else if (points.row) {
            return setPageData({
              ...pageData,
              rows: row,
            })
          }
          else {
            const hexagon = {
              fill: "none",
              stroke: "#000",
              strokeWidth: strokeWidth,
              points: points,
              opacity: pageData.opacity,
            }

            hexagonsArray.push(hexagon)
          }
        }
      }

      setHexagons(hexagonsArray)
    }

    createHexagons()
  }, [pageData])

  return (
    <>
      {hexagons.map((hex, index) => (
        <polygon
          key={index}
          fill={hex.fill}
          stroke={hex.stroke}
          strokeWidth={hex.strokeWidth}
          points={hex.points}
          opacity={hex.opacity}
        />
      ))}
    </>
  )
}

export default Hexagon
