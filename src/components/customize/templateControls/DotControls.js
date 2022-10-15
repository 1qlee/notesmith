import React from "react"

import { ControlFlexWrapper, ControlFlexChild } from "./components/TemplateComponents"
import AlignmentControls from "./components/AlignmentControls"
import ColumnControls from "./components/ColumnControls"
import ColumnSpacingControls from "./components/ColumnSpacingControls"
import MarginControls from "./components/MarginControls"
import OpacityControls from "./components/OpacityControls"
import RowControls from "./components/RowControls"
import RowSpacingControls from "./components/RowSpacingControls"

function DotControls({
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
      <ControlFlexWrapper>
        <ControlFlexChild
          margin="0 8px 0 0"
          flex={1}
        >
          <RowControls
            pageData={pageData}
            setPageData={setPageData}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={1}
        >
          <ColumnControls
            pageData={pageData}
            setPageData={setPageData}
          />
        </ControlFlexChild>
      </ControlFlexWrapper>
      <RowSpacingControls 
        pageData={pageData}
        setPageData={setPageData}
      />
      <ColumnSpacingControls 
        pageData={pageData}
        setPageData={setPageData}
      />
      <OpacityControls 
        pageData={pageData}
        setPageData={setPageData}
      />
    </>
  )
}

export default DotControls
