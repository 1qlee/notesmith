import React, { useState } from "react"
import { colors } from "../../../../styles/variables"

import { NumberInput, StyledLabel } from "../../../form/FormComponents"
import { ControlInputGroup, ControlInnerButton } from "./TemplateComponents"

function StavesControls({
  pageData,
  setPageData,
  max,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <StyledLabel htmlFor="staves-input">Staves</StyledLabel>
      <ControlInputGroup
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NumberInput
          id="staves-input"
          value={pageData.staves}
          min={1}
          max={max}
          onChange={value => setPageData({
            ...pageData,
            alignmentVertical: "",
            staves: value,
          })}
          padding="8px 24px 8px 8px"
          step={1}
        />
        {isHovered && (
          <ControlInnerButton
            color={colors.gray.oneHundred}
            backgroundcolor={colors.gray.nineHundred}
            padding="4px"
            fontsize="0.75rem"
            onClick={() => setPageData({
              ...pageData,
              alignmentVertical: "",
              staves: max,
            })}
          >
            Fill
          </ControlInnerButton>
        )}
      </ControlInputGroup>
    </>
  )
}

export default StavesControls