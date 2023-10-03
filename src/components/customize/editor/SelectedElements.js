import React from "react"

import { useEditorContext } from "./context/editorContext"

const SelectedElements = ({
  elements,
}) => {
  const canvasState = useEditorContext()

  return (
    <g
      id="selected-elements"
    >
    </g>
  )
}

export default SelectedElements