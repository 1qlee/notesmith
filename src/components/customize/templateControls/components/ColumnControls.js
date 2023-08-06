import React, { useState } from "react"
import { colors } from "../../../../styles/variables"

import { NumberInput, StyledLabel } from "../../../form/FormComponents"
import { ControlInputGroup, ControlInnerButton } from "./TemplateComponents"

function ColumnControls({
  max,
  pageData,
  setPageData,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <StyledLabel htmlFor="column-input">Columns</StyledLabel>
      <ControlInputGroup
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NumberInput
          id="column-input"
          value={pageData.columns}
          min={1}
          max={max}
          onChange={value => setPageData({
            ...pageData,
            alignmentHorizontal: "",
            columns: value,
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
              alignmentHorizontal: "",
              columns: max,
            })}
          >
            Fill
          </ControlInnerButton>
        )}
      </ControlInputGroup>
    </>
  )
}

export default ColumnControls