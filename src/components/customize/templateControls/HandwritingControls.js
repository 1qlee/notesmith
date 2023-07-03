import React from "react"

import { ControlWrapper } from "./components/TemplateComponents"
import AlignmentControls from "./components/AlignmentControls"
import MarginControls from "./components/MarginControls"
import RowControls from "./components/RowControls"
import SpacingControls from "./components/SpacingControls"
import OpacityControls from "./components/OpacityControls"
import ThicknessControls from "./components/ThicknessControls"
import StaffSpacingControls from "./components/StaffSpacingControls"
import DashedLineControls from "./components/DashedLineControls"

function HandwritingControls({
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
      <DashedLineControls
        pageData={pageData}
        setPageData={setPageData}
      />
      <ControlWrapper>
        <RowControls
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

export default HandwritingControls
