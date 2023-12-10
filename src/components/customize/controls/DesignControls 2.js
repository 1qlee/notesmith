import React, { useState, useEffect } from "react"
import { useEditorContext, useEditorDispatch } from "../context/editorContext"
import { CaretDown, Question } from "@phosphor-icons/react"
import { convertFloatFixed, convertToPx, processStringNumbers  } from "../../../utils/helper-functions"
import { Tooltip } from "react-tooltip"

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
  const defaultDash = convertFloatFixed(7.5590551182, 3)
  const defaultGap = convertFloatFixed(3.7795275591, 3)

  // function to manipulate the selected elements
  const handleUpdateBbox = (value, property, elements) => {
    if (elements) {
      const convertedValue = convertToPx(value)

      // loop through selected elements and perform mutation
      elements.forEach((ele) => {
        const isCircle = ele instanceof SVGCircleElement || ele instanceof SVGEllipseElement
        const isLine = ele instanceof SVGLineElement
        const isGroup = ele instanceof SVGGElement

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
          case isLine:
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
              ele.setAttribute("y2", convertedValue)
            }
            else if (property === "width") {
              ele.setAttribute("x2", x1 + convertedValue)
            }
            break
          case isGroup:
            handleUpdateBbox(ele.childNodes, value, property)
            break
          default:
            ele.setAttribute(`${property}`, convertedValue)
        }
      })

      dispatch({
        type: "parse-selection",
      })
    }
  }

  const handleUpdateAttr = (value, property) => {
    if (selectedElements) {
      // loop through selected elements and perform mutation
      selectedElements.forEach((ele) => {
        switch(property) {
          case "stroke":
            ele.setAttribute("stroke", value)
            ele.setAttribute("stroke-width", convertToPx(0.088))
            ele.setAttribute("stroke-opacity", 1)
            break
          case "strokeWidth":
            ele.setAttribute("stroke-width", convertToPx(value))
            break
          case "strokeStyle":
            ele.setAttribute("strokeStyle", value)

            if (value === "Dashed") {
              ele.setAttribute("stroke-dasharray", `${defaultDash} ${defaultGap}`)
            }
            else {
              ele.setAttribute("stroke-dasharray", null)
            }
            break
          case "strokeDasharray":
            const dashes = value && processStringNumbers(value, convertToPx)
            ele.setAttribute("stroke-dasharray", dashes)
            break
          case "strokeOpacity":
            ele.setAttribute("stroke-opacity", value)
            break
          case "fill":
            if (value === "#000000") {
              ele.setAttribute("fill", "#000000")
            }
            else {
              ele.setAttribute("fill", "none")
            }
            break
          case "fillOpacity":
            ele.setAttribute("fill-opacity", value)
            break
          default:
            ele.setAttribute(`${property}`, value)
        }
      })

      dispatch({
        type: "parse-selection",
      })
    }
  }

  const handleDeletionAllowed = (value) => {
    dispatch({
      type: "toggle",
      setting: "deletionAllowed",
      value: value,
    })
  }

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
              elements={selectedElements}
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
              elements={selectedElements}
              handler={handleUpdateBbox}
              input="Y"
              max={1000}
              min={0}
              property="y"
              step={1}
              value={selectionBbox.y}
              onFocus={handleDeletionAllowed}
            />
          </ControlFlexChild>
        </ControlFlexWrapper>
        <ControlFlexWrapper>
          <ControlFlexChild
            flex={1}
          >
            <InputControls
              elements={selectedElements}
              handler={handleUpdateBbox}
              input="Width"
              max={1000}
              min={0.088}
              property="width"
              step={1}
              value={selectionBbox.width}
              onFocus={handleDeletionAllowed}
            />
          </ControlFlexChild>
          {selectionBbox.height !== 0 && (
            <ControlFlexChild
              margin="0 0 0 8px"
              flex={1}
            >
              <InputControls
                elements={selectedElements}
                handler={handleUpdateBbox}
                input="Height"
                max={1000}
                min={1}
                property="height"
                step={1}
                value={selectionBbox.height}
                onFocus={handleDeletionAllowed}
              />
            </ControlFlexChild>
          )}
        </ControlFlexWrapper>
      </ControlWrapper>
      {selectionAttributes.strokeWidth && (
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
                  value={selectionAttributes.stroke}
                >
                  {selectionAttributes.stroke === "Mixed" && (
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
            {selectionAttributes.stroke !== "none" && (
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
                    value={selectionAttributes.strokeWidth}
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
                    property="strokeOpacity"
                    step={0.01}
                    value={selectionAttributes.strokeOpacity}
                    onFocus={handleDeletionAllowed}
                  />
                </ControlFlexChild>
              </>
            )}
          </ControlFlexWrapper>
          {selectionAttributes.stroke !== "none" && (
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
                    value={selectionAttributes.strokeStyle}
                  >
                    {selectionAttributes.strokeStyle === "Mixed" && (
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
              {(selectionAttributes.strokeStyle === "Dashed" || selectionAttributes.strokeStyle === "Mixed") && (
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
                    value={selectionAttributes.strokeDasharray}
                    onFocus={e => {
                      e.target.select();
                      handleDeletionAllowed(false)
                    }}
                    onBlur={() => {
                      if (!selectionAttributes.strokeDasharray) {
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
      {selectionAttributes.fill && (
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
                  value={selectionAttributes.fill}
                >
                  {selectionAttributes.fill === "Mixed" && (
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
            {selectionAttributes.fill !== "none" && (
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
                  value={selectionAttributes.fillOpacity}
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