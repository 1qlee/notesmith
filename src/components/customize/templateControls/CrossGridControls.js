import React from "react"

import { ControlFlexWrapper, ControlFlexChild } from "./components/TemplateComponents"
import RowControls from "./components/RowControls"
import ColumnControls from "./components/ColumnControls"
import OpacityControls from "./components/OpacityControls"
import RowSpacingControls from "./components/RowSpacingControls"
import ColumnSpacingControls from "./components/ColumnSpacingControls"
import CrossControls from "./components/CrossControls"

function CrossGridControls({
  max,
  pageData,
  setPageData,
  svgData,
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
      <RowSpacingControls 
        pageData={pageData}
        setPageData={setPageData}
      />
      <ColumnSpacingControls 
        pageData={pageData}
        setPageData={setPageData}
      />
      <CrossControls 
        step={0.1}
        max={56}
        min={1}
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

export default CrossGridControls
