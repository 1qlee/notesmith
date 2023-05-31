import React from "react"

import { NumberInput, StyledLabel, RangeInput } from "../../../form/FormComponents"
import { ControlFlexWrapper, ControlFlexChild } from "./TemplateComponents"

function RangeControls({
  property,
  propertyName,
  propertyObj,
  inputProps,
  pageData,
  setPageData,
}) {
  const { min, max, step } = inputProps

  return (
    <>
      <StyledLabel htmlFor={property}>{propertyName}</StyledLabel>
      <ControlFlexWrapper>
        <ControlFlexChild
          flex={2}
          margin="0 8px 0 0"
        >
          <NumberInput
            id={property}
            value={pageData[property]}
            min={min}
            onChange={value => setPageData({
              ...pageData,
              ...propertyObj,
              [property]: value,
            })}
            max={max}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={step}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={5}
        >
          <RangeInput
            min={min}
            step={step}
            max={max}
            value={pageData[property]}
            onChange={e => setPageData({
              ...pageData,
              ...propertyObj,
              [property]: parseFloat(e.target.value)
            })}
          />
        </ControlFlexChild>
      </ControlFlexWrapper>
    </>
  )
}

export default RangeControls