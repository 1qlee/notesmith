import React, { useState } from "react"
import { colors } from "../../../../styles/variables"

import { ControlFlexWrapper, ControlFlexChild, ControlInnerButton } from "./TemplateComponents"
import { StyledLabel, NumberInput } from "../../../form/FormComponents"

function SlantControls({
  max,
  pageData,
  setPageData,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <ControlFlexWrapper
      align="flex-end"
    >
      <ControlFlexChild
        flex={1}
        margin="0 8px 0 0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <StyledLabel htmlFor="slants-input">Slants</StyledLabel>
        <NumberInput
          id="slants-input"
          value={pageData.slants}
          min={1}
          max={max}
          onChange={value => setPageData({
            ...pageData,
            alignmentVertical: "",
            slants: value,
          })}
          padding="8px 24px 8px 8px"
          step={1}
        />
        {isHovered && (
          <ControlInnerButton
            backgroundcolor={colors.gray.nineHundred}
            color={colors.gray.oneHundred}
            fontsize="0.75rem"
            top="38px"
            padding="4px"
            onClick={() => setPageData({
              ...pageData,
              alignmentVertical: "",
              slants: max,
            })}
          >
            Fill
          </ControlInnerButton>
        )}
      </ControlFlexChild>
      <ControlFlexChild
        flex={1}
        margin="0 8px 0 0"
      >
        <StyledLabel htmlFor="slant-spacing-input">Slant spacing</StyledLabel>
        <NumberInput
          id="slant-spacing-input"
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
        <StyledLabel htmlFor="slant-angle-input">Slant angle</StyledLabel>
        <NumberInput
          id="slant-angle-input"
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