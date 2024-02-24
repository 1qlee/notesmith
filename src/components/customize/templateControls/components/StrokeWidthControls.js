import React from "react"

import RangeControls from "./RangeControls"

function StrokeWidthControls({
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="strokeWidth"
      propertyName="Stroke width"
      propertyObj={{ alignmentVertical: "", alignmentHorizontal: "" }}
      inputProps={{
        min: 0.1,
        max: 1,
        step: 0.05,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default StrokeWidthControls