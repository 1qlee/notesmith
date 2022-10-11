import React from "react"

import { NumberInput, StyledLabel, RangeInput } from "../../../form/FormComponents"
import { ControlFlexWrapper, ControlFlexChild } from "./TemplateComponents"

function SpacingControls({
  pageData,
  setPageData,
}) {
  return (
    <>
      <StyledLabel>Spacing</StyledLabel>
      <ControlFlexWrapper>
        <ControlFlexChild
          flex={1}
          margin="0 8px 0 0"
        >
          <NumberInput
            value={pageData.spacing}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              spacing: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={3}
        >
          <RangeInput
            min={1}
            step={1}
            max={255}
            value={pageData.spacing}
            onChange={e => setPageData({
              ...pageData,
              alignmentVertical: "",
              spacing: parseFloat(e.target.value)
            })}
          />
        </ControlFlexChild>
      </ControlFlexWrapper>
    </>
  )
}

export default SpacingControls