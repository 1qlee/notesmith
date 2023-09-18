import React from "react"

const Selection = ({
  position,
  path,
}) => {

  return (
    <g 
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