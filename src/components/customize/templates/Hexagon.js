import React, { useState, useEffect } from "react"
import { convertToPx, convertFloatFixed } from "../../../styles/variables"

function Hexagon({
  maxSvgSize,
  pageData,
  setPageData,
}) {
  const { hexagonRadius, thickness, rows, opacity } = pageData
  const { width, height } = maxSvgSize
  const hexRadius = convertToPx(hexagonRadius)
  const hexThickness = convertToPx(thickness)
  const hexWidth = Math.sqrt(3) * hexRadius
  const [hexagons, setHexagons] = useState([])

  useEffect(() => {
    function createHexagons() {
      // creates the shape of the hexagon by generating its points
      function createPoints(x, y, radius, row) {
        const pointsArray = []

        for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
          // each point is a pair of x and y coordinates
          const pointX = convertFloatFixed(x + radius * Math.sin(theta), 2)
          const pointY = convertFloatFixed(y + radius * Math.cos(theta), 2)

          if (pointX > width) {
            return { row: null }
          }
          if (pointY > height) {
            return { row: row }
          }
          else {
            pointsArray.push(pointX + ',' + pointY)
          }
        }

        return pointsArray.join(' ')
      }

      const hexagonsArray = []

      for (let row = 0; row < rows; row++) {
        const numOfCols = Math.floor(width / hexWidth)
        const halfHexThickness = hexThickness / 2

        for (let col = 0; col < numOfCols; col++) {
          const offset = hexWidth / 2
          let x = offset + offset * col * 2 + halfHexThickness
          let y = hexRadius + offset * row * Math.sqrt(3) + halfHexThickness

          if (row % 2 !== 0) {
            x += offset
          }

          const points = createPoints(x, y, hexRadius, row)

          if (points.row) {
            return setPageData({
              ...pageData,
              rows: row,
            })
          }
          else {
            const hexagon = {
              stroke: "#000",
              strokeWidth: hexThickness,
              points: points,
              opacity: opacity,
            }

            hexagonsArray.push(hexagon)
          }
        }
      }

      setHexagons(hexagonsArray)
    }

    createHexagons()
  }, [pageData, maxSvgSize])

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
