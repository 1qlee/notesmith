import React, { useState, useEffect } from "react"
import { useEditorContext, useEditorDispatch } from "../context/editorContext"
import { CaretDown, Question } from "phosphor-react"
import { convertFloatFixed, convertToPx, processStringNumbers  } from "../../../utils/helper-functions"
import { Tooltip } from "react-tooltip"
import * as d3 from "d3"

import { ControlWrapper, ControlFlexWrapper, ControlFlexChild } from "../templateControls/components/TemplateComponents"
import { SelectWrapper, SelectIcon, StyledSelect, StyledLabel, StyledInput } from "../../form/FormComponents"
import { Flexbox } from "../../layout/Flexbox"
import InputControls from "../templateControls/components/InputControls"
import Tag from "../../ui/Tag"
import Icon from "../../ui/Icon"

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
  const [attributes, setAttributes] = useState({selectionAttributes})
  const defaultDash = convertFloatFixed(7.5590551182, 3)
  const defaultGap = convertFloatFixed(3.7795275591, 3)

  // function to manipulate the selected elements
  const handleUpdateBbox = (value, property) => {
    if (selectedElements) {
      // update the bbox values
      // setBbox({
      //   ...bbox,
      //   [property]: value,
      // })
      const convertedValue = convertToPx(value)

      // loop through selected elements and perform mutation
      selectedElements.forEach((ele) => {
        const { nodeName } = ele
        const isCircle = nodeName === "circle" || nodeName === "ellipse"
        const line = nodeName === "line"

        switch(true) {
          case isCircle:
            if (property === "x") {
              ele.setAttribute("cx", convertedValue)
            }
            else if (property === "y") {
              ele.setAttribute("cy", convertedValue)
            }
            else if (property === "width") {
              ele.setAttribute("rx", convertFloatFixed(convertedValue / 2, 3))
            }
            else if (property === "height") {
              ele.setAttribute("ry", convertFloatFixed(convertedValue / 2, 3))
            }
            break
          case line:
            const x1 = +ele.getAttribute("x1")
            const x2 = +ele.getAttribute("x2")

            if (property === "x") {
              // Calculate the current length
              let length = Math.abs(x2 - x1);

              // Calculate new positions while preserving length
              let x1New, x2New;
              if (x1 < x2) {
                x1New = convertedValue;
                x2New = convertedValue + length;
              } else {
                x1New = convertedValue - length;
                x2New = convertedValue;
              }

              ele.setAttribute("x1", x1New)
              ele.setAttribute("x2", x2New)
            }
            else if (property === "y") {
              ele.setAttribute("y1", convertedValue)
            }
            else if (property === "width") {
              ele.setAttribute("x2", x1 + convertedValue)
            }
            break
          default:
            ele.setAttribute(`${property}`, convertedValue)
        }
      })

      dispatch({
        type: "mutate-selection",
      })
    }
  }

  const handleUpdateAttr = (value, property) => {
    if (selectedElements) {
      // update the bbox values
      // setAttributes({
      //   ...attributes,
      //   [property]: value,
      // })

      // loop through selected elements and perform mutation
      selectedElements.forEach((ele) => {
        switch(property) {
          case "stroke":
            ele.attr({
              stroke: value,
              'stroke-width': convertToPx(0.088),
              opacity: 1,
            })
            break
          case "strokeWidth":
            ele.attr("stroke-width", convertToPx(value))
            break
          case "strokeStyle":
            ele.data("strokeStyle", value)

            if (value === "Dashed") {
              setAttributes({
                ...attributes,
                strokeDasharray: `${defaultDash} ${defaultGap}`,
              })
              ele.attr("stroke-dasharray", `${defaultDash} ${defaultGap}`)
            }
            else {
              setAttributes({
                ...attributes,
                strokeDasharray: "",
              })
              ele.attr("stroke-dasharray", null)
            }
            break
          case "strokeDasharray":
            const dashes = value && processStringNumbers(value, convertToPx)
            ele.attr("stroke-dasharray", dashes)
            break
          case "fill":
            if (value === "#000000") {
              ele.attr("fill", "#000000")
            }
            else {
              ele.attr("fill", "none")
            }
            break
          case "fillOpacity":
            ele.attr("fill-opacity", value)
            break
          default:
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
              value={selectionBbox.x}
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
              min={0.088}
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
      {attributes.strokeWidth && (
        <ControlWrapper>
          <StyledTag>Stroke</StyledTag>
          <ControlFlexWrapper>
            <ControlFlexChild
              flex={1}
            >
              <StyledLabel>Stroke</StyledLabel>
              <SelectWrapper>
                <StyledSelect
                  padding="0.5rem"
                  borderradius="4px"
                  width="100%"
                  onChange={(e) => handleUpdateAttr(e.target.value, "stroke")}
                  onFocus={() => handleDeletionAllowed(false)}
                  onBlur={() => handleDeletionAllowed(true)}
                  value={attributes.stroke}
                >
                  {attributes.stroke === "Mixed" && (
                    <option value="Mixed" disabled>Mixed</option>
                  )}
                  <option value="none">None</option>
                  <option value="#000000">Yes</option>
                </StyledSelect>
                <SelectIcon
                  top="8px"
                  right="4px"
                >
                  <CaretDown size="0.875rem" />
                </SelectIcon>
              </SelectWrapper>
            </ControlFlexChild>
            {attributes.stroke !== "none" && (
              <>
                <ControlFlexChild
                  flex={1}
                  margin="0 0 0 8px"
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
              </>
            )}
          </ControlFlexWrapper>
          {attributes.stroke !== "none" && (
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
                    onChange={(e) => handleUpdateAttr(e.target.value, "strokeStyle")}
                    onFocus={() => handleDeletionAllowed(false)}
                    onBlur={() => handleDeletionAllowed(true)}
                    value={attributes.strokeStyle}
                  >
                    {attributes.strokeStyle === "Mixed" && (
                      <option value="Mixed" disabled>Mixed</option>
                    )}
                    <option value="Solid">Solid</option>
                    <option value="Dashed">Dashed</option>
                  </StyledSelect>
                  <SelectIcon
                    top="8px"
                    right="4px"
                  >
                    <CaretDown size="0.875rem" />
                  </SelectIcon>
                </SelectWrapper>
              </ControlFlexChild>
              {(attributes.strokeStyle === "Dashed" || attributes.strokeStyle === "Mixed") && (
                <ControlFlexChild
                  flex={1}
                  margin="0 0 0 8px"
                >
                  <Flexbox
                    alignitems="center"
                    margin="0 0 8px"
                  >
                    <StyledLabel
                      margin="0"
                    >
                      <span>Dashes</span>
                    </StyledLabel>
                    <Icon
                      className="tooltip"
                      margin="0 0 0 4px"
                    >
                      <Question size="0.875rem" />
                    </Icon>
                  </Flexbox>
                  <StyledInput
                    onChange={e => handleUpdateAttr(e.target.value, "strokeDasharray")}
                    type="text"
                    padding="8px 24px 8px 8px"
                    value={attributes.strokeDasharray}
                    onFocus={e => {
                      e.target.select();
                      handleDeletionAllowed(false)
                    }}
                    onBlur={() => {
                      if (!attributes.strokeDasharray) {
                        handleUpdateAttr("Solid", "strokeStyle")
                      }
                      handleDeletionAllowed(true)
                    }}
                  />
                </ControlFlexChild>
              )}
            </ControlFlexWrapper>
          )}
        </ControlWrapper>
      )}
      {attributes.fill && (
        <ControlWrapper>
          <StyledTag>Fill</StyledTag>
          <ControlFlexWrapper>
            <ControlFlexChild
              flex={1}
            >
              <StyledLabel>Fill</StyledLabel>
              <SelectWrapper>
                <StyledSelect
                  padding="0.5rem"
                  borderradius="4px"
                  width="100%"
                  onChange={(e) => handleUpdateAttr(e.target.value, "fill")}
                  onFocus={() => handleDeletionAllowed(true)}
                  onBlur={() => handleDeletionAllowed(false)}
                  value={attributes.fill}
                >
                  {attributes.fill === "Mixed" && (
                    <option value="Mixed" disabled>Mixed</option>
                  )}        
                  <option value="none">None</option>
                  <option value="#000000">Yes</option>         
                </StyledSelect>
                <SelectIcon
                  top="8px"
                  right="4px"
                >
                  <CaretDown size="0.875rem" />
                </SelectIcon>
              </SelectWrapper>
            </ControlFlexChild>
            {attributes.fill !== "none" && (
              <ControlFlexChild
                flex={1}
                margin="0 0 0 8px"
              >
                <InputControls
                  handler={handleUpdateAttr}
                  input="Opacity"
                  max={1}
                  min={0.5}
                  property="fillOpacity"
                  step={0.01}
                  value={attributes.fillOpacity}
                  onFocus={handleDeletionAllowed}
                />
              </ControlFlexChild>  
            )}
          </ControlFlexWrapper>
        </ControlWrapper>
      )}
      <Tooltip
        anchorSelect=".tooltip"
        content="Enter numbers that represent alternating dash and gap lengths."
        place="top"
        style={{
          fontSize: "0.75rem",
          padding: "4px 8px",
        }}
      />
    </>
  )
}

export default DesignControls