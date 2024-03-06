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
  line-height: 1;
  user-select: none;
  font-size: 1rem;
  &:hover {
    cursor: text;
  }
`

const ProductCustomInput = ({ label, pageData, customInputs, setCustomInputs, type, initialValue, onBlur, onKeyDown }) => {
  const [inputValue, setInputValue] = useState("")
  const [labelOffset, setLabelOffset] = useState(32)
  const inputRef = useRef(null)

  const handleInputChange = value => {
    console.log(type)
    if (!isNaN(value)) {
      const numberValue = +value

      switch(type) {
        case "spacing":
        case "hexagonRadius":
          if (numberValue >= 1 && numberValue <= 100) {
            setInputValue(numberValue)
            setLabelOffset((numberValue.toString().length * 8) + 22)
          }
          else {
            setInputValue("")
          }
          break
        case "opacity":
          break
      }
    }


    // setInputValue(numberValue)
    // setLabelOffset((numberValue.toString().length * 8) + 22)
  }

  useEffect(() => {
    handleInputChange(pageData.spacing)
    if (customInputs.includes(type)) {
      if (inputRef.current) {
        console.log('focusing')
        inputRef.current.focus()
      }

      if (!inputValue) {
        setInputValue(initialValue)
        setLabelOffset((initialValue.toString().length * 8) + 22)
      }
    }
  }, [customInputs, pageData.spacing])

  return (
    <>
      {(customInputs.includes(type)) && (
        <>
          <CustomInput
            id="custom-input"
            type="number"
            value={inputValue}
            onChange={e => handleInputChange(e.target.value)}
            onBlur={() => onBlur({
              value: inputValue, 
              type: type, 
              callback: setInputValue
            })}
            onKeyDown={e => onKeyDown({
              event: e,
              type: type,
              callback: setInputValue,
            })}
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
  const gridTemplates = ["dot", "graph", "hexagon", "cross"]
  const isMusicTemplate = pageData.template === "music" ? pageData.staffSpacing : pageData.spacing

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
  
  const handleValueChange = (options) => {
    const { value, type, defaultValue, isSelect, callback } = options
    let numberValue = value !== "custom" ? +value : defaultValue
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
        console.log("🚀 ~ handleValueChange ~ updatedCustomInputs:", updatedCustomInputs)
        setCustomInputs(updatedCustomInputs)
      }
    }

    switch (type) {
      case "spacing":
        if (numberValue === 0) {
          numberValue = 1
          callback(1)
        }
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

  const handleKeydown = (options) => {
    const { event, type, callback } = options
    const numberValue = +event.target.value

    if (event.key === "Enter") {
      handleValueChange({
        value: numberValue,
        type: type,
        callback: callback,
      })
      event.target.blur()
    }
  }

  const handleLabel = (options) => {
    const { type } = options
    if (lineTemplates.includes(pageData.template)) {
      return `Line ${type}`
    }
    else if (rowTemplates.includes(pageData.template)) {
      return `Row ${type}`
    }
    else if (gridTemplates.includes(pageData.template)) {
      if (type === "opacity") {
        switch (pageData.template) {
          case "dot":
            return `Dot opacity`
          case "graph":
            return `Line opacity`
          case "hexagon":
            return `Hexagon opacity`
          case "cross":
            return `Cross opacity`
        }
      }
      else {
        return `Grid ${type}`
      }
    }
    else {
      return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  return (
    <Flexbox
      margin="0 0 16px"
    >
      {spacingTemplates.includes(pageData.template) && (
        <StyledFieldset>
          <StyledLabel>{handleLabel({ type: "spacing", })}</StyledLabel>
          <SelectWrapper>
            <ProductCustomInput
              onBlur={handleValueChange}
              onKeyDown={handleKeydown}
              customInputs={customInputs}
              setCustomInputs={setCustomInputs}
              initialValue={isMusicTemplate}
              pageData={pageData}
              type="spacing"
            />
            <StyledSelect
              borderradius="4px"
              width="100%"
              onChange={(e) => handleValueChange({
                value: e.target.value, 
                type: "spacing", 
                defaultValue: isMusicTemplate, 
                isSelect: true
              })}
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
              customInputs={customInputs}
              setCustomInputs={setCustomInputs}
              initialValue={pageData.hexagonRadius}
              pageData={pageData}
              type="hexagonRadius"
            />
            <StyledSelect
              borderradius="4px"
              width="100%"
              onChange={(e) => handleValueChange({
                value: e.target.value,
                type: "hexagonRadius",
                defaultValue: pageData.hexagonRadius,
                isSelect: true
              })}
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
              customInputs={customInputs}
              setCustomInputs={setCustomInputs}
              initialValue={pageData.angle}
              pageData={pageData}
              label="°"
              type="angle"
            />
            <StyledSelect
              borderradius="4px"
              width="100%"
              onChange={(e) => handleValueChange({
                value: e.target.value,
                type: "angle",
                defaultValue: pageData.angle,
                isSelect: true
              })}
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
        <StyledLabel>{handleLabel({type: "opacity" })}</StyledLabel>
        <SelectWrapper>
          <ProductCustomInput
            onBlur={handleValueChange}
            onKeyDown={handleKeydown}
            customInputs={customInputs}
            setCustomInputs={setCustomInputs}
            initialValue={pageData.opacity}
            pageData={pageData}
            label="%"
            type="opacity"
          />
          <StyledSelect
            borderradius="4px"
            width="100%"
            onChange={(e) => handleValueChange({
              value: e.target.value,
              type: "opacity",
              defaultValue: pageData.opacity,
              isSelect: true
            })}
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