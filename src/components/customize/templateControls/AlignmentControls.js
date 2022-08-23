import React from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

import { StyledLabel } from "../../form/FormComponents"
import Button from "../../Button"

const AlignmentButtonWrapper = styled.div`
  display: flex;
  border: 1px solid ${colors.gray.nineHundred};
  background-color: ${colors.white};
  padding: 0.25rem;
  margin-bottom: 1rem;
`

const AlignmentButton = styled(Button)`
  background-color: ${colors.white};
  font-size: 0.75rem;
  padding: 0.25rem;
  flex: 1;
  position: relative;
  &:not(:last-child) {
    margin-right: 2px;
  }
  &:hover,
  &:focus {
    box-shadow: none;
    background-color: ${colors.gray.threeHundred};
  }
  &.is-active {
    color: ${colors.gray.oneHundred};
    background-color: ${colors.gray.nineHundred};
  }
`

function AlignmentControls({ pageData, setPageData, changeAlignment }) {
  return (
    <>
      <StyledLabel>Horizontal alignment</StyledLabel>
      <AlignmentButtonWrapper>
        <AlignmentButton
          onClick={() => changeAlignment("left")}
          className={pageData.alignmentHorizontal === "left" ? "is-active" : null}
        >
          <span>Left</span>
        </AlignmentButton>
        <AlignmentButton
          onClick={() => changeAlignment("center")}
          className={pageData.alignmentHorizontal === "center" ? "is-active" : null}
        >
          <span>Center</span>
        </AlignmentButton>
        <AlignmentButton
          onClick={() => changeAlignment("right")}
          className={pageData.alignmentHorizontal === "right" ? "is-active" : null}
        >
          <span>Right</span>
        </AlignmentButton>
      </AlignmentButtonWrapper>
      <StyledLabel>Vertical alignment</StyledLabel>
      <AlignmentButtonWrapper>
        <AlignmentButton
          onClick={() => changeAlignment("top")}
          className={pageData.alignmentVertical === "top" ? "is-active" : null}
        >
          <span>Top</span>
        </AlignmentButton>
        <AlignmentButton
          onClick={() => changeAlignment("middle")}
          className={pageData.alignmentVertical === "middle" ? "is-active" : null}
        >
          <span>Middle</span>
        </AlignmentButton>
        <AlignmentButton
          onClick={() => changeAlignment("bottom")}
          className={pageData.alignmentVertical === "bottom" ? "is-active" : null}
        >
          <span>Bottom</span>
        </AlignmentButton>
      </AlignmentButtonWrapper>
    </>
  )
}

export default AlignmentControls
