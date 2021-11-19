import React, { useState, useEffect } from "react"
import { colors, convertToPx } from "../../../styles/variables"

function Dot({ pageData, setPageData }) {
  const [dots, setDots] = useState([])

  function createDots() {
    // placeholder array for dots
    const dotsArray = []
    // loop to create rows of dots
    for (let i = 0; i < pageData.rows; i++) {
      // placeholder array for rows of dots
      const dotsRow = []
      // object to hold dot position coordinates
      const dotPos = {
        y: (i * convertToPx(pageData.spacing)) + convertToPx(pageData.marginTop),
        x: 0,
      }
      // loop will exit if the dots have passed the height of the page
      if (dotPos.y > pageData.pageHeight - convertToPx(3.175)) {
        // this essentially caps the number of total rows at the "exceeding" value
        setPageData({
          ...pageData,
          rows: i,
        })
        break
      }
      // loop to create each individual dot (aka columns) in a row
      for (let ii = 0; ii < pageData.columns; ii++) {
        // update dot's X position
        dotPos.x = (ii * convertToPx(pageData.spacing)) + convertToPx(pageData.marginLeft)
        // create dot object with appropriate properties
        const dot = {
          fill: "#000",
          radius: pageData.dotRadius,
          opacity: pageData.opacity,
          cx: dotPos.x,
          cy: dotPos.y
        }

        // loop will exit if the dots have passed the width of the page
        if (dotPos.x > pageData.pageWidth - convertToPx(3.175)) {
          // this essentially caps the number of dots in a row at the "exceeding" value
          setPageData({
            ...pageData,
            columns: ii,
          })
          break
        }
        else {
          dotsRow.push(dot)
        }
      }

      dotsArray.push(dotsRow)
    }

    setDots(dotsArray)
  }


  useEffect(() => {
    createDots()
  }, [pageData])

  return (
    <g>
      {dots.map((row, index) => (
        <g key={`row-${index}`}>
          {row.map((dot, index) => (
            <circle
              key={`dot-${index}`}
              fill={dot.fill}
              r={dot.radius}
              style={{opacity: `${dot.opacity}`}}
              cx={dot.cx}
              cy={dot.cy}
            >
            </circle>
          ))}
        </g>
      ))}
    </g>
  )
}

export default Dot
