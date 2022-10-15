import React from "react"

import RangeControls from "./RangeControls"

function ColumnSpacingControls({
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="columnSpacing"
      propertyName="Column spacing"
      propertyObj={{ alignmentHorizontal: "" }}
      inputProps={{
        min: 1,
        max: 255,
        step: 1,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default ColumnSpacingControls