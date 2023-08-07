import React, { useState, useEffect } from "react"
import { useEditorContext, useEditorDispatch } from "../context/editorContext"

import { ControlFlexWrapper, ControlFlexChild } from "../templateControls/components/TemplateComponents"
import InputControls from "../templateControls/components/InputControls"

const DesignControls = () => {
  const canvasState = useEditorContext()
  const dispatch = useEditorDispatch()
  const selectedElements = canvasState.selectedElements
  const selectionBox = canvasState.selectionBox
  const [bbox, setBbox] = useState({})

  // function to manipulate the selected elements
  const handleUpdateBbox = (value, input) => {
    const formattedInput = input.toLowerCase()
    // update the bbox values
    setBbox({
      ...bbox,
      [formattedInput]: value,
    })

    // loop through selected elements and perform mutation
    selectedElements.forEach((ele) => {
      // perform mutation
      ele[formattedInput](value)
    })

    dispatch({
      type: "mutate-selection",
    })
  }

  useEffect(() => {
    if (selectionBox) {
      setBbox(selectionBox)
    }
  }, [canvasState.selectionBox])

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
            step={1}
            min={0}
            max={1000}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={1}
        >
          <InputControls
            input="Y"
            value={bbox.y}
            handler={handleUpdateBbox}
            step={1}
            min={0}
            max={1000}
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
            step={1}
            min={1}
            max={1000}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={1}
        >
          <InputControls
            input="Height"
            value={bbox.height}
            handler={handleUpdateBbox}
            step={1}
            min={1}
            max={1000}
          />
        </ControlFlexChild>
      </ControlFlexWrapper>
    </>
  )
}

export default DesignControls