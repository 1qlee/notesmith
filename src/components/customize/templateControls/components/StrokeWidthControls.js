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
        min: 0.088,
        max: 5,
        step: 0.01,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default StrokeWidthControls