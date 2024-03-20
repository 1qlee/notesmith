import React from "react"

import { ControlFlexWrapper, ControlFlexChild } from "./components/TemplateComponents"
import ColumnControls from "./components/ColumnControls"
import ColumnSpacingControls from "./components/ColumnSpacingControls"
import OpacityControls from "./components/OpacityControls"
import RowControls from "./components/RowControls"
import RowSpacingControls from "./components/RowSpacingControls"
import RadiusControls from "./components/RadiusControls"

function DotControls({
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
      <RowSpacingControls 
        pageData={pageData}
        setPageData={setPageData}
      />
      <ColumnSpacingControls 
        pageData={pageData}
        setPageData={setPageData}
      />
      <RadiusControls 
        step={0.025}
        max={1}
        min={0.125}
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
