import React from "react"

import { ControlWrapper } from "./components/TemplateComponents"
import AlignmentControls from "./components/AlignmentControls"
import MarginControls from "./components/MarginControls"
import OpacityControls from "./components/OpacityControls"
import SpacingControls from "./components/SpacingControls"
import StaffSpacingControls from "./components/StaffSpacingControls"
import StavesControls from "./components/StavesControls"
import StrokeWidthControls from "./components/StrokeWidthControls"

function MusicControls({
  maximumMarginHeight,
  maximumMarginWidth,
  max,
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
      <ControlWrapper>
        <StavesControls
          max={max.staves}
          pageData={pageData}
          setPageData={setPageData}
        />
      </ControlWrapper>
      <SpacingControls 
        name="Line spacing"
        pageData={pageData}
        setPageData={setPageData}
      />
      <StaffSpacingControls 
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

export default MusicControls
