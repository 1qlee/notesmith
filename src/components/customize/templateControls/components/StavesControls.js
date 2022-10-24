import React from "react"
import { colors } from "../../../../styles/variables"

import { NumberInput, StyledLabel } from "../../../form/FormComponents"
import { ControlInputGroup, ControlInnerButton } from "./TemplateComponents"

function StavesControls({
  pageData,
  setPageData,
}) {
  return (
    <>
      <StyledLabel htmlFor="staves-input">Staves</StyledLabel>
      <ControlInputGroup>
        <NumberInput
          id="staves-input"
          value={pageData.staves}
          min={1}
          onChange={value => setPageData({
            ...pageData,
            alignmentVertical: "",
            staves: value,
          })}
          padding="8px 24px 8px 8px"
          step={1}
        />
        <ControlInnerButton
          backgroundcolor={colors.gray.oneHundred}
          color={colors.gray.nineHundred}
          padding="4px"
          fontsize="0.75rem"
          onClick={() => setPageData({
            ...pageData,
            alignmentVertical: "",
            staves: 200,
          })}
        >
          Fill
        </ControlInnerButton>
      </ControlInputGroup>
    </>
  )
}

export default StavesControls