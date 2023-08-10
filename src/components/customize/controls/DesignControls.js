import React, { useState, useEffect } from "react"
import { useEditorContext, useEditorDispatch } from "../context/editorContext"

import { ControlWrapper, ControlFlexWrapper, ControlFlexChild } from "../templateControls/components/TemplateComponents"
import InputControls from "../templateControls/components/InputControls"
import Content from "../../ui/Content"

const DesignControls = () => {
  const canvasState = useEditorContext()
  const dispatch = useEditorDispatch()
  const { selectedElements, selectionBbox, selectionAttributes } = canvasState
  const [bbox, setBbox] = useState(selectionBbox)
  const [attributes, setAttributes] = useState(selectionAttributes)

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
    if (selectionBbox) {
      setBbox(selectionBbox)
    }
    if (selectionAttributes) {
      console.log("🚀 ~ file: DesignControls.js:40 ~ useEffect ~ selectionAttributes:", selectionAttributes)
      setAttributes(selectionAttributes)
    }
  }, [selectionBbox, selectionAttributes])

  return (
    <>
      <ControlWrapper
        className="has-border-bottom"
        padding="0 0 32px"
      >
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
          {bbox.height !== 0 && (
            <ControlFlexChild
              margin="0 0 0 8px"
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
          )}
        </ControlFlexWrapper>
      </ControlWrapper>
      <ControlFlexWrapper>
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
        <ControlFlexChild
          margin="0 0 0 8px"
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