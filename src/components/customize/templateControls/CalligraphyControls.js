import React from "react"

import AlignmentControls from "./components/AlignmentControls"
import MarginControls from "./components/MarginControls"
import RowControls from "./components/RowControls"
import CalligraphySpacingControls from "./components/CalligraphySpacingControls"
import OpacityControls from "./components/OpacityControls"
import ThicknessControls from "./components/ThicknessControls"
import SlantControls from "./components/SlantControls"
import StaffSpacingControls from "./components/StaffSpacingControls"
import { ControlWrapper } from "./components/TemplateComponents"

function CalligraphyControls({
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
      <ThicknessControls
        pageData={pageData}
        setPageData={setPageData}
      />
    </>
  )
}

export default CalligraphyControls
