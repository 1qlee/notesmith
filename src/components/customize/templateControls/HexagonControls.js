import React from "react"

import { ControlWrapper } from "./components/TemplateComponents"
import AlignmentControls from "./components/AlignmentControls"
import MarginControls from "./components/MarginControls"
import RowControls from "./components/RowControls"
import OpacityControls from "./components/OpacityControls"
import ThicknessControls from "./components/ThicknessControls"
import RangeControls from "./components/RangeControls"

function HexagonControls({
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
        maximumMarginHeight={maximumMarginHeight}
        maximumMarginWidth={maximumMarginWidth}
        pageData={pageData}
        setPageData={setPageData}
      />
      <ControlWrapper>
        <RowControls
          pageData={pageData}
          setPageData={setPageData}
        />
      </ControlWrapper>
      <RangeControls 
        property="hexagonRadius"
        propertyName="Hexagon radius"
        propertyObj={{}}
        inputProps={{
          min: 1,
          max: 100,
          step: 0.1,
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

export default HexagonControls
