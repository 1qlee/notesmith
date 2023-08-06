import React, { useState } from "react"
import { colors } from "../../../../styles/variables"

import { NumberInput, StyledLabel } from "../../../form/FormComponents"
import { ControlInputGroup, ControlInnerButton } from "./TemplateComponents"

function RowControls({
  pageData,
  max,
  setPageData,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <StyledLabel htmlFor="rows-input">Rows</StyledLabel>
      <ControlInputGroup
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NumberInput
          id="rows-input"
          value={pageData.rows}
          min={1}
          onChange={value => setPageData({
            ...pageData,
            alignmentVertical: "",
            rows: value,
          })}
          padding="8px 24px 8px 8px"
          max={max}
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
              rows: max,
            })}
          >
            Fill
          </ControlInnerButton>
        )}
      </ControlInputGroup>
    </>
  )
}

export default RowControls