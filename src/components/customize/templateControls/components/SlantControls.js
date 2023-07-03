import React from "react"

import { ControlFlexWrapper, ControlFlexChild } from "./TemplateComponents"
import { StyledLabel, NumberInput } from "../../../form/FormComponents"

function SlantControls({
  pageData,
  setPageData,
}) {
  return (
    <ControlFlexWrapper
      alignitems="flex-end"
    >
      <ControlFlexChild
        flex={1}
        margin="0 8px 0 0"
      >
        <StyledLabel>Slants</StyledLabel>
        <NumberInput
          value={pageData.slants}
          min={1}
          onChange={value => setPageData({
            ...pageData,
            alignmentVertical: "",
            slants: value,
          })}
          padding="0.5rem 1.5rem 0.5rem 0.5rem"
          step={1}
        />
      </ControlFlexChild>
      <ControlFlexChild
        flex={1}
        margin="0 8px 0 0"
      >
        <StyledLabel>Slant spacing</StyledLabel>
        <NumberInput
          value={pageData.slantSpacing}
          min={1}
          onChange={value => setPageData({
            ...pageData,
            alignmentVertical: "",
            slantSpacing: value,
          })}
          padding="0.5rem 1.5rem 0.5rem 0.5rem"
          step={1}
        />
      </ControlFlexChild>
      <ControlFlexChild
        flex={1}
      >
        <StyledLabel>Slant angle</StyledLabel>
        <NumberInput
          value={pageData.slantAngle}
          min={-90}
          max={90}
          onChange={value => setPageData({
            ...pageData,
            alignmentVertical: "",
            slantAngle: value,
          })}
          padding="0.5rem 1.5rem 0.5rem 0.5rem"
          step={1}
        />
      </ControlFlexChild>
    </ControlFlexWrapper>
  )
}

export default SlantControls