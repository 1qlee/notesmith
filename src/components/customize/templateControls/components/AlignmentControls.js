import React from "react"
import { convertFloatFixed, convertToMM } from "../../../../utils/helper-functions"

import { StyledLabel } from "../../../form/FormComponents"
import ToggleControls from "./ToggleControls"

function AlignmentControls({ 
  pageData, 
  setPageData,
  selectedPageSvg,
}) {
  const { maxContentHeight, maxContentWidth, strokeWidth } = pageData
  let pageBbox = selectedPageSvg.getBBox()

  const contentHeight = convertFloatFixed(pageBbox.height, 3)
  const contentWidth = convertFloatFixed(pageBbox.width, 3)
  let verticalTrim, horizontalTrim = 0

  switch(pageData.template) {
    case "ruled":
      verticalTrim = strokeWidth
      horizontalTrim = 0
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
      horizontalTrim = 0
      break
    case "handwriting":
      verticalTrim = strokeWidth
      horizontalTrim = 0
      break
    case "cross":
      verticalTrim = 0.333
      horizontalTrim = strokeWidth * 2
      break
    case "calligraphy":
      verticalTrim = 0.333
      horizontalTrim = 0
      break
    case "isometric":
      pageData.borderData.toggle ? horizontalTrim = 0 : horizontalTrim = strokeWidth / 2
      verticalTrim = 0
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
      <ToggleControls 
        data={[
          { name: "left" },
          { name: "center" },
          { name: "right" },
        ]}
        value={pageData.alignmentHorizontal}
        setData={changeAlignment}
      />
      <StyledLabel>Vertical alignment</StyledLabel>
      <ToggleControls
        data={[
          { name: "top" },
          { name: "middle" },
          { name: "bottom" },
        ]}
        value={pageData.alignmentVertical}
        setData={changeAlignment}
      />
    </>
  )
}

export default AlignmentControls
