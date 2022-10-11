import React from "react"

import { NumberInput, StyledLabel, RangeInput } from "../../../form/FormComponents"
import { ControlFlexWrapper, ControlFlexChild } from "./TemplateComponents"

function OpacityControls({
  pageData,
  setPageData,
}) {
  return (
    <>
      <StyledLabel>Opacity</StyledLabel>
      <ControlFlexWrapper>
        <ControlFlexChild
          flex={1}
          margin="0 8px 0 0"
        >
          <NumberInput
            value={pageData.opacity}
            min={0.5}
            onChange={value => setPageData({
              ...pageData,
              opacity: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={0.01}
            max={1}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={3}
        >
          <RangeInput
            min={0.5}
            step={0.01}
            max={1}
            value={pageData.opacity}
            onChange={e => setPageData({
              ...pageData,
              opacity: parseFloat(e.target.value)
            })}
          />
        </ControlFlexChild>
      </ControlFlexWrapper>
    </>
  )
}

export default OpacityControls