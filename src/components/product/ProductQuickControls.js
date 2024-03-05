import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { convertFloatFixed, convertToMM, convertToPx } from "../../utils/helper-functions"
import { CaretDown } from "@phosphor-icons/react"

import { StyledSelect, StyledLabel, StyledFieldset, SelectWrapper, SelectIcon } from "../form/FormComponents"
import { Flexbox } from "../layout/Flexbox"

const CustomInput = styled.input`
  -webkit-appearance: none;
  appearance: textfield;
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
  top: 50%;
  transform: translateY(-50%);
  user-select: none;
  font-size: 1rem;
  &:hover {
    cursor: text;
  }
`

const ProductCustomInput = ({ label, pageData, inputs, type, initialValue, onBlur, onKeyDown }) => {
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
      if (inputRef.current) {
        inputRef.current.focus()
      }

      if (!inputValue) {
        setInputValue(initialValue)
        setLabelOffset((initialValue.toString().length * 8) + 22)
      }
    }
  }, [inputRef.current, pageData])

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
  setLeftPageData,
  setRightPageData,
  selectedPageSvg,
}) => {
  const { maxContentHeight, maxContentWidth } = pageData
  const [customInputs, setCustomInputs] = useState([])
  const spacingTemplates = ["ruled", "dot", "graph", "isometric", "seyes", "music", "handwriting", "cross", "calligraphy"]
  const lineTemplates = ["ruled", "seyes", "isometric", "music", "handwriting", "calligraphy"]
  const rowTemplates = ["music", "handwriting", "calligraphy"]
  const gridTemplates = ["dot", "graph", "cross"]
  const isMusicTemplate = pageData.template === "music" ? pageData.staffSpacing : pageData.spacing

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
    const convertedSpacing = convertToPx(value)
    const strokeWidth = convertToPx(pageData.strokeWidth)

    switch (pageData.template) {
      case "ruled":
        maxRows = Math.floor(maxContentHeight / (convertedSpacing + strokeWidth)) + 1 // the one accounts for the very first line
        templateHeight = (convertedSpacing + strokeWidth) * (maxRows - 1)
        verticalCenter = convertToMM((maxContentHeight - templateHeight - strokeWidth) / 2)
        marginTop = verticalCenter
        break
      case "dot":
        const radius = convertToPx(pageData.radius)
        const diameter = radius * 2

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
        const hexRadius = convertToPx(value)
        const hexWidth = Math.sqrt(3) * hexRadius
        const hexYOffset = Math.sqrt(2 * strokeWidth ** 2) / 2
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
        maxRows = Math.floor((maxContentHeight - convertedSpacing) / (strokeWidth * 1.125 + convertedSpacing)) + 1
        maxCols = Math.floor((maxContentWidth - convertedSpacing) / (convertedSpacing * 4 + strokeWidth * 2)) + 1
        marginTop = verticalCenter
        marginLeft = horizontalCenter
        break
      case "music":
        const staffHeight = convertToPx(2) * 4 + strokeWidth * 4
        maxRows = Math.floor((maxContentHeight + convertedSpacing + (strokeWidth / 2)) / (staffHeight + convertedSpacing + strokeWidth))
        templateHeight = maxRows * (staffHeight + convertedSpacing + strokeWidth) - convertedSpacing + strokeWidth
        verticalCenter = convertToMM((maxContentHeight - templateHeight) / 2)
        marginTop = verticalCenter
        break
      case "handwriting":
        const rowHeight = convertedSpacing * 2 + strokeWidth * 2
        maxRows = Math.floor((maxContentHeight + 3.78 + (strokeWidth / 2)) / (3.78 + rowHeight + strokeWidth))
        templateHeight = maxRows * (rowHeight + 3.78 + strokeWidth) - 3.78 + strokeWidth
        verticalCenter = convertToMM((maxContentHeight - templateHeight) / 2)
        marginTop = verticalCenter
        break
      case "cross":
        const crossSize = convertToPx(1)
        const crossStrokeOffset = .2
        maxRows = Math.floor((maxContentHeight + convertedSpacing) / (crossSize + convertedSpacing))
        maxCols = Math.floor((maxContentWidth + convertedSpacing) / (crossSize + convertedSpacing))
        templateHeight = maxRows * (crossSize + convertedSpacing) - convertedSpacing 
        templateWidth = maxCols * (crossSize + convertedSpacing) - convertedSpacing
        verticalCenter = convertFloatFixed(convertToMM((maxContentHeight - templateHeight) / 2) - crossStrokeOffset, 3)
        horizontalCenter = convertFloatFixed(convertToMM((maxContentWidth - templateWidth) / 2) - crossStrokeOffset, 3)
        marginTop = verticalCenter
        marginLeft = horizontalCenter
        break
      case "calligraphy": {
        const rowSpacing = convertToPx(1)
        const rowHeight = (convertedSpacing + strokeWidth) * 3

        maxCols = 137
        maxRows = Math.floor((maxContentHeight + rowSpacing) / (rowSpacing + rowHeight + strokeWidth))
        templateHeight = maxRows * (rowHeight + rowSpacing + strokeWidth) - rowSpacing - strokeWidth
        verticalCenter = convertToMM((maxContentHeight - templateHeight) / 2)
        marginTop = verticalCenter
        break
      }
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

  const handleChangeData = (data) => {
    setPageData(data)
    setLeftPageData({
      pageData: data,
      template: pageData.template,
      svg: selectedPageSvg.outerHTML,
    })
    setRightPageData({
      pageData: data,
      template: pageData.template,
      svg: selectedPageSvg.outerHTML,
    })
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
            handleChangeData({
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
          case "cross":
            handleChangeData({
              ...pageData,
              spacing: numberValue,
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
            handleChangeData({
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
          case "handwriting":
            handleChangeData({
              ...pageData,
              spacing: numberValue,
              rowSpacing: 1,
              alignmentHorizontal: "center",
              alignmentVertical: "middle",
              rows: maxRows,
              columns: maxCols,
              marginTop: margins.top,
              marginBottom: margins.bottom,
              marginLeft: margins.left,
              marginRight: margins.right,
            })
          case "calligraphy":
            handleChangeData({
              ...pageData,
              ascSpacing: numberValue,
              dscSpacing: numberValue,
              xHeight: numberValue,
              slantSpacing: numberValue,
              spacing: numberValue,
              rowSpacing: 1,
              alignmentHorizontal: "center",
              alignmentVertical: "middle",
              slants: maxCols,
              rows: maxRows,
              marginTop: margins.top,
              marginBottom: margins.bottom,
              marginLeft: margins.left,
              marginRight: margins.right,
            })
            break
        }
        break
      case "hexagonRadius":
        handleChangeData({
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
        handleChangeData({
          ...pageData,
          opacity: numberValue,
        })
        break
      case "angle":
        handleChangeData({
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

  const handleSpacingLabel = () => {
    if (lineTemplates.includes(pageData.template)) {
      return "Line spacing"
    }
    else if (rowTemplates.includes(pageData.template)) {
      return "Row spacing"
    }
    else if (gridTemplates.includes(pageData.template)) {
      return "Grid spacing"
    }
    else {
      return "Spacing"
    }
  }

  return (
    <Flexbox>
      {spacingTemplates.includes(pageData.template) && (
        <StyledFieldset>
          <StyledLabel>{handleSpacingLabel()}</StyledLabel>
          <SelectWrapper>
            <ProductCustomInput
              onBlur={handleValueChange}
              onKeyDown={handleKeydown}
              inputs={customInputs}
              initialValue={isMusicTemplate}
              pageData={pageData}
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
          <StyledLabel>Hexagon radius</StyledLabel>
          <SelectWrapper>
            <ProductCustomInput
              onBlur={handleValueChange}
              onKeyDown={handleKeydown}
              inputs={customInputs}
              initialValue={pageData.hexagonRadius}
              pageData={pageData}
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
          <StyledLabel>Angle</StyledLabel>
          <SelectWrapper>
            <ProductCustomInput
              onBlur={handleValueChange}
              onKeyDown={handleKeydown}
              inputs={customInputs}
              initialValue={pageData.angle}
              pageData={pageData}
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
        <StyledLabel>Opacity</StyledLabel>
        <SelectWrapper>
          <ProductCustomInput
            onBlur={handleValueChange}
            onKeyDown={handleKeydown}
            inputs={customInputs}
            initialValue={pageData.opacity}
            pageData={pageData}
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