import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { colors, fonts, spacing } from "../../../styles/variables"
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
  width: calc(100% - 32px);
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
`

const ProductQuickControls = ({
  pageData,
  setPageData,
  selectedPageSvg,
}) => {
  const customInputRef = useRef(null)
  const [customInput, setCustomInput] = useState("")
  const [customValue, setCustomValue] = useState("")
  const [labelOffset, setLabelOffset] = useState(32)

  useEffect(() => {
    if (customInputRef?.current) {
      customInputRef.current.focus()
    }
  }, [customInputRef, customInput])

  const handleCustomInput = value => {
    const numberValue = +value

    if (numberValue === 0) {
      setCustomValue("")
    }
    else {
      setCustomValue(numberValue)
      setLabelOffset((value.length * 8) + 24)
    }
  }
  
  const handleValueChange = (value, type, isSelect) => {
    switch (type) {
      case "spacing":
        if (value === "custom") {
          setCustomInput(type)
        }
        else {
          if (isSelect) {
            setCustomInput("")
          }

          const numberValue = +value
          setPageData({
            ...pageData,
            spacing: numberValue,
            columnSpacing: numberValue,
            rowSpacing: numberValue,
            slantSpacing: numberValue,
            staffSpacing: numberValue,
            dscSpacing: numberValue,
            ascSpacing: numberValue,
            rows: 200,
            columns: 200,
          })
        }
        break
      default:
        break
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
                onKeyDown={e => e.key === "Enter" && handleValueChange(customValue, "spacing")}
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