import React, { useRef } from "react"

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