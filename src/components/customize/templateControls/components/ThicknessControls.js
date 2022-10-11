import React from "react"

import { NumberInput, StyledLabel, RangeInput } from "../../../form/FormComponents"
import { ControlFlexWrapper, ControlFlexChild } from "./TemplateComponents"

function ThicknessControls({
  pageData,
  setPageData,
}) {
  return (
    <>
      <StyledLabel>Thickness</StyledLabel>
      <ControlFlexWrapper>
        <ControlFlexChild
          flex={1}
          margin="0 8px 0 0"
        >
          <NumberInput
            value={pageData.thickness}
            min={0.088}
            onChange={value => setPageData({
              ...pageData,
              thickness: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={0.01}
            max={3}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={3}
        >
          <RangeInput
            min={0.088}
            step={0.01}
            max={3}
            value={pageData.thickness}
            onChange={e => setPageData({
              ...pageData,
              thickness: parseFloat(e.target.value)
            })}
          />
        </ControlFlexChild>
      </ControlFlexWrapper>
    </>
  )
}

export default ThicknessControls