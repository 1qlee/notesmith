import React from "react"

import { ControlFlexWrapper, ControlFlexChild } from "./components/TemplateComponents"
import AlignmentControls from "./components/AlignmentControls"
import ColumnControls from "./components/ColumnControls"
import MarginControls from "./components/MarginControls"
import OpacityControls from "./components/OpacityControls"
import RowControls from "./components/RowControls"
import ThicknessControls from "./components/ThicknessControls"
import SpacingControls from "./components/SpacingControls"
import RangeControls from "./components/RangeControls"

function SeyesControls({
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
      <ControlFlexWrapper>
        <ControlFlexChild
          margin="0 8px 0 0"
          flex={1}
        >
          <RowControls
            max={max.rows}
            pageData={pageData}
            setPageData={setPageData}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={1}
        >
          <ColumnControls
            max={max.columns}
            pageData={pageData}
            setPageData={setPageData}
          />
        </ControlFlexChild>
      </ControlFlexWrapper>
      <RangeControls
        property="rowSpacing"
        propertyName="Header spacing"
        propertyObj={{ alignmentVertical: "" }}
        inputProps={{
          min: 0,
          max: 255,
          step: 1,
        }}
        pageData={pageData}
        setPageData={setPageData}
      />
      <RangeControls
        property="columnSpacing"
        propertyName="Side margin spacing"
        propertyObj={{ alignmentVertical: "" }}
        inputProps={{
          min: 0,
          max: 255,
          step: 1,
        }}
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
      <ThicknessControls 
        pageData={pageData}
        setPageData={setPageData}
      />
    </>
  )
}

export default SeyesControls
