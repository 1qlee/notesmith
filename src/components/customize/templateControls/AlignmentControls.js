import React from "react"
import styled from "styled-components"
import { colors, convertFloatFixed, convertToMM } from "../../../styles/variables"

import { StyledLabel } from "../../form/FormComponents"
import Button from "../../Button"

const AlignmentButtonWrapper = styled.div`
  display: flex;
  border: 1px solid ${colors.gray.nineHundred};
  border-radius: 0.25rem;
  background-color: ${colors.white};
  padding: 0.25rem;
  margin-bottom: 1rem;
`

const AlignmentButton = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.gray.nineHundred};
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

function AlignmentControls({ 
  pageData, 
  setPageData,
  svgSize,
}) {
  const { maxContentHeight, maxContentWidth, marginLeft, marginTop, marginBottom, marginRight } = pageData
  const contentHeight = svgSize.height
  const contentWidth = svgSize.width
  console.log(maxContentHeight, maxContentWidth)
  console.log(contentHeight, contentWidth)
  const horizontalSpace = convertToMM(maxContentWidth - contentWidth)
  const verticalSpace = convertToMM(maxContentHeight - contentHeight)
  const horizontalCenter = convertFloatFixed(horizontalSpace / 2, 3)
  const verticalCenter = convertFloatFixed(verticalSpace / 2, 3)

  function changeAlignment(value) {
    switch (value) {
      case "left":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginRight: horizontalSpace,
          marginLeft: 0,
        })
        break
      case "center":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: horizontalCenter,
          marginRight: horizontalCenter,
        })
        break
      case "right":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: horizontalSpace,
          marginRight: 0,
        })
        break
      case "top":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: 0,
        })
        break
      case "middle":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: verticalCenter,
        })
        break
      case "bottom":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: verticalSpace,
        })
        break
      default:
        break
    }
  }

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
