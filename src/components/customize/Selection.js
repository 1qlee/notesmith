import React from "react"

import { useEditorContext } from "./context/editorContext"

const Selection = ({
  position,
}) => {
  const canvasState = useEditorContext()

  return (
    <g 
      id="selection-group"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <path 
        id="selection-path"
        d={canvasState.selectionPath}
      />
    </g>
  )
}

export default Selection