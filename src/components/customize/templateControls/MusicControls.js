import React from "react"

import { ControlWrapper } from "./components/TemplateComponents"
import AlignmentControls from "./components/AlignmentControls"
import OpacityControls from "./components/OpacityControls"
import SpacingControls from "./components/SpacingControls"
import StaffSpacingControls from "./components/StaffSpacingControls"
import StavesControls from "./components/StavesControls"
import StrokeWidthControls from "./components/StrokeWidthControls"

function MusicControls({
  max,
  pageData,
  setPageData,
  svgData,
}) {
  return (
    <>
      <AlignmentControls
        pageData={pageData}
        setPageData={setPageData}
        svgData={svgData}
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
