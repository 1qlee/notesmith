import React, { useEffect, useRef } from "react"
import { SVG } from '@svgdotjs/svg.js'

const Selection = ({
  position,
  path,
}) => {
  const selectionPathRef = useRef(null)



  return (
    <g 
      ref={selectionPathRef}
      id="selection-path"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <path 
        d={path}
      />
    </g>
  )
}

export default Selection