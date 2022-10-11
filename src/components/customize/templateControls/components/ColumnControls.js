import React from "react"
import { colors } from "../../../../styles/variables"

import { NumberInput, StyledLabel } from "../../../form/FormComponents"
import { ControlWrapper, ControlInputGroup, ControlInnerButton } from "./TemplateComponents"
import Button from "../../../Button"

function ColumnControls({
  pageData,
  setPageData,
}) {
  return (
    <ControlWrapper>
      <StyledLabel htmlFor="column-input">Columns</StyledLabel>
      <ControlInputGroup>
        <NumberInput
          id="column-input"
          value={pageData.columns}
          min={1}
          onChange={value => setPageData({
            ...pageData,
            alignmentHorizontal: "",
            columns: value,
          })}
          padding="0.5rem 1.5rem 0.5rem 0.5rem"
          step={1}
        />
        <ControlInnerButton
          backgroundcolor={colors.gray.oneHundred}
          color={colors.gray.nineHundred}
          padding="4px"
          fontsize="0.75rem"
          onClick={() => setPageData({
            ...pageData,
            alignmentHorizontal: "",
            columns: 200,
          })}
        >
          Fill
        </ControlInnerButton>
      </ControlInputGroup>
    </ControlWrapper>
  )
}

export default ColumnControls