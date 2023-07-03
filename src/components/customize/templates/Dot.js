import React, { useState, useEffect } from "react"
import { convertToPx, convertFloatFixed } from "../../../styles/variables"

function Dot({ 
  maxSvgSize,
  pageData, 
  setPageData 
}) {
  const [dots, setDots] = useState([])
  const { radius, columns, rows, opacity, rowSpacing, columnSpacing } = pageData
  const { height, width } = maxSvgSize
  const dotRadius = convertToPx(radius)
  const dotColumnSpacing = convertToPx(columnSpacing)
  const dotRowSpacing = convertToPx(rowSpacing)

  function createDots() {
    // placeholder array for dots
    const dotsArray = []

    // loop to create rows of dots
    for (let i = 0; i < rows; i++) {
      // object to hold dot position coordinates
      const dotPos = {
        y: (i * dotRowSpacing) + dotRadius * (i + 1),
        x: 0,
      }
      // loop will exit if the dots have passed the height of the page
      if (dotPos.y > height) {
        // this essentially caps the number of total rows at the "exceeding" value
        return setPageData({
          ...pageData,
          rows: i,
        })
      }

      // loop to create each individual dot (aka columns) in a row
      for (let ii = 0; ii < columns; ii++) {
        // update dot's X position
        dotPos.x = (ii * dotColumnSpacing) + dotRadius * (ii + 1)
        // create dot object with appropriate properties
        const dot = {
          fill: "#000",
          radius: dotRadius,
          opacity: opacity,
          cx: convertFloatFixed(dotPos.x, 3),
          cy: convertFloatFixed(dotPos.y, 3),
          row: i,
        }

        // loop will exit if the dots have passed the width of the page
        if (dotPos.x > width) {
          // this essentially caps the number of dots in a row at the "exceeding" value
          return setPageData({
            ...pageData,
            columns: ii,
          })
        }
        else {
          dotsArray.push(dot)
        }
      }
    }

    setDots(dotsArray)
  }


  useEffect(() => {
    createDots()
  }, [pageData, maxSvgSize])

  return (
    <>
      {dots.map((dot, index) => (
        <circle
          key={`${dot.row}-${index}`}
          fill={dot.fill}
          r={dot.radius}
          opacity={dot.opacity}
          cx={dot.cx}
          cy={dot.cy}
        >
        </circle>
      ))}
    </>
  )
}

export default Dot