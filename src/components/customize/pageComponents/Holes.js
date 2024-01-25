import React, { useEffect, useState } from "react"
import { colors } from "../../../styles/variables"

function Holes({
  currentPageSide,
  pageHeight,
  pageWidth,
}) {
  const [holes, setHoles] = useState([])

  function generateHoles() {
    const holesArray = []
    const verticalMargin = 30.24 // 8mm on top and bottom of holes
    const holeSize = 15.12 // 4mm square
    const numOfHoles = (pageHeight - verticalMargin * 2) / (holeSize * 2) // holeSize is equal to the space btwn each hole
    const leftHolesXPosition = pageWidth - holeSize * 2
    const rightHolesXPosition = 11.34 // left margin
    // for loop to generate appropriate number of holes for the page height
    for (let i = 0; i < numOfHoles; i++) {
      // hole property object
      const hole = {
        width: holeSize,
        height: holeSize,
        fill: colors.white,
        strokeWidth: 1,
        stroke: colors.gray.threeHundred,
        x: currentPageSide === "left" ? leftHolesXPosition : rightHolesXPosition,
        y: verticalMargin + holeSize * 2 * i
      }

      holesArray.push(hole)
    }

    setHoles(holesArray)
  }

  useEffect(() => {
    generateHoles()
  }, [currentPageSide])

  return (
    <g>
      {holes.map((hole, index) => (
        <rect
          key={`hole-${index}`}
          width={hole.width}
          height={hole.height}
          fill={hole.fill}
          stroke={hole.stroke}
          strokeWidth={hole.strokeWidth}
          x={hole.x}
          y={hole.y}
        >
        </rect>
      ))}
    </g>
  )
}

export default Holes
