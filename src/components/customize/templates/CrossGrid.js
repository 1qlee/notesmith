import React, { useState, useEffect } from "react"
import { colors, convertToPx, convertFloatFixed } from "../../../styles/variables"

function CrossGrid({ 
  pageData, 
  setPageData 
}) {
  const [crosses, setCrosses] = useState([])
  const crossSize = convertToPx(pageData.size)
  const spacing = convertToPx(pageData.spacing)
  const marginTop = convertToPx(pageData.marginTop)
  const marginLeft = convertToPx(pageData.marginLeft)
  const thickness = convertToPx(pageData.thickness)

  function createCrosses() {
    // placeholder array for crosses
    const crossesArray = []
    const crossRadius = crossSize / 2
    // loop to create rows of crosses
    for (let row = 0; row < pageData.rows; row++) {
      // placeholder array for rows of crosses
      const crossesRow = []
      // object to hold cross position coordinates
      const crossPos = {
        x1: 0,
        x2: 0,
        x3: 0,
        x4: 0,
        y1: (row * spacing) + (crossSize * row + 1) + marginTop,
        y2: 0,
        y3: 0,
        y4: 0,
      }
      crossPos.y2 = crossPos.y1 + crossSize
      crossPos.y3 = crossPos.y1 + crossRadius
      crossPos.y4 = crossPos.y3
      // loop will exit if the crosses have passed the height of the page
      if (crossPos.y2 > pageData.pageHeight) {
        // this essentially caps the number of total rows at the "exceeding" value
        setPageData({
          ...pageData,
          rows: row,
        })
        break
      }
      // loop to create each individual cross (aka columns) in a row
      for (let column = 0; column < pageData.columns; column++) {
        // update cross's X position
        crossPos.x1 = (column * spacing) + crossRadius * (column + 1) + (crossRadius * column) + marginLeft
        crossPos.x2 = crossPos.x1
        crossPos.x3 = (column * spacing) + (crossSize * column) + marginLeft
        crossPos.x4 = crossPos.x3 + crossSize
        // create cross object with appropriate properties
        const cross = {
          stroke: "#000",
          opacity: pageData.opacity,
          ...crossPos,
        }

        // loop will exit if the crosses have passed the width of the page
        if (crossPos.x4 > pageData.pageWidth) {
          // this essentially caps the number of crosses in a column at the "exceeding" value
          setPageData({
            ...pageData,
            columns: column,
          })
          break
        }
        else {
          crossesRow.push(cross)
        }
      }

      crossesArray.push(crossesRow)
    }

    setCrosses(crossesArray)
  }


  useEffect(() => {
    createCrosses()
  }, [pageData])

  return (
    <>
      {crosses.map((cross, index) => (
        <g key={index}>
          {cross.map((cross, index) => (
            <path
              d={`M ${cross.x1} ${cross.y1} L ${cross.x2} ${cross.y2} M ${cross.x3} ${cross.y3} L ${cross.x4} ${cross.y4}`}
              key={`cross-${index}`}
              opacity={cross.opacity}
              strokeWidth={0.333}
              stroke={cross.stroke}
            />
          ))}
        </g>
      ))}
    </>
  )
}

export default CrossGrid
