import React from "react"

import RangeControls from "./RangeControls"

function RowSpacingControls({
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="rowSpacing"
      propertyName="Row spacing"
      propertyObj={{ alignmentVertical: "" }}
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

export default RowSpacingControls