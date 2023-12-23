import React from "react"

import AlignmentControls from "./components/AlignmentControls"
import RowControls from "./components/RowControls"
import CalligraphySpacingControls from "./components/CalligraphySpacingControls"
import OpacityControls from "./components/OpacityControls"
import StrokeWidthControls from "./components/StrokeWidthControls"
import SlantControls from "./components/SlantControls"
import StaffSpacingControls from "./components/StaffSpacingControls"
import { ControlWrapper } from "./components/TemplateComponents"

function CalligraphyControls({
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
        <RowControls
          max={max.rows}
          pageData={pageData}
          setPageData={setPageData}
        />
      </ControlWrapper>
      <CalligraphySpacingControls
        pageData={pageData}
        setPageData={setPageData}
      />
      <SlantControls
        max={max.slants}
        pageData={pageData}
        setPageData={setPageData}
      />
      <StaffSpacingControls
        name="Row spacing"
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

export default CalligraphyControls
