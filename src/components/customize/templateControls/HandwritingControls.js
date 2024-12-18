import React from "react"

import { ControlWrapper } from "./components/TemplateComponents"
import RowControls from "./components/RowControls"
import SpacingControls from "./components/SpacingControls"
import OpacityControls from "./components/OpacityControls"
import StrokeWidthControls from "./components/StrokeWidthControls"
import RowSpacingControls from "./components/RowSpacingControls"
import DashedLineControls from "./components/DashedLineControls"

function HandwritingControls({
  max,
  pageData,
  setPageData,
}) {
  return (
    <>
      <DashedLineControls
        pageData={pageData}
        setPageData={setPageData}
      />
      <ControlWrapper>
        <RowControls
          max={max.rows}
          pageData={pageData}
          setPageData={setPageData}
        />
      </ControlWrapper>
      <SpacingControls
        name="Line spacing"
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

export default HandwritingControls
