import React from "react"

import RangeControls from "./RangeControls"

function ThicknessControls({
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="thickness"
      propertyName="Thickness"
      propertyObj={{ alignmentVertical: "", alignmentHorizontal: "" }}
      inputProps={{
        min: 0.088,
        max: 5,
        step: 0.001,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default ThicknessControls