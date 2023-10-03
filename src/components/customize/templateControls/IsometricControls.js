import React from "react"

import AlignmentControls from "./components/AlignmentControls"
import MarginControls from "./components/MarginControls"
import AngleControls from "./components/AngleControls"
import SpacingControls from "./components/SpacingControls"
import OpacityControls from "./components/OpacityControls"
import StrokeWidthControls from "./components/StrokeWidthControls"
import BorderControls from "./components/BorderControls"

function IsometricControls({
  maximumMarginHeight,
  maximumMarginWidth,
  pageData,
  setPageData,
  svgSize,
}) {
  return (
    <>
      <AlignmentControls
        pageData={pageData}
        setPageData={setPageData}
        svgSize={svgSize}
      />
      <MarginControls
        pageData={pageData}
        setPageData={setPageData}
        maximumMarginHeight={maximumMarginHeight}
        maximumMarginWidth={maximumMarginWidth}
      />
      <BorderControls 
        pageData={pageData}
        setPageData={setPageData}
      />
      <AngleControls 
        pageData={pageData}
        setPageData={setPageData}
      />
      <SpacingControls
        pageData={pageData}
        setPageData={setPageData}
      />
      <OpacityControls
        pageData={pageData}
        setPageData={setPageData}
      />
      <StrokeWidthControls
        pageData={pageData}
        setPageData={setPageData}
      />
    </>
  )
}

export default IsometricControls
