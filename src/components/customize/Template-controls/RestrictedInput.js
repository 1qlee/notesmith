import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

import { StyledInput } from "../../form/FormComponents"

function RestrictedInput({
  minValue,
  inputType,
  inputStep,
  inputMin,
  inputPadding,
  inputValue,
  inputFunc,
  onChange,
}) {
  const [tempValue, setTempValue] = useState(inputValue)

  const handleBlur = e => {
    const { value } = e.target

    if (!value || value === 0) {
      setTempValue(1)
      inputFunc(1)
    }
  }

  const handleChange = e => {
    const { value } = e.target
    const parsedValue = parseInt(value)

    if (!value || value < 1) {
      setTempValue('')
    }
    else if (value > inputValue) {
      setTempValue(inputValue)
      inputFunc(parsedValue)
    }
    else {
      setTempValue(parsedValue)
      inputFunc(parsedValue)
    }
  }

  return (
    <StyledInput
      type={inputType}
      min={inputMin}
      padding={inputPadding}
      step={inputStep}
      value={tempValue}
      onBlur={e => handleBlur(e)}
      onChange={e => handleChange(e)}
    />
  )
}

export default RestrictedInput
