import React from "react"
import { convertFloatFixed, convertToMM, convertToPx } from "../../../../utils/helper-functions"

import { StyledLabel } from "../../../form/FormComponents"
import ToggleControls from "./ToggleControls"

function AlignmentControls({ 
  dimensions,
  pageData, 
  setPageData,
  selectedPageSvg,
}) {
  const { maxContentHeight, maxContentWidth, strokeWidth, crossSize } = pageData
  let pageBbox = selectedPageSvg.getBBox()
  console.log("🚀 ~ pageBbox:", pageBbox)
  const yStrokeOffset = Math.sqrt(2 * strokeWidth ** 2) / 2

  const contentHeight = convertFloatFixed(pageBbox.height, 3)
  const contentWidth = convertFloatFixed(pageBbox.width, 3)
  let verticalTrim, horizontalTrim = 0
  const roundingError = 0.002

  switch(pageData.template) {
    case "ruled":
      verticalTrim = strokeWidth + roundingError
      horizontalTrim = 0
      break
    case "dot":
      verticalTrim = 0
      horizontalTrim = 0
      break
    case "graph":
      verticalTrim = strokeWidth + roundingError
      horizontalTrim = strokeWidth * 2 + roundingError
      break
    case "hexagon":
      verticalTrim = yStrokeOffset + roundingError
      horizontalTrim = strokeWidth + roundingError
      break
    case "music":
      verticalTrim = strokeWidth + roundingError
      horizontalTrim = 0
      break
    case "handwriting":
      verticalTrim = strokeWidth + roundingError
      horizontalTrim = 0
      break
    case "cross":
      verticalTrim = strokeWidth * 4
      horizontalTrim = strokeWidth * 4
      break
    case "calligraphy":
      verticalTrim = strokeWidth + roundingError
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
