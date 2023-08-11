import React, { useState, useEffect } from "react"
import { convertToPx } from "../../../styles/variables"
import { useEditorContext, useEditorDispatch } from "../context/editorContext"
import { CaretDown } from "phosphor-react"

import { ControlWrapper, ControlFlexWrapper, ControlFlexChild } from "../templateControls/components/TemplateComponents"
import InputControls from "../templateControls/components/InputControls"
import { SelectWrapper, SelectIcon, StyledSelect, StyledLabel } from "../../form/FormComponents"
import Tag from "../../ui/Tag"

const StyledTag = ({ children }) => {
  return (
    <Tag
      padding="2px 8px"
      fontsize="0.625rem"
      letterspacing="1px"
      fontweight='700'
      margin="0 0 16px"
    >
      {children}
    </Tag>
  )
}

const DesignControls = () => {
  const canvasState = useEditorContext()
  const dispatch = useEditorDispatch()
  const { selectedElements, selectionBbox, selectionAttributes } = canvasState
  const [bbox, setBbox] = useState(selectionBbox)
  const [attributes, setAttributes] = useState(selectionAttributes)

  // function to manipulate the selected elements
  const handleUpdateBbox = (value, property) => {
    if (selectedElements) {
      // update the bbox values
      setBbox({
        ...bbox,
        [property]: value,
      })

      // loop through selected elements and perform mutation
      selectedElements.forEach((ele) => {
        ele[property](convertToPx(value))
      })

      dispatch({
        type: "mutate-selection",
      })
    }
  }

  const handleUpdateAttr = (value, property) => {
    if (selectedElements) {
      // update the bbox values
      setAttributes({
        ...attributes,
        [property]: value,
      })

      // loop through selected elements and perform mutation
      selectedElements.forEach((ele) => {
        if (property === "strokeWidth") {
          ele.attr("stroke-width", convertToPx(value))
        }
        else if (property === "strokeDasharray") {
          ele.attr("stroke-dasharray", value)
        }
        else {
          ele.attr(`${property}`, value)
        }
      })

      dispatch({
        type: "mutate-selection",
      })
    }
  }

  const handleDeletionAllowed = (value) => {
    dispatch({
      type: "toggle-deletion",
      deletionAllowed: value,
    })
  }

  useEffect(() => {
    if (selectionBbox) {
      setBbox(selectionBbox)
    }
    if (selectionAttributes) {
      setAttributes(selectionAttributes)
    }
  }, [selectionBbox, selectionAttributes])

  return (
    <>
      <ControlWrapper>
        <StyledTag>Positioning</StyledTag>
        <ControlFlexWrapper>
          <ControlFlexChild
            margin="0 8px 0 0"
            flex={1}
          >
            <InputControls
              handler={handleUpdateBbox}
              input="X"
              max={1000}
              min={0}
              property="x"
              step={1}
              value={bbox.x}
              onFocus={handleDeletionAllowed}
            />
          </ControlFlexChild>
          <ControlFlexChild
            flex={1}
          >
            <InputControls
              handler={handleUpdateBbox}
              input="Y"
              max={1000}
              min={0}
              property="y"
              step={1}
              value={bbox.y}
              onFocus={handleDeletionAllowed}
            />
          </ControlFlexChild>
        </ControlFlexWrapper>
        <ControlFlexWrapper>
          <ControlFlexChild
            flex={1}
          >
            <InputControls
              handler={handleUpdateBbox}
              input="Width"
              max={1000}
              min={1}
              property="width"
              step={1}
              value={bbox.width}
              onFocus={handleDeletionAllowed}
            />
          </ControlFlexChild>
          {bbox.height !== 0 && (
            <ControlFlexChild
              margin="0 0 0 8px"
              flex={1}
            >
              <InputControls
                handler={handleUpdateBbox}
                input="Height"
                max={1000}
                min={1}
                property="height"
                step={1}
                value={bbox.height}
                onFocus={handleDeletionAllowed}
              />
            </ControlFlexChild>
          )}
        </ControlFlexWrapper>
      </ControlWrapper>
      {attributes.strokeWidth && attributes.opacity && (
        <ControlWrapper>
          <StyledTag>Stroke</StyledTag>
          <ControlFlexWrapper>
            <ControlFlexChild
              flex={1}
            >
              <InputControls
                handler={handleUpdateAttr}
                input="Width"
                max={50}
                min={0.088}
                property="strokeWidth"
                step={0.01}
                value={attributes.strokeWidth}
                onFocus={handleDeletionAllowed}
              />
            </ControlFlexChild>
            <ControlFlexChild
              margin="0 0 0 8px"
              flex={1}
            >
              <InputControls
                handler={handleUpdateAttr}
                input="Opacity"
                max={1}
                min={0.5}
                property="opacity"
                step={0.01}
                value={attributes.opacity}
                onFocus={handleDeletionAllowed}
              />
            </ControlFlexChild>
          </ControlFlexWrapper>
          <ControlFlexWrapper>
            <ControlFlexChild
              flex={1}
            >
              <StyledLabel>Style</StyledLabel>
              <SelectWrapper>
                <StyledSelect
                  padding="0.5rem"
                  borderradius="4px"
                  width="100%"
                  onChange={(e) => handleUpdateAttr(e.target.value, "strokeDasharray")}
                >
                  <option value="Solid">Solid</option>
                  <option value="2 4">Dashed</option>
                </StyledSelect>
                <SelectIcon
                  top="8px"
                  right="4px"
                >
                  <CaretDown size="0.875rem" />
                </SelectIcon>
              </SelectWrapper>
            </ControlFlexChild>
            <ControlFlexChild
              flex={1}
              margin="0 0 0 8px"
            >
              <InputControls
                handler={handleUpdateAttr}
                input="Opacity"
                max={1}
                min={0.5}
                property="opacity"
                step={0.01}
                value={attributes.opacity}
                onFocus={handleDeletionAllowed}
              />
            </ControlFlexChild>
          </ControlFlexWrapper>
        </ControlWrapper>
      )}
      {attributes.fill && attributes.fillOpacity && (
        <ControlWrapper>
          <StyledTag>Fill</StyledTag>
          <ControlFlexWrapper>
            <ControlFlexChild
              flex={1}
            >
              <InputControls
                handler={handleUpdateAttr}
                input="Fill"
                max={50}
                min={0.088}
                property="fill"
                step={0.01}
                value={attributes.fill}
                onFocus={handleDeletionAllowed}
              />
            </ControlFlexChild>
          </ControlFlexWrapper>
        </ControlWrapper>
      )}
    </>
  )
}

export default DesignControls