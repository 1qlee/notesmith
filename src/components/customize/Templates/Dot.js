import React from "react"
import { colors, convertToPx } from "../../../styles/variables"

function Dot({ pageData, pageSize }) {
  const dots = []

  if (pageData.marginTop < 3.175) {
    pageData.marginTop = 3.175
  }
  if (pageData.marginLeft < 3.175) {
    pageData.marginLeft = 3.175
  }

  // loop to create rows of dots
  for (let i = 0; i < pageData.rows; i++) {
    // we will store rows of dots in this array
    const dotRow = []

    // loop to create each individual dot (aka columns) in a row
    for (let ii = 0; ii < pageData.columns; ii++) {
      const dotPos = {
        x: (ii * convertToPx(pageData.spacing)) + convertToPx(pageData.marginLeft),
        y: (i * convertToPx(pageData.spacing)) + convertToPx(pageData.marginTop)
      }
      const dot = {
        fill: "#000",
        radius: pageData.thickness,
        opacity: pageData.opacity,
        cx: dotPos.x,
        cy: dotPos.y
      }

      // loop will exit if the dots have passed the height of the page
      if (dotPos.y > pageSize.height - convertToPx(3.175)) {
        // this essentially caps the number of total rows at the "exceeding" value
        pageData.rows = i
        break
      }
      // loop will exit if the dots have passed the width of the page
      else if (dotPos.x > pageSize.width - convertToPx(3.175)) {
        // this essentially caps the number of dots in a row at the "exceeding" value
        pageData.columns = ii
        break
      }
      else {
        dotRow.push(dot)
      }
    }

    dots.push(dotRow)
  }

  return (
    <g>
      {dots.map((dotRow, index) => (
        <g key={index}>
          {dotRow.map((dot, index) => (
            <circle
              key={index}
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
