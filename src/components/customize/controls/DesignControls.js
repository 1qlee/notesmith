import React from "react"
import { useEditorContext, useEditorDispatch } from "../context/editorContext"

import { ControlFlexWrapper, ControlFlexChild } from "../templateControls/components/TemplateComponents"
import InputControls from "../templateControls/components/InputControls"

const DesignControls = () => {
  const canvasState = useEditorContext()
  const dispatch = useEditorDispatch()
  const bbox = canvasState.bbox

  const handleUpdateBbox = (value, input) => {
    dispatch({
      type: "mutate-selection",
      input: input,
      value: value,
    })
  }

  return (
    <>
      <ControlFlexWrapper>
        <ControlFlexChild
          margin="0 8px 0 0"
          flex={1}
        >
          <InputControls
            input="X"
            value={bbox.x}
            handler={handleUpdateBbox}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={1}
        >
          <InputControls
            input="Y"
            value={bbox.y}
            handler={handleUpdateBbox}
          />
        </ControlFlexChild>
      </ControlFlexWrapper>
      <ControlFlexWrapper>
        <ControlFlexChild
          margin="0 8px 0 0"
          flex={1}
        >
          <InputControls
            input="Width"
            value={bbox.width}
            handler={handleUpdateBbox}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={1}
        >
          <InputControls
            input="Height"
            value={bbox.height}
            handler={handleUpdateBbox}
          />
        </ControlFlexChild>
      </ControlFlexWrapper>
    </>
  )
}

export default DesignControls