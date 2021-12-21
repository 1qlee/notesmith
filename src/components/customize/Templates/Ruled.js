import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM } from "../../../styles/variables"

function Ruled({
  pageData,
  setPageData,
  currentPageSide,
}) {
  const [rules, setRules] = useState([])

  function createRules() {
    const rulesArray = []

    for (let i = 0; i < pageData.rows; i++) {
      // calculations and conversions to px
      const lineX1 = convertToPx(pageData.marginLeft)
      const lineX2 = pageData.pageWidth - convertToPx(pageData.marginRight)
      const lineY = (i * convertToPx(pageData.spacing)) + convertToPx(pageData.marginTop)
      const lineThickness = convertToPx(pageData.thickness)
      // line object
      const line = {
        fill: "none",
        stroke: "#000",
        strokeWidth: lineThickness,
        opacity: pageData.opacity,
        x1: lineX1,
        x2: lineX2,
        y1: lineY,
        y2: lineY
      }

      // loop will exit if the last line has passed the height of the page
      if (lineY > pageData.pageHeight) {
        console.log("lines have passed the height of the page")
        console.log(lineY, pageData.pageHeight)
        // change the number of rows displayed
        setPageData({
          ...pageData,
          rows: i,
        })
        break
      }
      else {
        rulesArray.push(line)
      }
    }

    setRules(rulesArray)
  }

  useEffect(() => {
    createRules()
  }, [pageData])

  return (
    <g>
      {rules.map((line, index) => (
        <line
          key={index}
          fill={line.fill}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          style={{opacity: `${line.opacity}`}}
          x1={line.x1}
          x2={line.x2}
          y1={line.y1}
          y2={line.y2}
        >
        </line>
      ))}
    </g>
  )
}

export default Ruled
