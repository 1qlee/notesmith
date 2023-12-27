import React from "react"

import { ControlFlexChild, ControlFlexWrapper } from "./components/TemplateComponents"
import RowControls from "./components/RowControls"
import OpacityControls from "./components/OpacityControls"
import StrokeWidthControls from "./components/StrokeWidthControls"
import RangeControls from "./components/RangeControls"
import ColumnControls from "./components/ColumnControls"

function HexagonControls({
  max,
  pageData,
  setPageData,
}) {
  return (
    <>
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
      <StrokeWidthControls 
        pageData={pageData}
        setPageData={setPageData}
      />
    </>
  )
}

export default HexagonControls
