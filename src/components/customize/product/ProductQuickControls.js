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
  &:hover {
    cursor: text;
  }
`

const ProductQuickControls = ({
  pageData,
  setPageData,
  selectedPageSvg,
  dimensions,
}) => {
  const dependencies = [
    pageData.spacing,
    pageData.columnSpacing,
    pageData.rowSpacing,
    pageData.slantSpacing,
    pageData.staffSpacing,
    pageData.dscSpacing,
    pageData.ascSpacing,
    pageData.rows,
    pageData.columns,
    pageData.staves,
    pageData.slants,
  ]
  const { maxContentHeight, maxContentWidth, strokeWidth, radius } = pageData
  const customInputRef = useRef(null)
  const [customInput, setCustomInput] = useState("")
  const [customValue, setCustomValue] = useState("")
  const [labelOffset, setLabelOffset] = useState(32)

  useEffect(() => {
    if (customInput === "spacing") {
      customInputRef.current.focus()
    }
  }, [customInput, customInputRef])

  const calcTemplateDimensions = (spacing) => {
    let maxRows = 0;
    let maxCols = 0;
    let marginLeft = 0;
    let marginTop = 0;
    let marginRight = 0;
    let marginBottom = 0;
    let centeredMargin = 0;
    let templateHeight = maxContentHeight
    let templateWidth = maxContentWidth
    const convertedSpacing = convertToPx(spacing)
    const radiusOffset = convertToPx(radius)
    const strokeOffset = convertToPx(strokeWidth)
    const halfStrokeOffset = strokeOffset / 2

    switch (pageData.template) {
      case "ruled":
        maxRows = Math.floor(maxContentHeight / (convertedSpacing + strokeOffset)) + 1 // the one accounts for the very first line
        templateHeight = (convertedSpacing + strokeOffset) * (maxRows - 1)
        centeredMargin = convertToMM((maxContentHeight - templateHeight - strokeOffset) / 2)
        marginTop = centeredMargin
        marginBottom = centeredMargin
        break
      case "dot":
        let diameter = radiusOffset * 2
        maxRows = Math.floor((maxContentHeight - diameter) / (convertedSpacing + diameter)) + 1
        templateHeight = (convertedSpacing + diameter) * (maxRows - 1) + diameter
        centeredMargin = convertToMM((maxContentHeight - templateHeight) / 2)
        marginTop = centeredMargin
        marginBottom = centeredMargin
        break
      // case "graph":
      //   verticalOffset = strokeOffset
      //   horizontalOffset = strokeOffset * 2
      //   break
      // case "hexagon":
      //   verticalOffset = strokeOffset
      //   horizontalOffset = strokeOffset
      //   break
      // case "music":
      //   verticalOffset = strokeOffset
      //   horizontalOffset = 0
      //   break
      // case "handwriting":
      //   verticalOffset = strokeOffset
      //   horizontalOffset = 0
      //   break
      // case "cross":
      //   verticalOffset = 0.333
      //   horizontalOffset = strokeOffset * 2
      //   break
      // case "calligraphy":
      //   verticalOffset = 0.333
      //   horizontalOffset = 0
      //   break
      // case "isometric":
      //   pageData.borderData.toggle ? horizontalOffset = 0 : horizontalOffset = strokeOffset / 2
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

  const handleCustomInput = value => {
    const numberValue = +value

    if (numberValue === 0 || !numberValue) {
      setCustomValue("")
    }
    else if (numberValue.length > 3) {
      return
    }
    else {
      setCustomValue(numberValue)
      setLabelOffset((value.length * 8) + 24)
    }
  }
  
  const handleValueChange = (value, type, isSelect) => {
    const numberValue = value ? +value : 1
    const maxValues = calcTemplateDimensions(numberValue)
    const { maxRows, maxCols, margins } = maxValues
    console.log("🚀 ~ handleValueChange ~ maxRows:", maxRows)

    switch (type) {
      case "spacing":
        if (value === "custom") {
          setCustomInput(type)
        }
        else {
          if (isSelect) {
            setCustomInput("")
          }

          if (numberValue === 1) {
            setCustomValue(1)
          }

          console.log('Changing value')
          setPageData({
            ...pageData,
            spacing: numberValue,
            columnSpacing: numberValue,
            rowSpacing: numberValue,
            slantSpacing: numberValue,
            staffSpacing: numberValue,
            dscSpacing: numberValue,
            ascSpacing: numberValue,
            rows: maxRows,
            marginTop: margins.top,
            marginBottom: margins.bottom,
            marginLeft: margins.left,
            marginRight: margins.right,
          })
        }
        break
      default:
        break
    }
  }

  const handleKeydown = (e, type) => {
    const numberValue = +e.target.value

    if (type === "spacing") {
      if (e.key === "Enter") {
        handleValueChange(+numberValue, "spacing")
        e.target.blur()
      }
    }
  }

  return (
    <Flexbox>
      <StyledFieldset>
        <StyledLabel fontsize="1rem">Spacing</StyledLabel>
        <SelectWrapper>
          {customInput === "spacing" && (
            <>
              <CustomInput
                id="custom-input"
                type="number"
                value={customValue}
                onChange={e => handleCustomInput(e.target.value)}
                onBlur={() => handleValueChange(customValue, "spacing")}
                onKeyDown={e => handleKeydown(e, "spacing")}
                onFocus={e => e.target.select()}
                ref={customInputRef}
              />
              <CustomInputLabel left={labelOffset} htmlFor="custom-input">mm</CustomInputLabel>
            </>
          )}
          <StyledSelect
            borderradius="4px"
            width="100%"
            onChange={(e) => handleValueChange(e.target.value, "spacing", true)}
            defaultValue="5"
            fontsize="1rem"
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
    </Flexbox>
  )
}

export default ProductQuickControls