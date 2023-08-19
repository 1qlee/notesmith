import React from "react"

const Selection = ({
  position,
  path,
}) => {

  return (
    <g 
      id="selection-group"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <path 
        id="selection-path"
        d={path}
      />
    </g>
  )
}

export default Selection