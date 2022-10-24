import React from "react"

import { ControlFlexWrapper, ControlFlexChild } from "./TemplateComponents"
import { StyledLabel, NumberInput } from "../../../form/FormComponents"

function CalligraphySpacingControls({
  pageData,
  setPageData
}) {
  return (
    <ControlFlexWrapper
      alignitems="flex-end"
    >
      <ControlFlexChild
        flex={1}
        margin="0 8px 0 0"
      >
        <StyledLabel>Ascender spacing</StyledLabel>
        <NumberInput
          value={pageData.ascSpacing}
          min={1}
          onChange={value => setPageData({
            ...pageData,
            alignmentVertical: "",
            ascSpacing: value,
          })}
          padding="0.5rem 1.5rem 0.5rem 0.5rem"
          step={1}
        />
      </ControlFlexChild>
      <ControlFlexChild
        flex={1}
        margin="0 8px 0 0"
      >
        <StyledLabel>X-height</StyledLabel>
        <NumberInput
          value={pageData.xHeight}
          min={1}
          onChange={value => setPageData({
            ...pageData,
            alignmentVertical: "",
            xHeight: value,
          })}
          padding="0.5rem 1.5rem 0.5rem 0.5rem"
          step={1}
        />
      </ControlFlexChild>
      <ControlFlexChild
        flex={1}
      >
        <StyledLabel>Descender spacing</StyledLabel>
        <NumberInput
          value={pageData.dscSpacing}
          min={1}
          onChange={value => setPageData({
            ...pageData,
            alignmentVertical: "",
            dscSpacing: value,
          })}
          padding="0.5rem 1.5rem 0.5rem 0.5rem"
          step={1}
        />
      </ControlFlexChild>
    </ControlFlexWrapper>
  )
}

export default CalligraphySpacingControls