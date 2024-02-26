import React from "react"

import RowControls from "./components/RowControls"
import CalligraphySpacingControls from "./components/CalligraphySpacingControls"
import OpacityControls from "./components/OpacityControls"
import StrokeWidthControls from "./components/StrokeWidthControls"
import SlantControls from "./components/SlantControls"
import RowSpacingControls from "./components/RowSpacingControls"
import { ControlWrapper } from "./components/TemplateComponents"

function CalligraphyControls({
  max,
  pageData,
  setPageData,
  svgData,
}) {
  return (
    <>
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
      <RowSpacingControls
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
