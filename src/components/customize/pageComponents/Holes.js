import React, { useEffect, useState } from "react"
import { colors } from "../../../styles/variables"

function Holes({
  currentPageSide,
  canvasPageHeight,
  canvasPageWidth
}) {
  const [holes, setHoles] = useState([])

  function generateHoles() {
    const holesArray = []
    const numOfHoles = (canvasPageHeight - 26) / 26 // page height minus the size of one hole incl margin divided by that same value
    const leftHolesXPosition = canvasPageWidth - 26
    const rightHolesXPosition = 10
    // for loop to generate appropriate number of holes for the page height
    for (let i = 0; i < numOfHoles; i++) {
      // hole property object
      const hole = {
        width: 15.12,
        height: 15.12,
        fill: colors.gray.oneHundred,
        strokeWidth: 1,
        stroke: colors.gray.threeHundred,
        x: currentPageSide === "left" ? leftHolesXPosition : rightHolesXPosition,
        y: 26 * i + 10
      }

      holesArray.push(hole)
    }

    setHoles(holesArray)
  }

  useEffect(() => {
    generateHoles()
  }, [])

  return (
    <g>
      {holes.map((hole, index) => (
        <rect
          key={`hole-${index}`}
          width={hole.width}
          height={hole.height}
          fill={hole.fill}
          x={hole.x}
          y={hole.y}
        >
        </rect>
      ))}
    </g>
  )
}

export default Holes
