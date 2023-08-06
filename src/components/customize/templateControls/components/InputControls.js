import React, { useState } from "react"
import { colors } from "../../../../styles/variables"

import { NumberInput, StyledLabel } from "../../../form/FormComponents"
import { ControlInputGroup, ControlInnerButton } from "./TemplateComponents"

function InputControls({
  input,
  max,
  min,
  step,
  value,
  handler,
}) {
  const inputId = `${input}-input`
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <StyledLabel htmlFor={inputId}>{input}</StyledLabel>
      <ControlInputGroup
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NumberInput
          id={inputId}
          max={max}
          min={min}
          padding="8px 24px 8px 8px"
          step={step}
          value={value}
          onChange={val => handler(val, input)}
        />
        {isHovered && (
          <ControlInnerButton
            color={colors.gray.oneHundred}
            backgroundcolor={colors.gray.nineHundred}
            padding="4px"
            fontsize="0.75rem"
          >
            Fill
          </ControlInnerButton>
        )}
      </ControlInputGroup>
    </>
  )
}

export default InputControls