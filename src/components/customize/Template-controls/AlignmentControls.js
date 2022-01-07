import React from "react"
import styled from "styled-components"
import { colors, convertToPx, convertToMM } from "../../../styles/variables"
import { AlignLeft, AlignCenterVertical, AlignRight, AlignTop, AlignBottom, AlignCenterHorizontal } from "phosphor-react"

import { Flexbox } from "../../layout/Flexbox"
import { StyledLabel } from "../../form/FormComponents"
import Content from "../../Content"
import Button from "../../Button"
import Icon from "../../Icon"

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
      <StyledLabel>Horizontal Alignment</StyledLabel>
      <AlignmentButtonWrapper>
        <AlignmentButton
          backgroundcolor={colors.white}
          borderradius="0.25rem"
          boxshadow="none"
          padding="0.25rem 0.5rem"
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
          onClick={() => changeAlignment("right")}
          className={pageData.alignmentHorizontal === "right" ? "is-active" : null}
        >
          Right
        </AlignmentButton>
      </AlignmentButtonWrapper>
      <StyledLabel>Vertical Alignment</StyledLabel>
      <AlignmentButtonWrapper>
        <AlignmentButton
          backgroundcolor={colors.white}
          borderradius="0.25rem"
          boxshadow="none"
          padding="0.25rem 0.5rem"
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
