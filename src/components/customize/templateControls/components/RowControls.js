import React from "react"
import { colors } from "../../../../styles/variables"

import { NumberInput, StyledLabel } from "../../../form/FormComponents"
import { ControlInputGroup, ControlInnerButton } from "./TemplateComponents"

function RowControls({
  pageData,
  setPageData,
}) {
  return (
    <>
      <StyledLabel htmlFor="rows-input">Rows</StyledLabel>
      <ControlInputGroup>
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
            rows: 200,
          })}
        >
          Fill
        </ControlInnerButton>
      </ControlInputGroup>
    </>
  )
}

export default RowControls