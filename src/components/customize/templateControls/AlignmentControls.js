import React from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

import { StyledLabel } from "../../form/FormComponents"
import Button from "../../Button"

const AlignmentButtonWrapper = styled.div`
  display: flex;
  border: 1px solid ${colors.gray.threeHundred};
  background-color: ${colors.white};
  padding: 0.25rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
`

const AlignmentButton = styled(Button)`
  flex: 1;
  &:not(:last-child) {
    margin-right: 2px;
  }
  &:hover,
  &:focus {
    background-color: ${colors.primary.hover};
  }
  &.is-active {
    background-color: ${colors.primary.sixHundred};
    color: ${colors.primary.white};
  }
`

function AlignmentControls({ pageData, setPageData, changeAlignment }) {
  return (
    <>
      <StyledLabel>Horizontal alignment</StyledLabel>
      <AlignmentButtonWrapper>
        <AlignmentButton
          backgroundcolor={colors.white}
          borderradius="0.25rem"
          boxshadow="none"
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("left")}
          className={pageData.alignmentHorizontal === "left" ? "is-active" : null}
        >
          Left
        </AlignmentButton>
        <AlignmentButton
          backgroundcolor={colors.white}
          borderradius="0.25rem"
          boxshadow="none"
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("center")}
          className={pageData.alignmentHorizontal === "center" ? "is-active" : null}
        >
          Center
        </AlignmentButton>
        <AlignmentButton
          backgroundcolor={colors.white}
          borderradius="0.25rem"
          boxshadow="none"
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("right")}
          className={pageData.alignmentHorizontal === "right" ? "is-active" : null}
        >
          Right
        </AlignmentButton>
      </AlignmentButtonWrapper>
      <StyledLabel>Vertical alignment</StyledLabel>
      <AlignmentButtonWrapper>
        <AlignmentButton
          backgroundcolor={colors.white}
          borderradius="0.25rem"
          boxshadow="none"
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("top")}
          className={pageData.alignmentVertical === "top" ? "is-active" : null}
        >
          Top
        </AlignmentButton>
        <AlignmentButton
          backgroundcolor={colors.white}
          borderradius="0.25rem"
          boxshadow="none"
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("middle")}
          className={pageData.alignmentVertical === "middle" ? "is-active" : null}
        >
          Middle
        </AlignmentButton>
        <AlignmentButton
          backgroundcolor={colors.white}
          borderradius="0.25rem"
          boxshadow="none"
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("bottom")}
          className={pageData.alignmentVertical === "bottom" ? "is-active" : null}
        >
          Bottom
        </AlignmentButton>
      </AlignmentButtonWrapper>
    </>
  )
}

export default AlignmentControls
