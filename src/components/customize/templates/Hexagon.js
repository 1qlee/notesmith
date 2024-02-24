import React, { useState, useEffect } from "react"
import { convertToPx, convertFloatFixed } from "../../../utils/helper-functions"

function Hexagon({
  maxSvgSize,
  pageData,
  setPageData,
  setMax,
  setSvgLoaded,
}) {
  const { hexagonRadius, strokeWidth, rows, opacity, columns } = pageData
  const { width, height } = maxSvgSize
  const hexRadius = convertToPx(hexagonRadius)
  const hexStrokeWidth = convertToPx(strokeWidth)
  const halfHexStrokeWidth = hexStrokeWidth / 2
  const yStrokeOffset = Math.sqrt(2 * hexStrokeWidth**2) / 2
  const coeff = Math.sqrt(3)
  const hexWidth = coeff * hexRadius
  const adjustedHexHeight = hexRadius * 3
  const yOffset = adjustedHexHeight / 2
  const xOffset = hexWidth / 2
  const oddColsMax = Math.floor(width / hexWidth)
  const evenColsMax = Math.floor((width - hexWidth / 2) / hexWidth)
  const maxColumns = oddColsMax + evenColsMax
  const maxRows = Math.floor((height - (hexRadius / 2)) / (hexRadius * 1.5))
  const [hexagons, setHexagons] = useState([])

  function createHexagons() {
    // creates the shape of the hexagon by generating its points
    function createPoints(x, y, radius, col, row) {
      const pointsArray = []

      for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
        // each point is a pair of x and y coordinates
        const pointX = convertFloatFixed(x + radius * Math.sin(theta), 3)
        const pointY = convertFloatFixed(y + radius * Math.cos(theta), 3)

        if (pointX > width) {
          return { col: col }
        }
        if (pointY > height) {
          console.log(pointY)
          return { row: row }
        }
        else {
          if (theta === 0) {
            pointsArray.push(`M${pointX} ${pointY}`)
          }
          else {
            pointsArray.push(`L${pointX} ${pointY}`)
          }
        }
      }

      const joinedPoints = pointsArray.join(' ')

      return joinedPoints
    }

    const hexagonsArray = []

    for (let column = 0; column < columns; column++) {
      for (let row = 0; row < rows; row++) {
        let x = xOffset * column + halfHexStrokeWidth + xOffset
        let y = yOffset * row + hexRadius + yStrokeOffset
        let points = ""

        // if col is even and row is even
        if (column % 2 === 0 && row % 2 === 0) {
          points = createPoints(x, y, hexRadius, column, row)
        }
        // if col is odd and row is odd
        if (column % 2 !== 0 && row % 2 !== 0) {
          points = createPoints(x, y, hexRadius, column, row)
        }

        if (points.row) {
          return setPageData({
            ...pageData,
            rows: row,
          })
        }
        else if (points.col) {
          return setPageData({
            ...pageData,
            columns: column,
          })
        }
        else {
          if (points) {
            const hexagon = {
              stroke: "#000000",
              strokeWidth: hexStrokeWidth,
              points: points,
              opacity: `${opacity}%`,
            }

            hexagonsArray.push(hexagon)
          }
        }
      }
    }

    setHexagons(hexagonsArray)
  }

  useEffect(() => {
    createHexagons()
    setMax({
      columns: maxColumns,
      rows: maxRows,
    })

    setSvgLoaded(true)
  }, [pageData])

  return (
    <>
      {hexagons.map((hex, index) => (
        <path
          key={index}
          fill={hex.fill}
          stroke={hex.stroke}
          strokeWidth={hex.strokeWidth}
          strokeLinecap="round"
          d={hex.points}
          opacity={hex.opacity}
          id={`svg_${index + 1}`}
        />
      ))}
    </>
  )
}

export default Hexagon
