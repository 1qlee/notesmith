import React from "react"
import styled from "styled-components"
import { colors } from "../../../../styles/variables"
import { convertFloatFixed, convertToMM } from "../../../../utils/helper-functions"

import { StyledLabel } from "../../../form/FormComponents"
import Button from "../../../ui/Button"

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
  font-size: 0.875rem;
  padding: 0.25rem;
  flex: 1;
  position: relative;
  &:not(:last-child) {
    margin-right: 2px;
  }
  &:hover,
  &:focus {
    box-shadow: none;
    background-color: ${colors.gray.twoHundred};
  }
  &.is-active {
    color: ${colors.gray.oneHundred};
    background-color: ${colors.gray.nineHundred};
  }
`

function AlignmentControls({ 
  pageData, 
  setPageData,
  selectedPageSvg,
}) {
  const { maxContentHeight, maxContentWidth, strokeWidth } = pageData
  let pageBbox = selectedPageSvg.getBBox()

  const contentHeight = pageBbox.height
  const contentWidth = pageBbox.width
  let verticalTrim, horizontalTrim = 0

  switch(pageData.template) {
    case "ruled":
      verticalTrim = strokeWidth
      break
    case "graph":
      verticalTrim = strokeWidth
      horizontalTrim = strokeWidth * 2
      break
    case "hexagon":
      verticalTrim = strokeWidth
      horizontalTrim = strokeWidth
      break
    case "music":
      verticalTrim = strokeWidth
      break
    case "handwriting":
      verticalTrim = strokeWidth
      break
    case "cross":
      verticalTrim = 0.333
      horizontalTrim = strokeWidth * 2
      break
    case "calligraphy":
      verticalTrim = 0.333
      horizontalTrim = 0
      break
    default:
      verticalTrim = 0
      horizontalTrim = 0
      break
  }

  let horizontalSpace = convertFloatFixed(convertToMM(maxContentWidth - contentWidth) - horizontalTrim, 3)
  if (horizontalSpace < 0) {
    horizontalSpace = 0
  }
  const horizontalCenter = convertFloatFixed(horizontalSpace / 2, 3)
  let verticalSpace = convertFloatFixed(convertToMM(maxContentHeight - contentHeight) - verticalTrim, 3)
  if (verticalSpace < 0) {
    verticalSpace = 0
  }
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
          marginBottom: verticalSpace,
        })
        break
      case "middle":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: verticalCenter,
          marginBottom: verticalCenter,
        })
        break
      case "bottom":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: verticalSpace,
          marginBottom: 0,
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
