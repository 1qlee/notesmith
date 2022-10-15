import React from "react"

import { ControlWrapper } from "./components/TemplateComponents"
import AlignmentControls from "./components/AlignmentControls"
import MarginControls from "./components/MarginControls"
import RowControls from "./components/RowControls"
import RangeControls from "./components/RangeControls"
import OpacityControls from "./components/OpacityControls"
import ThicknessControls from "./components/ThicknessControls"

function RuledControls({
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
      <ControlWrapper>
        <RowControls
          pageData={pageData}
          setPageData={setPageData}
        />
      </ControlWrapper>
      <RangeControls 
        property="spacing"
        propertyName="Spacing"
        propertyObj={{}}
        inputProps={{
          min: 1,
          max: 255,
          step: 1,
        }}
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

export default RuledControls
