import React, { useEffect, useState, useRef, useMemo } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { convertFloatFixed, convertToMM, convertToPx } from "../../../utils/helper-functions"
import { CaretDown } from "@phosphor-icons/react"

import { StyledSelect, StyledLabel, StyledFieldset, SelectWrapper, SelectIcon, StyledInput, NumberInput } from "../../form/FormComponents"
import { Flexbox } from "../../layout/Flexbox"

const CustomInput = styled.input`
  -moz-appearance: textfield;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 4px 0 0 4px;
  border: ${colors.borders.black};
  height: 100%;
  left: 0;
  padding: 16px;
  position: absolute;
  font-size: 1rem;
  top: 0;
  width: 80px;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const CustomInputLabel = styled.label`
  position: absolute;
  left: ${props => `${props.left}px`};
  top: 16px;
  user-select: none;
  font-size: 1rem;
  &:hover {
    cursor: text;
  }
  @media only screen and (max-width: 768px) {
    top: 17px;
  }
`

const ProductCustomInput = ({ label, inputs, type, initialValue, onBlur, onKeyDown }) => {
  const [inputValue, setInputValue] = useState("")
  const [labelOffset, setLabelOffset] = useState(32)
  const inputRef = useRef(null)

  const handleInputChange = value => {
    const numberValue = +value

    if (numberValue === 0 || !numberValue) {
      setInputValue("")
    }
    else if (value.length > 2) {
      return
    }
    else {
      setInputValue(numberValue)
      setLabelOffset((numberValue.toString().length * 8) + 22)
    }
  }

  useEffect(() => {
    if (inputs.includes(type)) {
      console.log("showing input")
      if (inputRef.current) {
        inputRef.current.focus()
      }

      if (!inputValue) {
        setInputValue(initialValue)
        setLabelOffset((initialValue.toString().length * 8) + 22)
      }
    }
  }, [inputRef.current])

  return (
    <>
      {(inputs.includes(type)) && (
        <>
          <CustomInput
            id="custom-input"
            type="number"
            value={inputValue}
            onChange={e => handleInputChange(e.target.value)}
            onBlur={() => onBlur(inputValue, type)}
            onKeyDown={e => onKeyDown(e, type)}
            ref={inputRef}
          />
          <CustomInputLabel left={labelOffset} htmlFor="custom-input">{label || "mm"}</CustomInputLabel>
        </>
      )}
    </>
  )
}

const ProductQuickControls = ({
  pageData,
  setPageData,
}) => {
  const { maxContentHeight, maxContentWidth } = pageData
  const [customInputs, setCustomInputs] = useState([])
  const spacingTemplates = ["ruled", "dot", "graph", "isometric", "seyes", "music", "handwriting", "cross", "caligraphy"]
  const isMusicTemplate =pageData.template === "music" ? pageData.staffSpacing : pageData.spacing

  useEffect(() => {
    setCustomInputs([])
  }, [pageData.template])

  const calcTemplateDimensions = (value) => {
    let maxRows = 0
    let maxCols = 0
    let marginLeft = 0
    let marginTop = 0
    let marginRight = 0
    let marginBottom = 0
    let verticalCenter = 0
    let horizontalCenter = 0
    let templateHeight = maxContentHeight
    let templateWidth = maxContentWidth
    const rowSpacing = convertToPx(pageData.rowSpacing)
    const columnSpacing = convertToPx(pageData.columnSpacing)
    const convertedSpacing = convertToPx(value)
    const radius = convertToPx(pageData.radius)
    const diameter = radius * 2
    const strokeWidth = convertToPx(pageData.strokeWidth)
    const hexRadius = convertToPx(value)
    const hexWidth = Math.sqrt(3) * hexRadius
    const hexYOffset = Math.sqrt(2 * strokeWidth ** 2) / 2

    switch (pageData.template) {
      case "ruled":
        maxRows = Math.floor(maxContentHeight / (convertedSpacing + strokeWidth)) + 1 // the one accounts for the very first line
        templateHeight = (convertedSpacing + strokeWidth) * (maxRows - 1)
        verticalCenter = convertToMM((maxContentHeight - templateHeight - strokeWidth) / 2)
        marginTop = verticalCenter
        break
      case "dot":
        maxRows = Math.floor((maxContentHeight - diameter) / (convertedSpacing + diameter)) + 1
        maxCols = Math.floor((maxContentWidth - diameter) / (convertedSpacing + diameter)) + 1
        templateHeight = (convertedSpacing + diameter) * (maxRows - 1) + diameter
        templateWidth = (convertedSpacing + diameter) * (maxCols - 1) + diameter
        verticalCenter = convertToMM((maxContentHeight - templateHeight) / 2)
        horizontalCenter = convertToMM((maxContentWidth - templateWidth) / 2)
        marginTop = verticalCenter
        marginLeft = horizontalCenter
        break
      case "graph":
        maxRows = Math.floor(maxContentHeight / (convertedSpacing + strokeWidth))
        maxCols = Math.floor(maxContentWidth / (convertedSpacing + strokeWidth))
        templateHeight = (convertedSpacing + strokeWidth) * maxRows + strokeWidth * 2
        templateWidth = (convertedSpacing + strokeWidth) * maxCols + strokeWidth * 2
        verticalCenter = convertToMM((maxContentHeight - templateHeight) / 2)
        horizontalCenter = convertToMM((maxContentWidth - templateWidth) / 2)
        marginTop = verticalCenter
        marginLeft = horizontalCenter
        break
      case "hexagon":
        const oddColsMax = Math.floor(maxContentWidth / hexWidth)
        const evenColsMax = Math.floor((maxContentWidth - hexWidth / 2) / hexWidth)
        maxRows = Math.floor((maxContentHeight - (hexRadius / 2)) / (hexRadius * 1.5))
        maxCols = oddColsMax + evenColsMax
        templateHeight = maxRows * hexRadius * 1.5 + (hexRadius / 2)
        templateWidth = oddColsMax > evenColsMax ? oddColsMax * hexWidth : oddColsMax * hexWidth + (hexWidth / 2)
        verticalCenter = convertToMM((maxContentHeight - templateHeight - hexYOffset) / 2)
        horizontalCenter = convertToMM((maxContentWidth - templateWidth - strokeWidth) / 2)
        marginTop = verticalCenter
        marginLeft = horizontalCenter
        break
      case "seyes":
        maxRows = Math.floor((maxContentHeight - rowSpacing) / (strokeWidth * 1.125 + convertedSpacing)) + 1
        maxCols = Math.floor((maxContentWidth - columnSpacing) / (convertedSpacing * 4 + strokeWidth * 2)) + 1
        marginTop = verticalCenter
        marginLeft = horizontalCenter
        break
      case "music":
        const staffHeight = convertToPx(pageData.spacing) * 4 + strokeWidth * 4
        maxRows = Math.floor((maxContentHeight + convertedSpacing + (strokeWidth / 2)) / (staffHeight + convertedSpacing + strokeWidth))
        templateHeight = maxRows * (staffHeight + convertedSpacing + strokeWidth) - convertedSpacing - strokeWidth
        verticalCenter = convertToMM((maxContentHeight - templateHeight) / 2)
        marginTop = verticalCenter
        break
      // case "handwriting":
      //   verticalOffset = strokeWidth
      //   horizontalOffset = 0
      //   break
      // case "cross":
      //   verticalOffset = 0.333
      //   horizontalOffset = strokeWidth * 2
      //   break
      // case "calligraphy":
      //   verticalOffset = 0.333
      //   horizontalOffset = 0
      //   break
      // case "isometric":
      //   pageData.borderData.toggle ? horizontalOffset = 0 : horizontalOffset = strokeWidth / 2
      //   verticalOffset = 0
      //   break
      default:
        maxRows = 0
        maxCols = 0
        break
    }

    return {
      maxRows: maxRows,
      maxCols: maxCols,
      margins: {
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft,
      }
    }
  }
  
  const handleValueChange = (value, type, defaultValue, isSelect) => {
    const numberValue = value !== "custom" ? +value : defaultValue
    const maxValues = calcTemplateDimensions(numberValue)
    const { maxRows, maxCols, margins } = maxValues

    if (value === "custom") {
      const updatedCustomInputs = customInputs.includes(type) ? customInputs : [...customInputs, type]
      setCustomInputs(updatedCustomInputs)
    } 
    else {
      if (isSelect) {
        // Remove value from customInputs array if it exists
        const updatedCustomInputs = customInputs.filter(input => input !== type)
        setCustomInputs(updatedCustomInputs)
      }
    }

    switch (type) {
      case "spacing":
        switch (pageData.template) {
          case "ruled":
          case "hexagon":
          case "isometric":
          case "seyes":
            setPageData({
              ...pageData,
              spacing: numberValue,
              alignmentHorizontal: "center",
              alignmentVertical: "middle",
              rows: maxRows,
              columns: maxCols,
              marginTop: margins.top,
              marginBottom: margins.bottom,
              marginLeft: margins.left,
              marginRight: margins.right,
            })
            break
          case "dot":
          case "graph":
            setPageData({
              ...pageData,
              columnSpacing: numberValue,
              rowSpacing: numberValue,
              alignmentHorizontal: "center",
              alignmentVertical: "middle",
              rows: maxRows,
              columns: maxCols,
              marginTop: margins.top,
              marginBottom: margins.bottom,
              marginLeft: margins.left,
              marginRight: margins.right,
            })
            break
          case "music":
            setPageData({
              ...pageData,
              spacing: 2,
              staffSpacing: numberValue,
              alignmentHorizontal: "center",
              alignmentVertical: "middle",
              staves: maxRows,
              marginTop: margins.top,
              marginBottom: margins.bottom,
              marginLeft: margins.left,
              marginRight: margins.right,
            })
            break
        }
        break
      case "hexagonRadius":
        setPageData({
          ...pageData,
          alignmentHorizontal: "center",
          alignmentVertical: "middle",
          rows: maxRows,
          columns: maxCols,
          hexagonRadius: numberValue,
          marginTop: margins.top,
          marginBottom: margins.bottom,
          marginLeft: margins.left,
          marginRight: margins.right,
        })
        break
      case "opacity":
        setPageData({
          ...pageData,
          opacity: numberValue,
        })
        break
      case "angle":
        setPageData({
          ...pageData,
          angle: numberValue,
        })
        break
    }
  }

  const handleKeydown = (e, type) => {
    const numberValue = +e.target.value

    if (e.key === "Enter") {
      handleValueChange(+numberValue, type)
      e.target.blur()
    }
  }

  return (
    <Flexbox>
      {spacingTemplates.includes(pageData.template) && (
        <StyledFieldset>
          <StyledLabel fontsize="1rem">Spacing</StyledLabel>
          <SelectWrapper>
            <ProductCustomInput
              onBlur={handleValueChange}
              onKeyDown={handleKeydown}
              inputs={customInputs}
              initialValue={isMusicTemplate}
              type="spacing"
            />
            <StyledSelect
              borderradius="4px"
              width="100%"
              onChange={(e) => handleValueChange(e.target.value, "spacing", isMusicTemplate, true)}
              fontsize="1rem"
              value={isMusicTemplate}
            >
              <option value="custom">Custom</option>
              {["seyes"].includes(pageData.template) && (
                <option value="2">2 mm</option>
              )}
              <option value="3">3 mm</option>
              <option default value="5">5 mm</option>
              <option value="7">7 mm</option>
            </StyledSelect>
            <SelectIcon
              top="20px"
              right="8px"
            >
              <CaretDown size="1rem" />
            </SelectIcon>
          </SelectWrapper>
        </StyledFieldset>
      )}
      {pageData.template === "hexagon" && (
        <StyledFieldset>
          <StyledLabel fontsize="1rem">Hexagon radius</StyledLabel>
          <SelectWrapper>
            <ProductCustomInput
              onBlur={handleValueChange}
              onKeyDown={handleKeydown}
              inputs={customInputs}
              initialValue={pageData.hexagonRadius}
              type="hexagonRadius"
            />
            <StyledSelect
              borderradius="4px"
              width="100%"
              onChange={(e) => handleValueChange(e.target.value, "hexagonRadius", pageData.hexagonRadius, true)}
              fontsize="1rem"
              value={pageData.hexagonRadius}
            >
              <option value="custom">Custom</option>
              <option value="3">3 mm</option>
              <option default value="5">5 mm</option>
              <option value="7">7 mm</option>
            </StyledSelect>
            <SelectIcon
              top="20px"
              right="8px"
            >
              <CaretDown size="1rem" />
            </SelectIcon>
          </SelectWrapper>
        </StyledFieldset>
      )}
      {pageData.template === "isometric" && (
        <StyledFieldset
          margin="0 0 16px 16px"
        >
          <StyledLabel fontsize="1rem">Angle</StyledLabel>
          <SelectWrapper>
            <ProductCustomInput
              onBlur={handleValueChange}
              onKeyDown={handleKeydown}
              inputs={customInputs}
              initialValue={pageData.angle}
              label="°"
              type="angle"
            />
            <StyledSelect
              borderradius="4px"
              width="100%"
              onChange={(e) => handleValueChange(e.target.value, "angle", pageData.angle, true)}
              fontsize="1rem"
              value={pageData.angle}
            >
              <option value="custom">Custom</option>
              <option value={30}>30°</option>
              <option default value={45}>45°</option>
              <option value={60}>60°</option>
            </StyledSelect>
            <SelectIcon
              top="20px"
              right="8px"
            >
              <CaretDown size="1rem" />
            </SelectIcon>
          </SelectWrapper>
        </StyledFieldset>
      )}
      <StyledFieldset
        margin="0 0 16px 16px"
      >
        <StyledLabel fontsize="1rem">Opacity</StyledLabel>
        <SelectWrapper>
          <ProductCustomInput
            onBlur={handleValueChange}
            onKeyDown={handleKeydown}
            inputs={customInputs}
            initialValue={pageData.opacity}
            label="%"
            type="opacity"
          />
          <StyledSelect
            borderradius="4px"
            width="100%"
            onChange={(e) => handleValueChange(e.target.value, "opacity", pageData.opacity, true)}
            fontsize="1rem"
            value={pageData.opacity}
          >
            <option value="custom">Custom</option>
            <option value={30}>Faint</option>
            <option default value={50}>Light</option>
            <option value={75}>Dark</option>
            <option value={100}>Black</option>
          </StyledSelect>
          <SelectIcon
            top="20px"
            right="8px"
          >
            <CaretDown size="1rem" />
          </SelectIcon>
        </SelectWrapper>
      </StyledFieldset>
    </Flexbox>
  )
}

export default ProductQuickControls