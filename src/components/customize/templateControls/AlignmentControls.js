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
  border-radius: 0.5rem 0.25rem 0.75rem 1rem / 1rem 0.25rem 0.75rem 0.5rem;
  flex: 1;
  position: relative;
  span {
    color: ${colors.gray.nineHundred};
    position: relative;
    transition: color 0.2s;
    z-index: 99;
  }
  &:not(:last-child) {
    margin-right: 2px;
  }
  &:hover,
  &:focus {
    box-shadow: none;
    background-color: ${colors.gray.twoHundred};
    &:not(.is-active) {
      box-shadow: 0 0 -1px ${colors.gray.threeHundred};
    }
  }
  &.is-active {
    &::before {
      transform: translateX(5px);
      width: 100%;
      opacity: 1;
    }
    span {
      color: ${colors.gray.oneHundred};
    }
  }
  &::before {
    background-color: ${colors.gray.nineHundred};
    border-radius: 0.5rem;
    opacity: 0;
    content: "";
    height: 100%;
    left: -5px;
    position: absolute;
    top: 0;
    transition: transform 0.2s, width 0.2s ease-in, background-color 0.2s;
    width: 0;
    will-change: width, transform;
  }
`

function AlignmentControls({ pageData, setPageData, changeAlignment }) {
  return (
    <>
      <StyledLabel>Horizontal alignment</StyledLabel>
      <AlignmentButtonWrapper>
        <AlignmentButton
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("left")}
          className={pageData.alignmentHorizontal === "left" ? "is-active" : null}
        >
          <span>Left</span>
        </AlignmentButton>
        <AlignmentButton
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("center")}
          className={pageData.alignmentHorizontal === "center" ? "is-active" : null}
        >
          <span>Center</span>
        </AlignmentButton>
        <AlignmentButton
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("right")}
          className={pageData.alignmentHorizontal === "right" ? "is-active" : null}
        >
          <span>Right</span>
        </AlignmentButton>
      </AlignmentButtonWrapper>
      <StyledLabel>Vertical alignment</StyledLabel>
      <AlignmentButtonWrapper>
        <AlignmentButton
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("top")}
          className={pageData.alignmentVertical === "top" ? "is-active" : null}
        >
          <span>Top</span>
        </AlignmentButton>
        <AlignmentButton
          boxshadow="none"
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
          onClick={() => changeAlignment("middle")}
          className={pageData.alignmentVertical === "middle" ? "is-active" : null}
        >
          <span>Middle</span>
        </AlignmentButton>
        <AlignmentButton
          padding="0.25rem 0.5rem"
          fontsize="0.75rem"
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
