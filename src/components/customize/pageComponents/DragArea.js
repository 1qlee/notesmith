import React, { useRef } from "react"

const DragArea = ({
  coords,
}) => {
  const dragAreaRef = useRef(null)

  return (
    <path
      d={`M ${coords.initialX} ${coords.initialY} L ${coords.endX} ${coords.initialY} L ${coords.endX} ${coords.endY} L ${coords.initialX} ${coords.endY} Z`}
    />
  )
}

export default DragArea